'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { MapPin, Clock, Eye, Heart, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    titleEn?: string | null;
    description: string;
    descriptionEn?: string | null;
    price?: string | number | null;
    priceType: string;
    island: string;
    city?: string | null;
    images: string[];
    viewCount: number;
    urgent: boolean;
    featured: boolean;
    createdAt: Date | string;
    category: {
      name: string;
      nameEn?: string | null;
      icon?: string | null;
    };
  };
  variant?: 'default' | 'compact';
}

export default function ListingCard({ listing, variant = 'default' }: ListingCardProps) {
  const { language, getText } = useLanguage();

  const formatPrice = () => {
    if (listing.priceType === 'free') {
      return language === 'vi' ? 'Miễn phí' : 'Free';
    }
    if (listing.priceType === 'contact') {
      return language === 'vi' ? 'Liên hệ' : 'Contact';
    }
    if (listing.price) {
      const price = typeof listing.price === 'string' ? parseFloat(listing.price) : listing.price;
      return `$${price.toLocaleString()}`;
    }
    return language === 'vi' ? 'Liên hệ' : 'Contact';
  };

  const formatLocation = () => {
    const parts = [];
    if (listing.city) parts.push(listing.city);
    parts.push(listing.island.charAt(0).toUpperCase() + listing.island.slice(1));
    return parts.join(', ');
  };

  const timeAgo = formatDistanceToNow(
    typeof listing.createdAt === 'string' ? new Date(listing.createdAt) : listing.createdAt,
    language
  );

  if (variant === 'compact') {
    return (
      <Link
        href={`/rao-vat/${listing.id}`}
        className="block bg-white rounded-lg border border-gray-200 hover:shadow-md transition p-4"
      >
        <div className="flex gap-4">
          {/* Image */}
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {listing.images?.[0] ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                {listing.category.icon || '📦'}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {getText(listing.title, listing.titleEn)}
            </h3>
            <p className="text-rose-600 font-bold">{formatPrice()}</p>
            <p className="text-sm text-gray-500">{formatLocation()}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/rao-vat/${listing.id}`}
      className="block bg-white rounded-xl border border-gray-200 hover:shadow-lg transition overflow-hidden group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {listing.images?.[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {listing.category.icon || '📦'}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.urgent && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {language === 'vi' ? 'KHẨN' : 'URGENT'}
            </span>
          )}
          {listing.featured && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
              {language === 'vi' ? 'NỔI BẬT' : 'FEATURED'}
            </span>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-rose-600 font-bold rounded-full shadow-lg">
            {formatPrice()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">{listing.category.icon}</span>
          <span className="text-sm text-gray-500">
            {getText(listing.category.name, listing.category.nameEn)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition">
          {getText(listing.title, listing.titleEn)}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {formatLocation()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {timeAgo}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <Eye className="w-4 h-4" />
            {listing.viewCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
