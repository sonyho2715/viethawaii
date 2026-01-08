'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setError(data.error || 'Quá nhiều yêu cầu. Vui lòng thử lại sau.');
      } else if (!response.ok) {
        setError(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      } else {
        setIsSubmitted(true);
      }
    } catch {
      setError('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Kiểm tra email</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-teal-800">
                Nếu email <strong>{email}</strong> tồn tại trong hệ thống,
                bạn sẽ nhận được email với link đặt lại mật khẩu trong vài phút tới.
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p className="font-medium">Không nhận được email?</p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li>Kiểm tra thư mục Spam/Junk</li>
                <li>Đảm bảo bạn nhập đúng email đã đăng ký</li>
                <li>Chờ vài phút và thử lại</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full h-10 px-4 py-2 rounded-md text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Thử email khác
              </button>

              <Link
                href="/dang-nhap"
                className="flex items-center justify-center gap-2 w-full h-10 px-4 py-2 rounded-md text-teal-700 font-medium bg-teal-50 hover:bg-teal-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quên mật khẩu?</CardTitle>
          <CardDescription>
            Nhập email đăng ký để nhận link đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email đăng ký</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-10 px-4 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi link đặt lại mật khẩu'
              )}
            </button>
          </form>

          <Link
            href="/dang-nhap"
            className="flex items-center justify-center gap-2 w-full h-10 px-4 py-2 rounded-md text-teal-700 font-medium bg-teal-50 hover:bg-teal-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>

          <div className="text-center text-sm">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Link href="/dang-ky" className="text-teal-600 hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
