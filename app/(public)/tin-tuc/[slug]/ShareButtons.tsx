'use client';

import { useState } from 'react';
import { Share2, Facebook, Link2, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/tin-tuc/${slug}`
    : `/tin-tuc/${slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-[14px] text-gray-500 font-medium">Chia se:</span>

      <button
        onClick={shareToFacebook}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2] text-white rounded-md text-[13px] font-medium hover:bg-[#166FE5] transition-colors"
      >
        <Facebook className="h-3.5 w-3.5" />
        Facebook
      </button>

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-[13px] font-medium hover:bg-gray-200 transition-colors"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-600" />
            <span className="text-green-600">Da sao chep!</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            Sao chep link
          </>
        )}
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-[13px] font-medium hover:bg-gray-200 transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          Khac
        </button>
      )}
    </div>
  );
}
