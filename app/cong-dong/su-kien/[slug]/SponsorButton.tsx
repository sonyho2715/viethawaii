'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';

interface SponsorButtonProps {
  eventId: string;
  isFeatured: boolean;
}

export default function SponsorButton({ eventId, isFeatured }: SponsorButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSponsor = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType: 'EVENT_SPONSOR',
          targetId: eventId,
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
      <div className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-center font-semibold rounded-lg flex items-center justify-center gap-2">
        <Star className="w-5 h-5 fill-current" />
        Sự Kiện Được Tài Trợ
      </div>
    );
  }

  return (
    <button
      onClick={handleSponsor}
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-center font-semibold rounded-lg hover:from-yellow-600 hover:to-amber-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Star className="w-5 h-5" />
      )}
      Tài Trợ Sự Kiện - $19.99
    </button>
  );
}
