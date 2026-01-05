import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/tai-khoan',
  '/rao-vat/dang-tin',
];

// Routes that require admin role
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // For auth-protected routes, check for session cookie
  // If no session, redirect to login
  // NextAuth v5 uses authjs.* cookies, v4 uses next-auth.*
  const sessionToken = request.cookies.get('authjs.session-token') ||
                       request.cookies.get('__Secure-authjs.session-token') ||
                       request.cookies.get('next-auth.session-token') ||
                       request.cookies.get('__Secure-next-auth.session-token');

  // Check admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionToken) {
      const url = new URL('/dang-nhap', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    // Note: Role check happens server-side in admin layout
  }

  // Check protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionToken) {
      const url = new URL('/dang-nhap', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Add security headers
  const response = NextResponse.next();

  // HSTS
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Permissions policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
