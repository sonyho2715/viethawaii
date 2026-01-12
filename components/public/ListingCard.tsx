'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, ShoppingBag } from 'lucide-react';
// Serialized types for client components (Decimal → number, Date → string)
export interface SerializedNeighborhood {
  id: number;
  slug: string;
  name: string;
  island: string | null;
  region: string | null;
  vietnameseCommunity: boolean;
  avgRent1br: number | null;
  avgRent2br: number | null;
  lat: number | null;
  lng: number | null;
  descriptionVn: string | null;
  descriptionEn: string | null;
}

export interface SerializedListingImage {
  id: number;
  listingId: number;
  imageUrl: string;
  thumbnailUrl: string | null;
  cloudinaryId: string | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string | null;
}

export interface SerializedCategory {
  id: number;
  parentId: number | null;
  slug: string;
  nameVn: string;
  nameEn: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string | null;
}

export interface ListingWithRelations {
  id: number;
  userId: string;
  categoryId: number;
  neighborhoodId: number | null;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  price: number | null;
  priceType: string;
  location: string | null;
  lat: number | null;
  lng: number | null;
  contactPhone: string | null;
  contactEmail: string | null;
  zaloNumber: string | null;
  hidePhone: boolean;
  preferredContact: string | null;
  status: string;
  rejectionReason: string | null;
  isFeatured: boolean;
  featuredUntil: string | null;
  featuredTier: string | null;
  views: number;
  createdAt: string | null;
  updatedAt: string | null;
  approvedAt: string | null;
  expiresAt: string | null;
  category: SerializedCategory;
  images: SerializedListingImage[];
  _count?: {
    savedBy: number;
  };
  // Listing type
  listingType?: string;
  // Job-specific fields
  jobType?: string | null;
  salary?: string | null;
  benefits?: string | null;
  // Housing-specific fields
  bedrooms?: number | null;
  bathrooms?: number | null;
  sqft?: number | null;
  petFriendly?: boolean | null;
  utilities?: string | null;
  moveInDate?: string | null;
  // Service-specific fields
  serviceArea?: string | null;
  availability?: string | null;
  experience?: string | null;
  // Extended relations (optional)
  neighborhood?: {
    id: number;
    nameVn: string;
    nameEn: string | null;
    slug: string;
  } | null;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
    createdAt: string;
    _count?: {
      listings: number;
    };
  };
}

interface ListingCardProps {
  listing: ListingWithRelations;
  variant?: 'default' | 'compact' | 'horizontal';
}

export default function ListingCard({ listing, variant = 'default' }: ListingCardProps) {
  const { t, language } = useLanguage();
  const primaryImage = listing.images.find(img => img.isPrimary) || listing.images[0];

  const formatPrice = (price: number | null, priceType: string) => {
    if (!price) {
      if (priceType === 'FREE') return language === 'vn' ? 'Miễn phí' : 'Free';
      if (priceType === 'NEGOTIABLE') return language === 'vn' ? 'Thương lượng' : 'Negotiable';
      return language === 'vn' ? 'Liên hệ' : 'Contact';
    }
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);

    if (priceType === 'HOURLY') return `${formatted}/hr`;
    if (priceType === 'MONTHLY') return `${formatted}/mo`;
    return formatted;
  };

  // Date is already serialized as ISO string from server
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return language === 'vn' ? 'Vừa xong' : 'Just now';
    if (diffMins < 60) return `${diffMins} ${language === 'vn' ? 'phút trước' : 'mins ago'}`;
    if (diffHours < 24) return `${diffHours} ${language === 'vn' ? 'giờ trước' : 'hours ago'}`;
    if (diffDays < 7) return `${diffDays} ${language === 'vn' ? 'ngày trước' : 'days ago'}`;
    return date.toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US');
  };

  // Get category display name
  const categoryName = language === 'vn'
    ? listing.category.nameVn
    : (listing.category.nameEn || listing.category.nameVn);

  if (variant === 'horizontal') {
    return (
      <Link href={`/rao-vat/chi-tiet/${listing.id}`} className="block">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group flex">
          <div className="relative w-40 h-32 flex-shrink-0 overflow-hidden">
            {primaryImage ? (
              <Image
                src={primaryImage.imageUrl}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-gray-300" />
              </div>
            )}
          </div>
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div>
              <p className="font-bold text-teal-600 mb-1">
                {formatPrice(listing.price, listing.priceType)}
              </p>
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-teal-600 transition-colors">
                {language === 'vn' ? listing.title : listing.titleEn || listing.title}
              </h4>
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <MapPin size={12} className="mr-1" />
              {listing.location || 'Hawaii'}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/rao-vat/chi-tiet/${listing.id}`} className="block">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
          <div className="relative h-32 overflow-hidden">
            {primaryImage ? (
              <Image
                src={primaryImage.imageUrl}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-gray-300" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-white font-bold text-sm">
                {formatPrice(listing.price, listing.priceType)}
              </p>
            </div>
          </div>
          <div className="p-2">
            <h4 className="font-medium text-gray-900 text-xs line-clamp-2 group-hover:text-teal-600 transition-colors">
              {language === 'vn' ? listing.title : listing.titleEn || listing.title}
            </h4>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant - matches the new design
  return (
    <Link href={`/rao-vat/chi-tiet/${listing.id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
        <div className="relative h-40 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.imageUrl}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white font-bold text-lg">
              {formatPrice(listing.price, listing.priceType)}
            </p>
          </div>
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold text-gray-700 px-2 py-1 rounded shadow-sm">
            {categoryName}
          </div>
          {listing.isFeatured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-xs font-bold text-white px-2 py-1 rounded shadow-sm">
              {language === 'vn' ? 'Nổi bật' : 'Featured'}
            </div>
          )}
        </div>
        <div className="p-3">
          <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 h-10 group-hover:text-teal-600 transition-colors">
            {language === 'vn' ? listing.title : listing.titleEn || listing.title}
          </h4>
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <MapPin size={12} className="mr-1" />
            {listing.location || 'Hawaii'}
          </div>
        </div>
        <div className="px-3 py-2 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
          <span className="text-[10px] text-gray-400">{formatDate(listing.createdAt)}</span>
          <span className="text-teal-600 text-xs font-medium hover:underline">
            {language === 'vn' ? 'Chi tiết' : 'Details'}
          </span>
        </div>
      </div>
    </Link>
  );
}
