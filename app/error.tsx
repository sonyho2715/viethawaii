'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Đã xảy ra lỗi
        </h1>
        <p className="text-gray-600 mb-4">
          Rất tiếc, đã có lỗi xảy ra khi xử lý yêu cầu của bạn.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Something went wrong while processing your request.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm text-red-800 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Thử lại
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Nếu lỗi vẫn tiếp tục,{' '}
            <Link href="/lien-he" className="text-orange-500 hover:underline">
              hãy liên hệ hỗ trợ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
