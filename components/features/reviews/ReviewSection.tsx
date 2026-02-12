'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, User, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import ReviewForm from './ReviewForm';

interface Review {
  id: number;
  rating: number;
  reviewText: string | null;
  transactionType: string | null;
  isVerified: boolean;
  createdAt: string;
  reviewer: {
    id: string;
    name: string | null;
    image: string | null;
  };
  listing: {
    id: number;
    title: string;
  } | null;
}

interface ReviewSectionProps {
  sellerId: string;
  sellerName: string | null;
  listingId?: number;
  currentUserId?: string;
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewSection({
  sellerId,
  sellerName,
  listingId,
  currentUserId,
}: ReviewSectionProps) {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async (pageNum: number = 1) => {
    try {
      const res = await fetch(
        `/api/reviews?userId=${sellerId}&page=${pageNum}&limit=5`
      );
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
        setTotalPages(data.totalPages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId]);

  const canReview = currentUserId && currentUserId !== sellerId;
  const hasReviewed = reviews.some((r) => r.reviewer.id === currentUserId);

  const handleReviewSubmitted = () => {
    setShowForm(false);
    fetchReviews(1);
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: language === 'vn' ? vi : enUS,
    });
  };

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded" />
              <div className="h-16 bg-gray-200 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              <MessageCircle className="h-5 w-5 inline mr-2" />
              {language === 'vn' ? 'Đánh giá người bán' : 'Seller Reviews'}
            </h3>
            {totalReviews > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={Math.round(averageRating)} size="lg" />
                <span className="text-lg font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({totalReviews} {language === 'vn' ? 'đánh giá' : 'reviews'})
                </span>
              </div>
            )}
          </div>
          {canReview && !hasReviewed && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-teal-600 hover:bg-teal-700"
              size="sm"
            >
              <Star className="h-4 w-4 mr-2" />
              {language === 'vn' ? 'Viết đánh giá' : 'Write Review'}
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="mb-6">
            <ReviewForm
              sellerId={sellerId}
              listingId={listingId}
              onSubmitted={handleReviewSubmitted}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Rating Distribution */}
        {totalReviews > 0 && (
          <div className="mb-6 pb-6 border-b">
            <div className="space-y-1.5">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-right text-gray-600">{star}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{
                        width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-xs text-gray-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">
              {language === 'vn'
                ? `Chưa có đánh giá nào cho ${sellerName || 'người bán này'}`
                : `No reviews yet for ${sellerName || 'this seller'}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={review.reviewer.image || undefined} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {review.reviewer.name || (language === 'vn' ? 'Người dùng' : 'User')}
                    </span>
                    {review.isVerified && (
                      <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                        {language === 'vn' ? 'Đã xác minh' : 'Verified'}
                      </span>
                    )}
                    {review.transactionType && (
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {review.transactionType === 'BUYER'
                          ? (language === 'vn' ? 'Người mua' : 'Buyer')
                          : (language === 'vn' ? 'Người bán' : 'Seller')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-gray-400">{formatTime(review.createdAt)}</span>
                  </div>
                  {review.reviewText && (
                    <p className="text-sm text-gray-700 mt-1">{review.reviewText}</p>
                  )}
                  {review.listing && (
                    <p className="text-xs text-gray-400 mt-1">
                      {language === 'vn' ? 'Tin:' : 'Listing:'} {review.listing.title}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchReviews(page - 1)}
              disabled={page <= 1}
            >
              {language === 'vn' ? 'Trước' : 'Prev'}
            </Button>
            <span className="text-sm text-gray-500 flex items-center px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchReviews(page + 1)}
              disabled={page >= totalPages}
            >
              {language === 'vn' ? 'Sau' : 'Next'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
