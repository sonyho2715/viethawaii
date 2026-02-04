import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';
import { GoogleSignInButton } from './GoogleSignInButton';

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || '/';
  const errorParam = params.error;

  const displayError = errorParam === 'CredentialsSignin'
    ? 'Email hoặc mật khẩu không đúng'
    : errorParam === 'OAuthAccountNotLinked'
      ? 'Email này đã được sử dụng với phương thức đăng nhập khác'
      : errorParam
        ? 'Đã xảy ra lỗi. Vui lòng thử lại.'
        : null;

  // Check if Google OAuth is configured
  const hasGoogleOAuth = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Đăng nhập để đăng tin và quản lý tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayError && (
            <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <span className="text-sm">{displayError}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          {hasGoogleOAuth && (
            <>
              <GoogleSignInButton callbackUrl={callbackUrl} />

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    hoặc đăng nhập với email
                  </span>
                </div>
              </div>
            </>
          )}

          <form action="/api/auth/login" method="POST" className="space-y-4" aria-label="Login form">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            {/* Honeypot field - hidden from users, bots will fill it */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
              aria-hidden="true"
            />

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
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link
                  href="/quen-mat-khau"
                  className="text-sm text-red-600 hover:underline"
                >
                  Quên mật khẩu?
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
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 px-4 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700 transition-colors"
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Link href="/dang-ky" className="text-red-600 hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
