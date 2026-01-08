'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, CheckCircle, XCircle, Loader2, Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Password validation states
  const [validations, setValidations] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    passwordsMatch: false,
  });

  useEffect(() => {
    setValidations({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      passwordsMatch: password.length > 0 && password === confirmPassword,
    });
  }, [password, confirmPassword]);

  const isValidPassword = validations.minLength &&
    validations.hasUppercase &&
    validations.hasLowercase &&
    validations.hasNumber &&
    validations.passwordsMatch;

  // Invalid link state
  if (!token || !email) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Link không hợp lệ</CardTitle>
          <CardDescription>
            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Vui lòng yêu cầu link đặt lại mật khẩu mới.
          </p>
          <Link
            href="/quen-mat-khau"
            className="flex items-center justify-center w-full h-10 px-4 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700 transition-colors"
          >
            Yêu cầu link mới
          </Link>
          <Link
            href="/dang-nhap"
            className="flex items-center justify-center w-full h-10 px-4 py-2 rounded-md text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Quay lại đăng nhập
          </Link>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidPassword) {
      setError('Vui lòng kiểm tra lại mật khẩu');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      } else {
        setIsSuccess(true);
      }
    } catch {
      setError('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Đặt lại mật khẩu thành công!</CardTitle>
          <CardDescription>
            Mật khẩu của bạn đã được cập nhật
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
          </p>
          <Link
            href="/dang-nhap"
            className="flex items-center justify-center w-full h-10 px-4 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700 transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Đặt lại mật khẩu</CardTitle>
        <CardDescription>
          Tạo mật khẩu mới cho tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              Đặt lại mật khẩu cho: <strong>{email}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu mới</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password requirements */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
            <p className="text-xs font-medium text-gray-600">Yêu cầu mật khẩu:</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <ValidationItem valid={validations.minLength} text="Ít nhất 8 ký tự" />
              <ValidationItem valid={validations.hasUppercase} text="1 chữ hoa (A-Z)" />
              <ValidationItem valid={validations.hasLowercase} text="1 chữ thường (a-z)" />
              <ValidationItem valid={validations.hasNumber} text="1 số (0-9)" />
            </div>
            <div className="pt-1 border-t border-gray-200">
              <ValidationItem valid={validations.passwordsMatch} text="Mật khẩu khớp nhau" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValidPassword}
            className="w-full h-10 px-4 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Đặt lại mật khẩu'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/dang-nhap" className="text-teal-600 hover:underline font-medium">
            Quay lại đăng nhập
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ValidationItem({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-1 ${valid ? 'text-green-600' : 'text-gray-400'}`}>
      {valid ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <div className="h-3 w-3 rounded-full border border-current" />
      )}
      <span>{text}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<LoadingState />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
