'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  userName: string;
  createdAt: string;
  helpful: number;
}

interface ReviewListProps {
  businessId: string;
}

export default function ReviewList({ businessId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [businessId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?businessId=${businessId}&status=approved`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">
        Reviews ({reviews.length})
      </h3>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {review.title && (
              <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
            )}

            <p className="text-gray-700 leading-relaxed">{review.comment}</p>

            {review.helpful > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
