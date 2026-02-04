'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'viethawaii_cookie_consent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to prevent flash
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: true,
      analytics: true,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Icon and Message */}
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-700 text-sm">
                <strong>Thông báo về Cookie</strong> - Chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn trên trang web.{' '}
                <Link href="/chinh-sach-bao-mat" className="text-orange-600 hover:underline">
                  Tìm hiểu thêm
                </Link>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                We use cookies to enhance your browsing experience.{' '}
                <Link href="/privacy-policy" className="text-orange-600 hover:underline">
                  Learn more
                </Link>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={acceptEssential}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Chỉ cần thiết
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              Chấp nhận tất cả
            </button>
            <button
              onClick={acceptEssential}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors md:hidden"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
