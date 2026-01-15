'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-gray-600">
          <p>
            Chúng tôi sử dụng cookies để cải thiện trải nghiệm của bạn và hiển thị quảng cáo phù hợp.
            Bằng việc tiếp tục sử dụng website, bạn đồng ý với{' '}
            <Link href="/chinh-sach-bao-mat" className="text-teal-600 hover:underline">
              Chính sách Bảo mật
            </Link>{' '}
            của chúng tôi.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            We use cookies to improve your experience and display relevant ads. By continuing to use this site, you agree to our Privacy Policy.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Từ chối
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            Đồng ý
          </button>
          <button
            onClick={declineCookies}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
