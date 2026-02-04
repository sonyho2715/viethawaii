/**
 * Production-ready rate limiter using Upstash Redis
 * Falls back to in-memory for development without Redis
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if Redis is configured
const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

// Create Redis client only if credentials exist
const redis = hasRedis
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Rate limiters using Upstash's sliding window algorithm
const rateLimiters = redis
  ? {
      login: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '60 s'), // 5 attempts per minute
        analytics: true,
        prefix: 'ratelimit:login',
      }),
      register: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '300 s'), // 3 registrations per 5 minutes
        analytics: true,
        prefix: 'ratelimit:register',
      }),
      createListing: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '3600 s'), // 10 listings per hour
        analytics: true,
        prefix: 'ratelimit:listing',
      }),
      upload: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '3600 s'), // 20 uploads per hour
        analytics: true,
        prefix: 'ratelimit:upload',
      }),
      forgotPassword: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '3600 s'), // 3 requests per hour
        analytics: true,
        prefix: 'ratelimit:forgot-password',
      }),
      api: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '60 s'), // 100 requests per minute
        analytics: true,
        prefix: 'ratelimit:api',
      }),
    }
  : null;

// Fallback in-memory store for development
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes (only for in-memory fallback)
if (!redis) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (entry.resetAt < now) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

type RateLimitType = 'login' | 'register' | 'createListing' | 'upload' | 'forgotPassword' | 'api';

/**
 * Check rate limit for a given identifier
 * Uses Upstash Redis in production, in-memory fallback for development
 */
export async function checkRateLimit(
  identifier: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  // Use Redis if available
  if (rateLimiters) {
    const limiter = rateLimiters[type];
    const result = await limiter.limit(identifier);

    return {
      success: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  }

  // Fallback to in-memory for development
  const options = RATE_LIMITS[type];
  const now = Date.now();
  const key = `${type}:${identifier}`;
  const windowMs = options.windowSeconds * 1000;

  let entry = memoryStore.get(key);

  // If no entry or entry has expired, create new one
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + windowMs,
    };
    memoryStore.set(key, entry);
    return {
      success: true,
      remaining: options.limit - 1,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > options.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    success: true,
    remaining: options.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Synchronous rate limit check for backward compatibility
 * Uses in-memory store (works in development, use Redis in production)
 */
export function checkRateLimitSync(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const windowMs = options.windowSeconds * 1000;

  let entry = memoryStore.get(key);

  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + windowMs,
    };
    memoryStore.set(key, entry);
    return {
      success: true,
      remaining: options.limit - 1,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;

  if (entry.count > options.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    success: true,
    remaining: options.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

// Alias for backward compatibility
export { checkRateLimitSync as checkRateLimitLegacy };

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Vercel-specific header (most reliable on Vercel)
  const vercelIP = request.headers.get('x-vercel-forwarded-for');
  if (vercelIP) {
    return vercelIP.split(',')[0].trim();
  }

  // Check x-forwarded-for
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // Check x-real-ip
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback
  return 'unknown';
}

// Preset rate limit configurations (used for in-memory fallback)
export const RATE_LIMITS = {
  login: { limit: 5, windowSeconds: 60 },           // 5 attempts per minute
  register: { limit: 3, windowSeconds: 300 },       // 3 registrations per 5 minutes
  createListing: { limit: 10, windowSeconds: 3600 }, // 10 listings per hour
  upload: { limit: 20, windowSeconds: 3600 },        // 20 uploads per hour
  forgotPassword: { limit: 3, windowSeconds: 3600 }, // 3 requests per hour
  api: { limit: 100, windowSeconds: 60 },           // 100 requests per minute
} as const;

/**
 * Check if Redis is configured (for health checks)
 */
export function isRedisConfigured(): boolean {
  return hasRedis;
}
