'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, ShoppingBag, Eye, Bookmark, Sparkles } from 'lucide-react';

// Serialized types for client components (Decimal -> number, Date -> string)
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
  listingType?: string;
  jobType?: string | null;
  salary?: string | null;
  benefits?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sqft?: number | null;
  petFriendly?: boolean | null;
  utilities?: string | null;
  moveInDate?: string | null;
  serviceArea?: string | null;
  availability?: string | null;
  experience?: string | null;
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

// Category color map for badges
const CATEGORY_COLORS: Record<string, string> = {
  'nha-o': 'bg-blue-500',
  'viec-lam': 'bg-emerald-500',
  'cho-troi': 'bg-amber-500',
  'dich-vu': 'bg-purple-500',
  'cong-dong': 'bg-pink-500',
  'xe-co': 'bg-orange-500',
  'am-thuc': 'bg-red-500',
};

export default function ListingCard({ listing, variant = 'default' }: ListingCardProps) {
  const { t, language } = useLanguage();
  const primaryImage = listing.images.find(img => img.isPrimary) || listing.images[0];

  const formatPrice = (price: number | null, priceType: string) => {
    if (!price) {
      if (priceType === 'FREE') return language === 'vn' ? 'Miễn phi' : 'Free';
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

  // Check if listing is less than 24 hours old
  const isNew = () => {
    if (!listing.createdAt) return false;
    const diffMs = Date.now() - new Date(listing.createdAt).getTime();
    return diffMs < 86400000; // 24 hours
  };

  const categoryName = language === 'vn'
    ? listing.category.nameVn
    : (listing.category.nameEn || listing.category.nameVn);

  const categoryColor = CATEGORY_COLORS[listing.category.slug] || 'bg-gray-500';

  if (variant === 'horizontal') {
    return (
      <Link href={`/rao-vat/chi-tiet/${listing.id}`} className="block">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex">
          <div className="relative w-40 h-32 flex-shrink-0 overflow-hidden">
            {primaryImage ? (
              <Image
                src={primaryImage.imageUrl}
                alt={listing.title}
                fill
                sizes="160px"
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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
          <div className="relative h-32 overflow-hidden">
            {primaryImage ? (
              <Image
                src={primaryImage.imageUrl}
                alt={listing.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-gray-300" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-2">
              <p className="text-teal-700 font-bold text-sm">
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

  // Default variant
  return (
    <Link href={`/rao-vat/chi-tiet/${listing.id}`} className="block h-full">
      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full ring-1 ring-black/[0.02]">
        <div className="relative h-48 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.imageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-gray-200" />
            </div>
          )}
          
          {/* Minimal price overlay */}
          <div className="absolute top-0 right-0 bg-primary px-3 py-1.5 text-white">
            <p className="font-bold text-sm tracking-tight">
              {formatPrice(listing.price, listing.priceType)}
            </p>
          </div>
          
          {/* Category badge - minimalist */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-black text-primary px-2 py-1 uppercase tracking-[0.1em] border border-gray-100 shadow-sm">
            {categoryName}
          </div>
          
          {/* Featured badge - elegant */}
          {listing.isFeatured && (
            <div className="absolute top-3 left-3 bg-accent text-[10px] font-bold text-white px-2 py-1 shadow-md flex items-center gap-1 uppercase tracking-widest">
              <Sparkles size={10} className="fill-white" />
              {language === 'vn' ? 'Nổi bật' : 'Featured'}
            </div>
          )}
        </div>
        
        <div className="p-5 flex flex-col flex-1">
          <h4 className="font-serif font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {language === 'vn' ? listing.title : listing.titleEn || listing.title}
          </h4>
          <div className="flex items-center text-[11px] text-gray-400 mt-auto uppercase tracking-widest font-bold">
            <MapPin size={12} className="mr-1.5 text-accent flex-shrink-0" />
            <span className="truncate">{listing.location || 'Hawaii'}</span>
          </div>
        </div>
        
        <div className="px-5 py-3 border-t border-gray-50 flex justify-between items-center bg-gray-50/20">
          <div className="flex items-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
            <span>{formatDate(listing.createdAt)}</span>
            {listing.views > 0 && (
              <span className="flex items-center gap-1">
                <Eye size={12} className="opacity-50" />
                {listing.views}
              </span>
            )}
          </div>
          <Bookmark size={14} className="text-gray-300 group-hover:text-accent transition-colors" />
        </div>
      </div>
    </Link>
  );
}
