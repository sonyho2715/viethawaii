'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tag,
  ArrowLeft,
  Clock,
  Store,
  Phone,
  Globe,
  MapPin,
  Share2,
  Copy,
  Facebook,
  MessageCircle,
  Percent,
  DollarSign,
  Gift,
  CheckCircle,
  Ticket,
  Calendar,
  Info,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { SerializedCoupon } from '../CouponsClient';

interface CouponDetailClientProps {
  coupon: {
    id: number;
    businessId: number;
    title: string;
    titleEn: string | null;
    description: string | null;
    code: string | null;
    discountType: string;
    discountValue: string;
    minPurchase: string | null;
    maxUses: number | null;
    usedCount: number;
    startDate: string;
    endDate: string;
    imageUrl: string | null;
    terms: string | null;
    isActive: boolean;
    createdAt: string;
    business: {
      id: number;
      name: string;
      slug: string;
      category: string;
      address: string | null;
      phone: string | null;
      website: string | null;
    };
    claims?: {
      id: number;
      claimedAt: string;
      usedAt: string | null;
    }[];
    _count: {
      claims: number;
    };
  };
  relatedCoupons: SerializedCoupon[];
  isLoggedIn: boolean;
  hasClaimed: boolean;
}

const DISCOUNT_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PERCENTAGE: Percent,
  FIXED_AMOUNT: DollarSign,
  FREE_ITEM: Gift,
};

export default function CouponDetailClient({
  coupon,
  relatedCoupons,
  isLoggedIn,
  hasClaimed: initialHasClaimed,
}: CouponDetailClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(initialHasClaimed);

  const DiscountIcon = DISCOUNT_TYPE_ICONS[coupon.discountType] || Tag;

  const formatDiscount = () => {
    const value = parseFloat(coupon.discountValue);
    switch (coupon.discountType) {
      case 'PERCENTAGE':
        return `${value}% ${language === 'vn' ? 'giảm' : 'off'}`;
      case 'FIXED_AMOUNT':
        return `$${value} ${language === 'vn' ? 'giảm' : 'off'}`;
      case 'FREE_ITEM':
        return language === 'vn' ? 'Miễn phí' : 'Free Item';
      default:
        return coupon.discountValue;
    }
  };

  const getDaysRemaining = () => {
    const end = new Date(coupon.endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isExpired = getDaysRemaining() < 0;
  const isExpiringSoon = getDaysRemaining() <= 3 && getDaysRemaining() >= 0;
  const isSoldOut = coupon.maxUses && coupon.usedCount >= coupon.maxUses;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = language === 'vn' ? coupon.title : coupon.titleEn || coupon.title;

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;
      case 'zalo':
        window.open(`https://zalo.me/share?url=${encodedUrl}`, '_blank');
        break;
      case 'messenger':
        window.open(`fb-messenger://share/?link=${encodedUrl}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success(language === 'vn' ? 'Đã sao chép link!' : 'Link copied!');
        break;
    }
    setShowShareMenu(false);
  };

  const handleCopyCode = () => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      toast.success(language === 'vn' ? 'Đã sao chép mã!' : 'Code copied!');
    }
  };

  const handleClaimCoupon = async () => {
    if (!isLoggedIn) {
      router.push(`/dang-nhap?callbackUrl=/khuyen-mai/${coupon.id}`);
      return;
    }

    setIsClaiming(true);
    try {
      const res = await fetch(`/api/coupons/${coupon.id}/claim`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to claim coupon');
      }

      setHasClaimed(true);
      toast.success(language === 'vn' ? 'Đã lưu khuyến mãi!' : 'Coupon claimed!');
    } catch (error) {
      console.error('Claim error:', error);
      toast.error(language === 'vn' ? 'Không thể lưu khuyến mãi' : 'Failed to claim coupon');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-rose-100 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === 'vn' ? 'Quay lại' : 'Back'}
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Store className="h-3 w-3" />
                  {coupon.business.name}
                </span>
                {isExpired && (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                    {language === 'vn' ? 'Hết hạn' : 'Expired'}
                  </span>
                )}
                {isSoldOut && !isExpired && (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                    {language === 'vn' ? 'Hết lượt' : 'Sold Out'}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {language === 'vn' ? coupon.title : coupon.titleEn || coupon.title}
              </h1>
            </div>

            <div className="relative">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {language === 'vn' ? 'Chia sẻ' : 'Share'}
              </Button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('zalo')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    Zalo
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    {language === 'vn' ? 'Sao chép link' : 'Copy link'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Discount Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-8 text-center">
                <div className="bg-white/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <DiscountIcon className="h-10 w-10" />
                </div>
                <h2 className="text-4xl font-bold mb-2">{formatDiscount()}</h2>
                {coupon.minPurchase && (
                  <p className="text-rose-100">
                    {language === 'vn' ? 'Đơn tối thiểu' : 'Min purchase'}: ${parseFloat(coupon.minPurchase)}
                  </p>
                )}
              </div>

              {/* Coupon Code */}
              {coupon.code && (
                <CardContent className="p-6 border-t">
                  <h3 className="font-medium text-gray-700 mb-2">
                    {language === 'vn' ? 'Mã khuyến mãi' : 'Coupon Code'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                      <span className="text-xl font-mono font-bold text-gray-900">
                        {coupon.code}
                      </span>
                    </div>
                    <Button onClick={handleCopyCode} variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      {language === 'vn' ? 'Sao chép' : 'Copy'}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Image */}
            {coupon.imageUrl && (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <Image
                  src={coupon.imageUrl}
                  alt={coupon.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Description */}
            {coupon.description && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {language === 'vn' ? 'Chi tiết ưu đãi' : 'Offer Details'}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{coupon.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Terms */}
            {coupon.terms && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-gray-400" />
                    {language === 'vn' ? 'Điều khoản' : 'Terms & Conditions'}
                  </h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{coupon.terms}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Claim Button */}
            <Card>
              <CardContent className="p-6">
                {isExpired ? (
                  <div className="text-center py-4">
                    <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      {language === 'vn' ? 'Khuyến mãi đã hết hạn' : 'This offer has expired'}
                    </p>
                  </div>
                ) : isSoldOut ? (
                  <div className="text-center py-4">
                    <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Ticket className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      {language === 'vn' ? 'Đã hết lượt sử dụng' : 'All coupons have been claimed'}
                    </p>
                  </div>
                ) : hasClaimed ? (
                  <div className="text-center py-4">
                    <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-green-600 font-medium mb-2">
                      {language === 'vn' ? 'Bạn đã lưu khuyến mãi này!' : 'You claimed this coupon!'}
                    </p>
                    {coupon.code && (
                      <p className="text-sm text-gray-500">
                        {language === 'vn' ? 'Sử dụng mã khi thanh toán' : 'Use code at checkout'}
                      </p>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={handleClaimCoupon}
                    disabled={isClaiming}
                    className="w-full bg-rose-600 hover:bg-rose-700 py-6 text-lg"
                  >
                    {isClaiming ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {language === 'vn' ? 'Đang lưu...' : 'Claiming...'}
                      </>
                    ) : (
                      <>
                        <Tag className="h-5 w-5 mr-2" />
                        {language === 'vn' ? 'Lưu khuyến mãi' : 'Claim Coupon'}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Validity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  {language === 'vn' ? 'Thời hạn' : 'Validity'}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{language === 'vn' ? 'Bắt đầu' : 'Start'}</span>
                    <span className="text-gray-900">
                      {new Date(coupon.startDate).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{language === 'vn' ? 'Kết thúc' : 'End'}</span>
                    <span className={`font-medium ${isExpiringSoon ? 'text-amber-600' : 'text-gray-900'}`}>
                      {new Date(coupon.endDate).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US')}
                    </span>
                  </div>
                  {isExpiringSoon && !isExpired && (
                    <div className="bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-center mt-3">
                      {getDaysRemaining() === 0
                        ? (language === 'vn' ? 'Hết hạn hôm nay!' : 'Expires today!')
                        : (language === 'vn' ? `Còn ${getDaysRemaining()} ngày!` : `${getDaysRemaining()} days left!`)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {language === 'vn' ? 'Doanh nghiệp' : 'Business'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-rose-100 rounded-lg p-2">
                      <Store className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{coupon.business.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{coupon.business.category}</p>
                    </div>
                  </div>

                  {coupon.business.address && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(coupon.business.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-rose-600"
                    >
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{coupon.business.address}</span>
                    </a>
                  )}

                  {coupon.business.phone && (
                    <a
                      href={`tel:${coupon.business.phone}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-rose-600"
                    >
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{coupon.business.phone}</span>
                    </a>
                  )}

                  {coupon.business.website && (
                    <a
                      href={coupon.business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-rose-600"
                    >
                      <Globe className="h-5 w-5 text-gray-400" />
                      <span className="text-sm truncate">
                        {coupon.business.website.replace(/^https?:\/\//, '')}
                      </span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    {coupon._count.claims} {language === 'vn' ? 'đã lưu' : 'claimed'}
                  </span>
                  {coupon.maxUses && (
                    <span>
                      {language === 'vn' ? 'Còn' : 'Remaining'}: {coupon.maxUses - coupon.usedCount}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Coupons */}
        {relatedCoupons.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'vn' ? 'Khuyến mãi khác' : 'More Deals'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCoupons.map(related => {
                const RelatedIcon = DISCOUNT_TYPE_ICONS[related.discountType] || Tag;
                const value = parseFloat(related.discountValue);
                const discountText = related.discountType === 'PERCENTAGE'
                  ? `${value}%`
                  : related.discountType === 'FIXED_AMOUNT'
                    ? `$${value}`
                    : (language === 'vn' ? 'Miễn phí' : 'Free');

                return (
                  <Link key={related.id} href={`/khuyen-mai/${related.id}`} className="group">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <div className="relative aspect-[16/9] bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                        <div className="text-center">
                          <RelatedIcon className="h-8 w-8 text-rose-400 mx-auto mb-1" />
                          <span className="text-2xl font-bold text-rose-600">{discountText}</span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-rose-600 mb-1">{related.business.name}</p>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-rose-600 transition-colors">
                          {language === 'vn' ? related.title : related.titleEn || related.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
