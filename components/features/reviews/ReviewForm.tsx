'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Star, Send, X } from 'lucide-react';

interface ReviewFormProps {
  sellerId: string;
  listingId?: number;
  onSubmitted: () => void;
  onCancel: () => void;
}

export default function ReviewForm({
  sellerId,
  listingId,
  onSubmitted,
  onCancel,
}: ReviewFormProps) {
  const { language } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [transactionType, setTransactionType] = useState<'BUYER' | 'SELLER' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError(language === 'vn' ? 'Vui lòng chọn số sao' : 'Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewedUserId: sellerId,
          listingId,
          rating,
          reviewText: reviewText.trim() || undefined,
          transactionType: transactionType || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError(language === 'vn' ? 'Vui lòng đăng nhập' : 'Please log in');
        } else if (res.status === 409) {
          setError(language === 'vn' ? 'Bạn đã đánh giá tin này rồi' : 'You already reviewed this listing');
        } else {
          setError(data.error || (language === 'vn' ? 'Có lỗi xảy ra' : 'Something went wrong'));
        }
        return;
      }

      onSubmitted();
    } catch {
      setError(language === 'vn' ? 'Có lỗi xảy ra' : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredRating || rating;

  const ratingLabels: Record<number, { vn: string; en: string }> = {
    1: { vn: 'Rất tệ', en: 'Terrible' },
    2: { vn: 'Tệ', en: 'Poor' },
    3: { vn: 'Bình thường', en: 'Average' },
    4: { vn: 'Tốt', en: 'Good' },
    5: { vn: 'Xuất sắc', en: 'Excellent' },
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 border">
      <h4 className="font-medium text-gray-900 mb-3">
        {language === 'vn' ? 'Viết đánh giá' : 'Write a Review'}
      </h4>

      {/* Star Rating Input */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1.5">
          {language === 'vn' ? 'Đánh giá của bạn' : 'Your Rating'} *
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= displayRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            </button>
          ))}
          {displayRating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {language === 'vn'
                ? ratingLabels[displayRating]?.vn
                : ratingLabels[displayRating]?.en}
            </span>
          )}
        </div>
      </div>

      {/* Transaction Type */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1.5">
          {language === 'vn' ? 'Bạn là' : 'You were'}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTransactionType(transactionType === 'BUYER' ? '' : 'BUYER')}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              transactionType === 'BUYER'
                ? 'bg-teal-50 border-teal-300 text-teal-700'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {language === 'vn' ? 'Người mua' : 'Buyer'}
          </button>
          <button
            type="button"
            onClick={() => setTransactionType(transactionType === 'SELLER' ? '' : 'SELLER')}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              transactionType === 'SELLER'
                ? 'bg-teal-50 border-teal-300 text-teal-700'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {language === 'vn' ? 'Người bán' : 'Seller'}
          </button>
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1.5">
          {language === 'vn' ? 'Nhận xét (tùy chọn)' : 'Comment (optional)'}
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          maxLength={1000}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          placeholder={
            language === 'vn'
              ? 'Chia sẻ trải nghiệm của bạn...'
              : 'Share your experience...'
          }
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          {reviewText.length}/1000
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 mb-3">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="bg-teal-600 hover:bg-teal-700"
          size="sm"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting
            ? (language === 'vn' ? 'Đang gửi...' : 'Submitting...')
            : (language === 'vn' ? 'Gửi đánh giá' : 'Submit Review')}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          {language === 'vn' ? 'Hủy' : 'Cancel'}
        </Button>
      </div>
    </form>
  );
}
