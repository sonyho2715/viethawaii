'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { authenticate } from './actions';

export default function LoginClient() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const [state, formAction, isPending] = useActionState(authenticate, undefined);

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const errorParam = searchParams.get('error');

  // Show error from URL params or action state
  const displayError = state?.error
    ? (language === 'vn' ? 'Email hoặc mật khẩu không đúng' : state.error)
    : errorParam === 'CredentialsSignin'
      ? (language === 'vn' ? 'Email hoặc mật khẩu không đúng' : 'Invalid email or password')
      : errorParam
        ? (language === 'vn' ? 'Đã xảy ra lỗi. Vui lòng thử lại.' : 'Something went wrong. Please try again.')
        : null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {language === 'vn' ? 'Đăng nhập' : 'Sign In'}
          </CardTitle>
          <CardDescription>
            {language === 'vn'
              ? 'Đăng nhập để đăng tin và quản lý tài khoản'
              : 'Sign in to post listings and manage your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            {displayError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{displayError}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  {language === 'vn' ? 'Mật khẩu' : 'Password'}
                </Label>
                <Link
                  href="/quen-mat-khau"
                  className="text-sm text-red-600 hover:underline"
                >
                  {language === 'vn' ? 'Quên mật khẩu?' : 'Forgot password?'}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'vn' ? 'Đang đăng nhập...' : 'Signing in...'}
                </>
              ) : (
                language === 'vn' ? 'Đăng nhập' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {language === 'vn' ? 'Chưa có tài khoản? ' : "Don't have an account? "}
            </span>
            <Link href="/dang-ky" className="text-red-600 hover:underline font-medium">
              {language === 'vn' ? 'Đăng ký ngay' : 'Sign up'}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
