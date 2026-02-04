import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-orange-500 mb-2">404</div>
          <div className="text-6xl mb-4">🍜</div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Không tìm thấy trang
        </h1>
        <p className="text-gray-600 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>
          <Link
            href="/rao-vat"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Search className="w-5 h-5" />
            Tìm kiếm
          </Link>
        </div>

        {/* Back Button */}
        <BackButton />

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Cần hỗ trợ?{' '}
            <Link href="/lien-he" className="text-orange-500 hover:underline">
              Liên hệ chúng tôi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
