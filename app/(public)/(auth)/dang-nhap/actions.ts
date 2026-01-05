'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function authenticate(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const callbackUrl = formData.get('callbackUrl') as string || '/';

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const url = new URL('/dang-nhap', process.env.NEXTAUTH_URL || 'http://localhost:3000');
      url.searchParams.set('error', error.type);
      url.searchParams.set('callbackUrl', callbackUrl);
      redirect(url.toString());
    }
    throw error;
  }

  // Success - redirect to callback URL
  redirect(callbackUrl);
}
