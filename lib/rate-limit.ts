/**
 * Rate Limiting Module
 * Protects against brute force attacks and API abuse
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RequestLog {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// In production, consider using Redis for distributed rate limiting
const requestStore = new Map<string, RequestLog>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, log] of requestStore.entries()) {
    if (now > log.resetTime) {
      requestStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Get client identifier (IP address or session ID)
 */
function getClientId(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';

  // Combine IP with path for more granular rate limiting
  const path = new URL(request.url).pathname;
  return `${ip}:${path}`;
}

/**
 * Check if request exceeds rate limit
 */
function isRateLimited(clientId: string, config: RateLimitConfig): {
  limited: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const log = requestStore.get(clientId);

  if (!log || now > log.resetTime) {
    // First request or window expired, create new log
    const resetTime = now + config.windowMs;
    requestStore.set(clientId, { count: 1, resetTime });
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  if (log.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      limited: true,
      remaining: 0,
      resetTime: log.resetTime,
    };
  }

  // Increment count
  log.count++;
  requestStore.set(clientId, log);

  return {
    limited: false,
    remaining: config.maxRequests - log.count,
    resetTime: log.resetTime,
  };
}

/**
 * Rate limit middleware
 */
export function rateLimit(config: RateLimitConfig) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const clientId = getClientId(request);
    const result = isRateLimited(clientId, config);

    if (result.limited) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);

      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetTime.toString(),
          },
        }
      );
    }

    const response = await handler(request);

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());

    return response;
  };
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  // Strict limit for authentication endpoints (prevent brute force)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  // Moderate limit for API endpoints
  api: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 60,
  },
  // Generous limit for public endpoints
  public: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 100,
  },
  // Very strict for sensitive operations
  sensitive: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
  },
};
