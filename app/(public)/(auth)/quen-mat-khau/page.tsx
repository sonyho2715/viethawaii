import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Clock, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Quên mật khẩu - VietHawaii',
  description: 'Khôi phục mật khẩu tài khoản VietHawaii',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quên mật khẩu?</CardTitle>
          <CardDescription>
            Đừng lo, chúng tôi sẽ giúp bạn khôi phục tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Coming Soon Notice */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Tính năng đang phát triển
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Hệ thống đặt lại mật khẩu qua email sẽ sớm được ra mắt.
                  Trong thời gian chờ đợi, vui lòng liên hệ với chúng tôi để được hỗ trợ.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-teal-800">
                  Liên hệ hỗ trợ
                </p>
                <p className="text-sm text-teal-700 mt-1">
                  Gửi email đến{' '}
                  <a
                    href="mailto:support@viethawaii.com"
                    className="font-medium underline hover:text-teal-800"
                  >
                    support@viethawaii.com
                  </a>
                  {' '}với địa chỉ email đăng ký của bạn và chúng tôi sẽ hỗ trợ đặt lại mật khẩu trong vòng 24 giờ.
                </p>
              </div>
            </div>
          </div>

          {/* Email Input (for future use, currently disabled) */}
          <div className="space-y-2 opacity-50">
            <Label htmlFor="email" className="text-gray-500">
              Email đăng ký
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="pl-10"
                disabled
              />
            </div>
            <p className="text-xs text-gray-400">
              Tính năng này sẽ sớm được kích hoạt
            </p>
          </div>

          {/* Back to Login */}
          <Link
            href="/dang-nhap"
            className="flex items-center justify-center gap-2 w-full h-10 px-4 py-2 rounded-md text-teal-700 font-medium bg-teal-50 hover:bg-teal-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>

          {/* Register Link */}
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
