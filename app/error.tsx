'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <span className="text-6xl">😔</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && error.digest && (
          <p className="mt-4 text-sm text-gray-500">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
