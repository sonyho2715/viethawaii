/**
 * CSRF Protection utilities
 * Next.js App Router with Server Actions has built-in CSRF protection.
 * This module provides additional utilities for API routes and custom forms.
 */

import { cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_TOKEN_NAME = 'csrf_token';
const CSRF_TOKEN_HEADER = 'x-csrf-token';
const TOKEN_LENGTH = 32;

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(TOKEN_LENGTH).toString('hex');
}

/**
 * Get or create CSRF token from cookies (for server components)
 */
export async function getCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  let token = cookieStore.get(CSRF_TOKEN_NAME)?.value;

  if (!token) {
    token = generateCsrfToken();
    // Note: Setting cookies in Server Components is limited
    // Token should be set via middleware or API route
  }

  return token;
}

/**
 * Validate CSRF token from request
 * For API routes that need additional CSRF protection
 */
export async function validateCsrfToken(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER);
  const formData = request.headers.get('content-type')?.includes('application/x-www-form-urlencoded')
    ? await request.clone().formData().catch(() => null)
    : null;
  const bodyToken = formData?.get('_csrf') as string | null;

  // Get token from header or form body
  const submittedToken = headerToken || bodyToken;

  if (!cookieToken || !submittedToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(submittedToken)
  );
}

/**
 * CSRF validation middleware for API routes
 * Usage:
 * ```
 * export async function POST(request: Request) {
 *   const csrfValid = await validateCsrfToken(request);
 *   if (!csrfValid) {
 *     return new Response('Invalid CSRF token', { status: 403 });
 *   }
 *   // ... rest of the handler
 * }
 * ```
 */

/**
 * Note on Next.js CSRF Protection:
 *
 * 1. Server Actions (recommended):
 *    - Next.js Server Actions have built-in CSRF protection
 *    - The framework validates the origin header automatically
 *    - No additional CSRF tokens needed for Server Actions
 *
 * 2. API Routes:
 *    - For state-changing operations (POST, PUT, DELETE, PATCH)
 *    - Consider using this CSRF validation if:
 *      a) The API is called from forms (not fetch with credentials)
 *      b) Extra security is needed beyond Same-Origin Policy
 *
 * 3. Same-Origin Policy:
 *    - Modern browsers enforce Same-Origin Policy
 *    - With proper CORS settings, most CSRF attacks are prevented
 *    - JSON APIs with Content-Type: application/json are safer
 *
 * For this application:
 * - Server Actions are preferred for mutations
 * - API routes use proper authentication checks
 * - Rate limiting is in place to prevent abuse
 * - These combined provide robust security
 */

export const csrfConfig = {
  tokenName: CSRF_TOKEN_NAME,
  headerName: CSRF_TOKEN_HEADER,
  tokenLength: TOKEN_LENGTH,
};
