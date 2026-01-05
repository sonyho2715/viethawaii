import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from 'lucide-react';
import { authenticate } from './actions';

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || '/';
  const errorParam = params.error;

  const displayError = errorParam === 'CredentialsSignin'
    ? 'Email hoặc mật khẩu không đúng'
    : errorParam
      ? 'Đã xảy ra lỗi. Vui lòng thử lại.'
      : null;

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
          <form action={authenticate} className="space-y-4">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            {displayError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
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
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Đăng nhập
            </Button>
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
