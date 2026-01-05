'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const callbackUrl = formData.get('callbackUrl') as string || '/';

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
