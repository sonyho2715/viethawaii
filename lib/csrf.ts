/**
 * CSRF Protection Module
 * Protects against Cross-Site Request Forgery attacks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_HEADER = 'x-csrf-token';
const CSRF_SESSION_KEY = 'csrfToken';

/**
 * Generate a random CSRF token
 */
function generateToken(): string {
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create CSRF token for the current session
 */
export async function getCsrfToken(): Promise<string> {
  const session = await getSession();

  if (!session.csrfToken) {
    session.csrfToken = generateToken();
    await session.save();
  }

  return session.csrfToken;
}

/**
 * Verify CSRF token from request
 */
export async function verifyCsrfToken(request: NextRequest): Promise<boolean> {
  const session = await getSession();
  const tokenFromHeader = request.headers.get(CSRF_HEADER);

  if (!tokenFromHeader || !session.csrfToken) {
    return false;
  }

  return tokenFromHeader === session.csrfToken;
}

/**
 * Middleware to protect routes with CSRF validation
 * Use this for state-changing operations (POST, PUT, PATCH, DELETE)
 */
export async function requireCsrfToken(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Only check CSRF for state-changing methods
  const stateMutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (!stateMutatingMethods.includes(request.method)) {
    return handler(request);
  }

  // Verify CSRF token
  const isValid = await verifyCsrfToken(request);

  if (!isValid) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid CSRF token. Please refresh and try again.'
      },
      { status: 403 }
    );
  }

  return handler(request);
}

/**
 * Add CSRF token to session interface
 */
declare module '@/lib/auth/session' {
  interface SessionData {
    csrfToken?: string;
  }
}
