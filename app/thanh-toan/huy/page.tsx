import { Metadata } from 'next';
import Link from 'next/link';
import { XCircle, ArrowLeft, MessageCircle, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Thanh Toán Bị Hủy | VietHawaii',
  description: 'Thanh toán của bạn đã bị hủy.',
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 bg-gray-50">
        <div className="max-w-lg mx-auto px-4 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-gray-400" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thanh Toán Bị Hủy
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Không sao cả! Bạn có thể quay lại và thử lại bất cứ lúc nào.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-blue-900 mb-2">Có thắc mắc?</h2>
            <p className="text-blue-700 text-sm">
              Nếu bạn gặp vấn đề trong quá trình thanh toán hoặc có câu hỏi về các gói dịch vụ,
              đừng ngần ngại liên hệ với chúng tôi. Chúng tôi luôn sẵn sàng hỗ trợ!
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/thanh-toan"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay Lại Trang Nâng Cấp
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              <Home className="w-5 h-5" />
              Về Trang Chủ
            </Link>
          </div>

          {/* Support Link */}
          <p className="mt-8 text-sm text-gray-500">
            Cần hỗ trợ?{' '}
            <Link href="/contact" className="text-indigo-600 hover:underline inline-flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              Liên hệ với chúng tôi
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
