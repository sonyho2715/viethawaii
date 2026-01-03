import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Home, FileText, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Thanh Toán Thành Công | VietHawaii',
  description: 'Cảm ơn bạn đã mua hàng!',
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 bg-gray-50">
        <div className="max-w-lg mx-auto px-4 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thanh Toán Thành Công!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Cảm ơn bạn đã mua hàng. Gói dịch vụ của bạn đã được kích hoạt ngay lập tức.
          </p>

          {/* Confirmation Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">Bước tiếp theo</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Kiểm tra email</p>
                  <p className="text-sm text-gray-500">Chúng tôi đã gửi biên lai đến email của bạn</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tận hưởng tính năng mới</p>
                  <p className="text-sm text-gray-500">Các tính năng cao cấp đã được kích hoạt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              <Home className="w-5 h-5" />
              Trang Chủ
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              <Building2 className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/rao-vat"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              <FileText className="w-5 h-5" />
              Rao Vặt
            </Link>
          </div>

          {/* Support Link */}
          <p className="mt-8 text-sm text-gray-500">
            Cần hỗ trợ?{' '}
            <Link href="/contact" className="text-green-600 hover:underline">
              Liên hệ với chúng tôi
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
