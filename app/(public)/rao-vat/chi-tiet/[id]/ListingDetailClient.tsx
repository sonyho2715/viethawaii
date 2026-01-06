'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import ListingCard, {
  type ListingWithRelations,
  type SerializedCategory,
  type SerializedListingImage,
  type SerializedNeighborhood,
} from '@/components/public/ListingCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Eye,
  Phone,
  Mail,
  MessageCircle,
  Heart,
  Share2,
  Flag,
  ShoppingBag,
  User,
  Calendar,
  Tag,
  X,
} from 'lucide-react';

// Serialized types for client component (Date → string, Decimal → number)
interface SerializedUser {
  id: string;
  name: string | null;
  image: string | null;
  createdAt: string;
  _count: {
    listings: number;
  };
}

export interface ListingWithDetails {
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
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  expiresAt: string | null;
  category: SerializedCategory;
  images: SerializedListingImage[];
  neighborhood: SerializedNeighborhood | null;
  user: SerializedUser;
}

interface ListingDetailClientProps {
  listing: ListingWithDetails;
  relatedListings: ListingWithRelations[];
  isOwner?: boolean;
}

export default function ListingDetailClient({
  listing,
  relatedListings,
  isOwner = false,
}: ListingDetailClientProps) {
  const { t, language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = listing.images;
  const primaryImage = images[currentImageIndex] || images[0];

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
    }).format(Number(price));

    if (priceType === 'HOURLY') return `${formatted}/${language === 'vn' ? 'giờ' : 'hr'}`;
    if (priceType === 'MONTHLY') return `${formatted}/${language === 'vn' ? 'tháng' : 'mo'}`;
    return formatted;
  };

  // Date is already serialized as ISO string from server
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(language === 'vn' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: listing.description?.slice(0, 100),
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(language === 'vn' ? 'Đã sao chép link!' : 'Link copied!');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Status banner for non-active listings
  const getStatusBanner = () => {
    if (listing.status === 'ACTIVE') return null;

    const statusConfig: Record<string, { bg: string; text: string; messageVn: string; messageEn: string }> = {
      PENDING: {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        messageVn: 'Tin đăng đang chờ duyệt. Chỉ bạn mới có thể xem trang này.',
        messageEn: 'This listing is pending approval. Only you can see this page.',
      },
      REJECTED: {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        messageVn: `Tin đăng bị từ chối${listing.rejectionReason ? `: ${listing.rejectionReason}` : '.'}`,
        messageEn: `Listing rejected${listing.rejectionReason ? `: ${listing.rejectionReason}` : '.'}`,
      },
      EXPIRED: {
        bg: 'bg-gray-50 border-gray-200',
        text: 'text-gray-800',
        messageVn: 'Tin đăng đã hết hạn.',
        messageEn: 'This listing has expired.',
      },
      SOLD: {
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-800',
        messageVn: 'Tin đăng đã bán.',
        messageEn: 'This listing has been sold.',
      },
    };

    const config = statusConfig[listing.status] || statusConfig.PENDING;

    return (
      <div className={`${config.bg} border-b`}>
        <div className={`container mx-auto px-4 py-3 ${config.text} text-sm font-medium`}>
          {language === 'vn' ? config.messageVn : config.messageEn}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Status Banner for non-active listings */}
      {isOwner && getStatusBanner()}

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600">
              {t.home}
            </Link>
            <span>/</span>
            <Link href="/rao-vat" className="hover:text-red-600">
              {t.listings}
            </Link>
            <span>/</span>
            <Link
              href={`/rao-vat/${listing.category.slug}`}
              className="hover:text-red-600"
            >
              {language === 'vn' ? listing.category.nameVn : listing.category.nameEn || listing.category.nameVn}
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/3] bg-gray-100">
                {primaryImage ? (
                  <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                    <DialogTrigger asChild>
                      <button className="w-full h-full relative cursor-zoom-in">
                        <Image
                          src={primaryImage.imageUrl}
                          alt={listing.title}
                          fill
                          className="object-contain"
                          priority
                        />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0 bg-black/95">
                      <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 z-50 text-white hover:text-gray-300"
                      >
                        <X className="h-6 w-6" />
                      </button>
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={images[currentImageIndex]?.imageUrl || ''}
                          alt={listing.title}
                          fill
                          className="object-contain"
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                            >
                              <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                            >
                              <ChevronRight className="h-6 w-6" />
                            </button>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <ShoppingBag className="h-20 w-20" />
                  </div>
                )}

                {/* Featured Badge */}
                {listing.isFeatured && (
                  <Badge className="absolute top-4 left-4 bg-yellow-500">
                    {language === 'vn' ? 'Nổi bật' : 'Featured'}
                  </Badge>
                )}

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden border-2 ${
                          idx === currentImageIndex ? 'border-red-600' : 'border-transparent'
                        }`}
                      >
                        <Image
                          src={img.imageUrl}
                          alt={`${listing.title} - ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Listing Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      <Tag className="h-3 w-3 mr-1" />
                      {language === 'vn' ? listing.category.nameVn : listing.category.nameEn || listing.category.nameVn}
                    </Badge>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {language === 'vn' ? listing.title : listing.titleEn || listing.title}
                    </h1>
                  </div>
                  <p className="text-2xl font-bold text-red-600 whitespace-nowrap">
                    {formatPrice(listing.price ? Number(listing.price) : null, listing.priceType)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  {listing.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {listing.location}
                      {listing.neighborhood && `, ${listing.neighborhood.name}`}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(listing.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {listing.views} {language === 'vn' ? 'lượt xem' : 'views'}
                  </span>
                </div>

                <div className="prose prose-gray max-w-none">
                  <h3 className="text-lg font-semibold mb-3">
                    {language === 'vn' ? 'Mô tả' : 'Description'}
                  </h3>
                  <div className="whitespace-pre-wrap text-gray-700">
                    {listing.description || (language === 'vn' ? 'Không có mô tả' : 'No description')}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSaved(!isSaved)}
                    className={isSaved ? 'text-red-600 border-red-600' : ''}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? (language === 'vn' ? 'Đã lưu' : 'Saved') : (language === 'vn' ? 'Lưu tin' : 'Save')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    {language === 'vn' ? 'Chia sẻ' : 'Share'}
                  </Button>
                  <Button variant="outline" size="sm" className="text-gray-500">
                    <Flag className="h-4 w-4 mr-2" />
                    {language === 'vn' ? 'Báo cáo' : 'Report'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">
                  {language === 'vn' ? 'Thông tin liên hệ' : 'Contact Information'}
                </h3>

                {/* Seller Info */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={listing.user.image || undefined} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{listing.user.name || (language === 'vn' ? 'Người dùng' : 'User')}</p>
                    <p className="text-sm text-gray-500">
                      {listing.user._count.listings} {language === 'vn' ? 'tin đăng' : 'listings'}
                    </p>
                  </div>
                </div>

                {/* Contact Methods */}
                <div className="space-y-3">
                  {listing.contactPhone && (
                    <Button
                      variant="default"
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setShowPhone(!showPhone)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {showPhone ? listing.contactPhone : (language === 'vn' ? 'Hiện số điện thoại' : 'Show phone number')}
                    </Button>
                  )}

                  {listing.contactEmail && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`mailto:${listing.contactEmail}?subject=${encodeURIComponent(listing.title)}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        {language === 'vn' ? 'Gửi email' : 'Send email'}
                      </a>
                    </Button>
                  )}

                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {language === 'vn' ? 'Nhắn tin' : 'Message'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  {language === 'vn' ? 'Mẹo an toàn' : 'Safety Tips'}
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• {language === 'vn' ? 'Gặp mặt trực tiếp tại nơi công cộng' : 'Meet in public places'}</li>
                  <li>• {language === 'vn' ? 'Không chuyển tiền trước' : 'Never wire money in advance'}</li>
                  <li>• {language === 'vn' ? 'Kiểm tra hàng trước khi mua' : 'Inspect items before buying'}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Listing Stats */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">
                  {language === 'vn' ? 'Thông tin tin đăng' : 'Listing Info'}
                </h4>
                <dl className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {language === 'vn' ? 'Đăng ngày' : 'Posted'}
                    </dt>
                    <dd>{formatDate(listing.createdAt)}</dd>
                  </div>
                  {listing.updatedAt !== listing.createdAt && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">
                        {language === 'vn' ? 'Cập nhật' : 'Updated'}
                      </dt>
                      <dd>{formatDate(listing.updatedAt)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">
                      <Eye className="h-4 w-4 inline mr-1" />
                      {language === 'vn' ? 'Lượt xem' : 'Views'}
                    </dt>
                    <dd>{listing.views}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">ID</dt>
                    <dd className="font-mono text-xs">{String(listing.id).slice(0, 8)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">
              {language === 'vn' ? 'Tin đăng tương tự' : 'Related Listings'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
