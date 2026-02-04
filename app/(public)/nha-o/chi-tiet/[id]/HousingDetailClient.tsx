'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ShareButtons from '@/components/public/ShareButtons';
import type { ListingWithRelations } from '@/components/public/ListingCard';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  Clock,
  Eye,
  Phone,
  Mail,
  User,
  Bed,
  Bath,
  Square,
  PawPrint,
  Zap,
  Calendar,
  Building2,
  Edit,
  ExternalLink,
  Printer,
  MessageCircle,
} from 'lucide-react';

interface HousingDetailClientProps {
  listing: ListingWithRelations;
  relatedListings: ListingWithRelations[];
  isOwner: boolean;
}

export default function HousingDetailClient({
  listing,
  relatedListings,
  isOwner,
}: HousingDetailClientProps) {
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  const images = listing.images || [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: string | number | null) => {
    if (!price) return language === 'vn' ? 'Liên hệ' : 'Contact';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toLocaleString()}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  const handlePrint = () => {
    window.print();
  };

  const handleCall = () => {
    if (listing.contactPhone) {
      window.location.href = `tel:${listing.contactPhone}`;
    }
  };

  const handleZalo = () => {
    if (listing.contactPhone) {
      const phone = listing.contactPhone.replace(/\D/g, '');
      window.open(`https://zalo.me/${phone}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/nha-o"
            className="inline-flex items-center text-emerald-100 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {language === 'vn' ? 'Quay lại danh sách' : 'Back to listings'}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/10] bg-gray-100">
                {hasImages ? (
                  <>
                    <Image
                      src={images[currentImageIndex].imageUrl}
                      alt={listing.title}
                      fill
                      className="object-contain"
                      priority
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="h-24 w-24 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                        idx === currentImageIndex ? 'border-emerald-600' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={img.imageUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Title & Price */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                        <Home className="h-3 w-3 mr-1" />
                        {language === 'vn' ? listing.category.nameVn : listing.category.nameEn || listing.category.nameVn}
                      </Badge>
                      {listing.isFeatured && (
                        <Badge className="bg-emerald-600">
                          {language === 'vn' ? 'Nổi bật' : 'Featured'}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {listing.title}
                    </h1>
                    {listing.titleEn && listing.titleEn !== listing.title && (
                      <p className="text-gray-600">{listing.titleEn}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-emerald-600">
                      {formatPrice(listing.price)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'vn' ? '/tháng' : '/month'}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y">
                  {listing.bedrooms !== null && (
                    <div className="text-center">
                      <Bed className="h-6 w-6 mx-auto text-emerald-600 mb-1" />
                      <p className="font-semibold">{listing.bedrooms === 0 ? 'Studio' : listing.bedrooms}</p>
                      <p className="text-xs text-gray-500">{language === 'vn' ? 'Phòng ngủ' : 'Bedrooms'}</p>
                    </div>
                  )}
                  {listing.bathrooms !== null && (
                    <div className="text-center">
                      <Bath className="h-6 w-6 mx-auto text-emerald-600 mb-1" />
                      <p className="font-semibold">{listing.bathrooms}</p>
                      <p className="text-xs text-gray-500">{language === 'vn' ? 'Phòng tắm' : 'Bathrooms'}</p>
                    </div>
                  )}
                  {listing.sqft && (
                    <div className="text-center">
                      <Square className="h-6 w-6 mx-auto text-emerald-600 mb-1" />
                      <p className="font-semibold">{listing.sqft}</p>
                      <p className="text-xs text-gray-500">Sqft</p>
                    </div>
                  )}
                  {listing.petFriendly !== null && (
                    <div className="text-center">
                      <PawPrint className={`h-6 w-6 mx-auto mb-1 ${listing.petFriendly ? 'text-emerald-600' : 'text-gray-300'}`} />
                      <p className="font-semibold">{listing.petFriendly ? (language === 'vn' ? 'Có' : 'Yes') : (language === 'vn' ? 'Không' : 'No')}</p>
                      <p className="text-xs text-gray-500">{language === 'vn' ? 'Thú cưng' : 'Pets'}</p>
                    </div>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-gray-500">
                  {listing.neighborhood && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {listing.neighborhood.nameVn}
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
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'vn' ? 'Chi tiết' : 'Details'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {listing.utilities && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-500">{language === 'vn' ? 'Tiện ích' : 'Utilities'}</p>
                        <p className="font-medium">{listing.utilities}</p>
                      </div>
                    </div>
                  )}
                  {listing.moveInDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-500">{language === 'vn' ? 'Ngày dọn vào' : 'Move-in Date'}</p>
                        <p className="font-medium">{formatDate(listing.moveInDate)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {listing.description && (
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">{listing.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <ShareButtons
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    title={listing.title}
                  />
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    {language === 'vn' ? 'In' : 'Print'}
                  </Button>
                  {isOwner && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/tai-khoan/tin-dang/${listing.id}/chinh-sua`}>
                        <Edit className="h-4 w-4 mr-2" />
                        {language === 'vn' ? 'Sửa' : 'Edit'}
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-4">
              <CardHeader className="bg-emerald-50">
                <CardTitle className="text-emerald-800 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {language === 'vn' ? 'Liên hệ thuê' : 'Contact to Rent'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Poster Info */}
                {listing.user && (
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={listing.user.image || undefined} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{listing.user.name || (language === 'vn' ? 'Chủ nhà' : 'Landlord')}</p>
                      <p className="text-xs text-gray-500">
                        {listing.user._count?.listings || 0} {language === 'vn' ? 'tin đăng' : 'listings'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contact Buttons */}
                {listing.contactPhone && (
                  <div className="space-y-2">
                    {showPhone ? (
                      <div className="p-3 bg-gray-100 rounded-lg text-center">
                        <p className="font-mono text-lg font-bold">{listing.contactPhone}</p>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => setShowPhone(true)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        {language === 'vn' ? 'Xem số điện thoại' : 'Show Phone'}
                      </Button>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={handleCall}>
                        <Phone className="h-4 w-4 mr-2" />
                        {language === 'vn' ? 'Gọi' : 'Call'}
                      </Button>
                      <Button variant="outline" onClick={handleZalo}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Zalo
                      </Button>
                    </div>
                  </div>
                )}

                {listing.contactEmail && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${listing.contactEmail}?subject=${encodeURIComponent(listing.title)}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      {language === 'vn' ? 'Gửi email' : 'Send Email'}
                    </a>
                  </Button>
                )}

                <p className="text-xs text-gray-500 text-center">
                  {language === 'vn'
                    ? 'Ghi chú: Xác nhận trước khi giao dịch'
                    : 'Note: Verify before any transaction'}
                </p>
              </CardContent>
            </Card>

            {/* Location */}
            {listing.neighborhood && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {language === 'vn' ? 'Khu vực' : 'Location'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{listing.neighborhood.nameVn}</p>
                  {listing.location && (
                    <p className="text-sm text-gray-600 mt-1">{listing.location}</p>
                  )}
                  <Button variant="link" className="px-0 text-emerald-600" asChild>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${listing.location || ''} ${listing.neighborhood.nameVn} Hawaii`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {language === 'vn' ? 'Xem bản đồ' : 'View on map'}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">
              {language === 'vn' ? 'Nhà ở tương tự' : 'Similar Listings'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedListings.map(item => (
                <Link
                  key={item.id}
                  href={`/nha-o/chi-tiet/${item.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-[4/3] bg-gray-100">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0].imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-emerald-600 text-white px-2 py-1 rounded text-sm font-bold">
                        {formatPrice(item.price)}/mo
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        {item.bedrooms !== null && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            {item.bedrooms === 0 ? 'Studio' : item.bedrooms}
                          </span>
                        )}
                        {item.bathrooms !== null && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            {item.bathrooms}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
