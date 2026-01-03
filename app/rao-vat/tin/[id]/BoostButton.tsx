'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BoostButtonProps {
  listingId: string;
  isFeatured: boolean;
}

export default function BoostButton({ listingId, isFeatured }: BoostButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBoost = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType: 'CLASSIFIED_BOOST',
          targetId: listingId,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch {
      alert('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (isFeatured) {
    return (
      <div className="w-full px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-semibold text-center flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4" />
        Đang Nổi Bật
      </div>
    );
  }

  return (
    <button
      onClick={handleBoost}
      disabled={loading}
      className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
      Đẩy Tin Nổi Bật - $9.99
    </button>
  );
}
