'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { GoogleSignInButton } from '../dang-nhap/GoogleSignInButton';
import { FacebookSignInButton } from '../dang-nhap/FacebookSignInButton';

export default function RegisterPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot

  const validatePassword = (pwd: string) => {
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
    };
    return checks;
  };

  const passwordChecks = validatePassword(password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!name.trim()) {
      setError(language === 'vn' ? 'Vui lòng nhập tên' : 'Please enter your name');
      return;
    }

    if (!isPasswordValid) {
      setError(
        language === 'vn'
          ? 'Mật khẩu chưa đủ mạnh'
          : 'Password does not meet requirements'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        language === 'vn'
          ? 'Mật khẩu xác nhận không khớp'
          : 'Passwords do not match'
      );
      return;
    }

    if (!agreeTerms) {
      setError(
        language === 'vn'
          ? 'Vui lòng đồng ý với điều khoản sử dụng'
          : 'Please agree to the terms of service'
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, website: honeypot }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto sign in after registration
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/');
        router.refresh();
      } else {
        router.push('/dang-nhap');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === 'vn'
          ? 'Đã xảy ra lỗi. Vui lòng thử lại.'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {language === 'vn' ? 'Đăng ký tài khoản' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {language === 'vn'
              ? 'Tạo tài khoản miễn phí để bắt đầu đăng tin'
              : 'Create a free account to start posting listings'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* OAuth Sign-Up Buttons */}
          <div className="space-y-3 mb-4">
            <FacebookSignInButton callbackUrl="/" />
            <GoogleSignInButton callbackUrl="/" />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                {language === 'vn' ? 'hoặc đăng ký với email' : 'or register with email'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Registration form">
            {/* Honeypot field - hidden from users, bots will fill it */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
              aria-hidden="true"
            />

            {error && (
              <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">
                {language === 'vn' ? 'Họ và tên' : 'Full Name'}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'vn' ? 'Nguyễn Văn A' : 'John Doe'}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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

            <div className="space-y-2">
              <Label htmlFor="password">
                {language === 'vn' ? 'Mật khẩu' : 'Password'}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="mt-2 space-y-1 text-xs" aria-live="polite" aria-label="Password requirements">
                  <PasswordCheck
                    valid={passwordChecks.length}
                    text={language === 'vn' ? 'Ít nhất 8 ký tự' : 'At least 8 characters'}
                  />
                  <PasswordCheck
                    valid={passwordChecks.uppercase}
                    text={language === 'vn' ? 'Có chữ in hoa' : 'One uppercase letter'}
                  />
                  <PasswordCheck
                    valid={passwordChecks.lowercase}
                    text={language === 'vn' ? 'Có chữ thường' : 'One lowercase letter'}
                  />
                  <PasswordCheck
                    valid={passwordChecks.number}
                    text={language === 'vn' ? 'Có số' : 'One number'}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {language === 'vn' ? 'Xác nhận mật khẩu' : 'Confirm Password'}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-600">
                  {language === 'vn' ? 'Mật khẩu không khớp' : 'Passwords do not match'}
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                {language === 'vn' ? (
                  <>
                    Tôi đồng ý với{' '}
                    <Link href="/dieu-khoan" className="text-red-600 hover:underline">
                      Điều khoản sử dụng
                    </Link>{' '}
                    và{' '}
                    <Link href="/chinh-sach-bao-mat" className="text-red-600 hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </>
                ) : (
                  <>
                    I agree to the{' '}
                    <Link href="/dieu-khoan" className="text-red-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/chinh-sach-bao-mat" className="text-red-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </>
                )}
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading || !agreeTerms}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'vn' ? 'Đang đăng ký...' : 'Creating account...'}
                </>
              ) : (
                language === 'vn' ? 'Đăng ký' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {language === 'vn' ? 'Đã có tài khoản? ' : 'Already have an account? '}
            </span>
            <Link href="/dang-nhap" className="text-red-600 hover:underline font-medium">
              {language === 'vn' ? 'Đăng nhập' : 'Sign in'}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PasswordCheck({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-1 ${valid ? 'text-green-600' : 'text-gray-400'}`}>
      <CheckCircle className={`h-3 w-3 ${valid ? 'text-green-600' : 'text-gray-300'}`} />
      {text}
    </div>
  );
}
