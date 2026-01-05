'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  X,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Decimal } from '@prisma/client/runtime/library';

interface ListingImage {
  id: number;
  imageUrl: string;
}

interface Listing {
  id: number;
  title: string;
  titleEn: string | null;
  description: string | null;
  price: Decimal | null;
  priceType: string;
  location: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  zaloNumber: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
    _count: { listings: number };
  };
  category: {
    id: number;
    nameVn: string;
    slug: string;
  };
  neighborhood: {
    name: string;
  } | null;
  images: ListingImage[];
}

interface PendingListingCardProps {
  listing: Listing;
  index: number;
  total: number;
}

export default function PendingListingCard({
  listing,
  index,
  total,
}: PendingListingCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });

      if (!res.ok) throw new Error('Failed to approve');

      router.refresh();
    } catch (error) {
      alert('Có lỗi xảy ra');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Lý do từ chối (tùy chọn):');
    if (reason === null) return; // User cancelled

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          rejectionReason: reason || undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to reject');

      router.refresh();
    } catch (error) {
      alert('Có lỗi xảy ra');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    if (listing.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing.images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + listing.images.length) % listing.images.length
      );
    }
  };

  const formatPrice = (price: Decimal | null, priceType: string) => {
    if (!price && priceType === 'FREE') return 'Miễn phí';
    if (!price) return 'Liên hệ';
    const numPrice = Number(price);
    const formatted = numPrice.toLocaleString('en-US');
    switch (priceType) {
      case 'HOURLY':
        return `$${formatted}/giờ`;
      case 'MONTHLY':
        return `$${formatted}/tháng`;
      case 'NEGOTIABLE':
        return `$${formatted} (thương lượng)`;
      default:
        return `$${formatted}`;
    }
  };

  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded">
            {index} / {total}
          </span>
          <span className="text-sm text-gray-600">
            Đăng {daysSinceCreated === 0 ? 'hôm nay' : `${daysSinceCreated} ngày trước`}
          </span>
        </div>
        <Link
          href={`/rao-vat/chi-tiet/${listing.id}`}
          target="_blank"
          className="flex items-center gap-1 text-sm text-teal-600 hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Xem chi tiết
        </Link>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Images */}
          <div>
            {listing.images.length > 0 ? (
              <div className="relative">
                <img
                  src={listing.images[currentImageIndex].imageUrl}
                  alt={listing.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                      {currentImageIndex + 1} / {listing.images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Không có hình ảnh</span>
              </div>
            )}

            {/* Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      idx === currentImageIndex
                        ? 'border-teal-500'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            {/* Title & Category */}
            <div>
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-2">
                {listing.category.nameVn}
              </span>
              <h2 className="text-xl font-bold text-gray-900">{listing.title}</h2>
              {listing.titleEn && (
                <p className="text-sm text-gray-500 mt-1">{listing.titleEn}</p>
              )}
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-teal-600">
              {formatPrice(listing.price, listing.priceType)}
            </div>

            {/* Location */}
            {(listing.location || listing.neighborhood) && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {listing.location}
                  {listing.location && listing.neighborhood && ', '}
                  {listing.neighborhood?.name}
                </span>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap text-sm">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-2">
              {listing.contactPhone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{listing.contactPhone}</span>
                </div>
              )}
              {listing.contactEmail && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{listing.contactEmail}</span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {listing.user.name || 'Chưa đặt tên'}
                  </p>
                  <p className="text-sm text-gray-600">{listing.user.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Tham gia{' '}
                      {new Date(listing.user.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span>{listing.user._count.listings} tin đăng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-5 w-5 mr-2" />
            {isLoading ? 'Đang xử lý...' : 'Duyệt tin'}
          </Button>
          <Button
            onClick={handleReject}
            disabled={isLoading}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            <X className="h-5 w-5 mr-2" />
            Từ chối
          </Button>
        </div>
      </div>
    </div>
  );
}
