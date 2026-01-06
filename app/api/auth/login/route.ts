'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`login:${clientIP}`, RATE_LIMITS.login);

  if (!rateLimit.success) {
    const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      {
        success: false,
        error: 'Quá nhiều lần đăng nhập. Vui lòng thử lại sau.',
        retryAfter
      },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) }
      }
    );
  }

  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const callbackUrl = formData.get('callbackUrl') as string || '/';

  // Honeypot check - if this field is filled, it's a bot
  const honeypot = formData.get('website') as string;
  if (honeypot) {
    // Silently reject but pretend success to confuse bots
    return NextResponse.redirect(new URL('/dang-nhap?error=InvalidCredentials', request.url));
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    // Success - redirect to callback URL
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  } catch (error) {
    if (error instanceof AuthError) {
      const url = new URL('/dang-nhap', request.url);
      url.searchParams.set('error', error.type);
      url.searchParams.set('callbackUrl', callbackUrl);
      return NextResponse.redirect(url);
    }

    // Unknown error - redirect with generic error
    const url = new URL('/dang-nhap', request.url);
    url.searchParams.set('error', 'UnknownError');
    url.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(url);
  }
}
