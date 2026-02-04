'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="text-6xl mb-4">⚠️</div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Lỗi hệ thống
          </h1>
          <p className="text-gray-600 mb-4">
            Đã xảy ra lỗi nghiêm trọng. Vui lòng thử lại sau.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            A critical error occurred. Please try again later.
          </p>

          {/* Error ID */}
          {error.digest && (
            <p className="text-xs text-gray-400 mb-8">
              Error ID: {error.digest}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              🔄 Thử lại
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              🏠 Về trang chủ
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
