import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isRedisConfigured } from '@/lib/rate-limit';

/**
 * Health check endpoint for monitoring
 * GET /api/health
 */
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: { status: 'unknown' as string, latencyMs: 0 },
      redis: { status: 'unknown' as string, configured: false },
    },
  };

  // Check database connectivity
  const dbStart = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    health.services.database = {
      status: 'healthy',
      latencyMs: Date.now() - dbStart,
    };
  } catch (error) {
    health.status = 'unhealthy';
    health.services.database = {
      status: 'unhealthy',
      latencyMs: Date.now() - dbStart,
    };
    console.error('Database health check failed:', error);
  }

  // Check Redis configuration
  health.services.redis = {
    status: isRedisConfigured() ? 'configured' : 'not_configured',
    configured: isRedisConfigured(),
  };

  // Return appropriate status code
  const statusCode = health.status === 'healthy' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
