import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, JWTPayload } from './auth';

/**
 * Middleware to require authentication
 * Returns 401 if not authenticated
 */
export async function requireAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({
      success: false,
      error: 'Authentication required'
    }, { status: 401 });
  }

  return handler(request, user);
}

/**
 * Middleware to require admin role
 * Returns 401 if not authenticated, 403 if not admin
 */
export async function requireAdmin(
  request: NextRequest,
  handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({
      success: false,
      error: 'Authentication required'
    }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({
      success: false,
      error: 'Admin access required'
    }, { status: 403 });
  }

  return handler(request, user);
}

/**
 * Optional auth middleware - attaches user if authenticated
 * Does not require authentication
 */
export async function optionalAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: JWTPayload | null) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await getCurrentUser();
  return handler(request, user);
}
