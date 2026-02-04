'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tag,
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Percent,
  DollarSign,
  Gift,
  Store,
  Ticket,
  CheckCircle,
} from 'lucide-react';

export interface SerializedCoupon {
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
  };
  claims?: {
    id: number;
    claimedAt: string;
    usedAt: string | null;
  }[];
  _count: {
    claims: number;
  };
}

interface CouponsClientProps {
  initialCoupons: SerializedCoupon[];
  categories: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchParams: {
    category?: string;
    q?: string;
    page?: string;
  };
  isLoggedIn: boolean;
}

const DISCOUNT_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PERCENTAGE: Percent,
  FIXED_AMOUNT: DollarSign,
  FREE_ITEM: Gift,
};

const CATEGORY_LABELS: Record<string, { vn: string; en: string }> = {
  restaurant: { vn: 'Nhà hàng', en: 'Restaurant' },
  spa: { vn: 'Spa & Làm đẹp', en: 'Spa & Beauty' },
  retail: { vn: 'Bán lẻ', en: 'Retail' },
  service: { vn: 'Dịch vụ', en: 'Service' },
  other: { vn: 'Khác', en: 'Other' },
};

export default function CouponsClient({
  initialCoupons,
  categories,
  pagination,
  searchParams,
  isLoggedIn: _isLoggedIn,
}: CouponsClientProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const { language } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.q || '',
    category: searchParams.category || '',
  });

  const updateFilters = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category) params.set('category', filters.category);
    router.push(`/khuyen-mai?${params.toString()}`);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      category: '',
    });
    router.push('/khuyen-mai');
    setShowFilters(false);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set('page', String(page));
    router.push(`/khuyen-mai?${params.toString()}`);
  };

  const hasActiveFilters = filters.q || filters.category;

  const formatDiscount = (coupon: SerializedCoupon) => {
    const value = parseFloat(coupon.discountValue);
    switch (coupon.discountType) {
      case 'PERCENTAGE':
        return `${value}%`;
      case 'FIXED_AMOUNT':
        return `$${value}`;
      case 'FREE_ITEM':
        return language === 'vn' ? 'Miễn phí' : 'Free';
      default:
        return coupon.discountValue;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDiscountIcon = (discountType: string) => {
    return DISCOUNT_TYPE_ICONS[discountType] || Tag;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Tag className="h-8 w-8" />
                {language === 'vn' ? 'Khuyến mãi' : 'Deals & Coupons'}
              </h1>
              <p className="text-rose-100 mt-1">
                {language === 'vn'
                  ? 'Tiết kiệm với các ưu đãi từ doanh nghiệp Việt Hawaii'
                  : 'Save with deals from Vietnamese Hawaiian businesses'}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={filters.q}
                onChange={e => updateFilters('q', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                placeholder={language === 'vn' ? 'Tìm kiếm khuyến mãi...' : 'Search deals...'}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white text-gray-700 border-white hover:bg-rose-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              {language === 'vn' ? 'Lọc' : 'Filter'}
            </Button>
            <Button onClick={applyFilters} className="bg-rose-700 hover:bg-rose-800">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Quick Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={!filters.category ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                updateFilters('category', '');
                applyFilters();
              }}
              className={!filters.category ? 'bg-rose-600 hover:bg-rose-700' : ''}
            >
              {language === 'vn' ? 'Tất cả' : 'All'}
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={filters.category === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  updateFilters('category', cat);
                  setTimeout(applyFilters, 0);
                }}
                className={filters.category === cat ? 'bg-rose-600 hover:bg-rose-700' : ''}
              >
                {CATEGORY_LABELS[cat]?.[language] || cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Select value={filters.category} onValueChange={v => updateFilters('category', v)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'vn' ? 'Loại doanh nghiệp' : 'Business Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'vn' ? 'Tất cả' : 'All'}</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]?.[language] || cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  <X className="h-4 w-4 mr-1" />
                  {language === 'vn' ? 'Xóa bộ lọc' : 'Clear filters'}
                </Button>
              )}
              <Button onClick={applyFilters} size="sm" className="bg-rose-600 hover:bg-rose-700">
                {language === 'vn' ? 'Áp dụng' : 'Apply'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            {pagination.total} {language === 'vn' ? 'khuyến mãi' : 'deals'}
          </p>
        </div>

        {initialCoupons.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'vn' ? 'Không tìm thấy khuyến mãi' : 'No deals found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {language === 'vn'
                ? 'Thử thay đổi bộ lọc hoặc quay lại sau'
                : 'Try adjusting your filters or check back later'}
            </p>
          </div>
        ) : (
          <>
            {/* Coupon Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialCoupons.map(coupon => {
                const daysRemaining = getDaysRemaining(coupon.endDate);
                const isExpiringSoon = daysRemaining <= 3;
                const hasClaimed = coupon.claims && coupon.claims.length > 0;
                const DiscountIcon = getDiscountIcon(coupon.discountType);

                return (
                  <Link key={coupon.id} href={`/khuyen-mai/${coupon.id}`} className="group">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full relative">
                      {/* Claimed Badge */}
                      {hasClaimed && (
                        <div className="absolute top-3 right-3 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {language === 'vn' ? 'Đã lưu' : 'Claimed'}
                        </div>
                      )}

                      {/* Image or Gradient */}
                      <div className="relative aspect-[16/9] bg-gradient-to-br from-rose-100 to-pink-100">
                        {coupon.imageUrl ? (
                          <Image
                            src={coupon.imageUrl}
                            alt={coupon.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <div className="bg-rose-600 text-white rounded-full p-4 mb-2">
                              <DiscountIcon className="h-8 w-8" />
                            </div>
                            <span className="text-3xl font-bold text-rose-600">
                              {formatDiscount(coupon)}
                            </span>
                            <span className="text-sm text-rose-500">
                              {coupon.discountType === 'PERCENTAGE' && (language === 'vn' ? 'giảm' : 'off')}
                              {coupon.discountType === 'FIXED_AMOUNT' && (language === 'vn' ? 'giảm' : 'off')}
                            </span>
                          </div>
                        )}

                        {/* Discount Badge */}
                        {coupon.imageUrl && (
                          <span className="absolute top-2 left-2 bg-rose-600 text-white text-lg font-bold px-3 py-1 rounded">
                            {formatDiscount(coupon)}
                            {coupon.discountType !== 'FREE_ITEM' && (
                              <span className="text-xs font-normal ml-1">
                                {language === 'vn' ? 'giảm' : 'off'}
                              </span>
                            )}
                          </span>
                        )}

                        {/* Expiring Soon Badge */}
                        {isExpiringSoon && (
                          <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {daysRemaining <= 0
                              ? (language === 'vn' ? 'Hết hạn hôm nay!' : 'Expires today!')
                              : (language === 'vn' ? `Còn ${daysRemaining} ngày` : `${daysRemaining} days left`)}
                          </span>
                        )}
                      </div>

                      <CardContent className="p-4">
                        {/* Business */}
                        <div className="flex items-center gap-2 text-sm text-rose-600 mb-2">
                          <Store className="h-4 w-4" />
                          <span>{coupon.business.name}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                          {language === 'vn' ? coupon.title : coupon.titleEn || coupon.title}
                        </h3>

                        {/* Description */}
                        {coupon.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {coupon.description}
                          </p>
                        )}

                        {/* Code & Details */}
                        <div className="flex items-center justify-between text-xs">
                          {coupon.code && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono">
                              {coupon.code}
                            </span>
                          )}
                          <span className="text-gray-500 flex items-center gap-1">
                            <Ticket className="h-3 w-3" />
                            {coupon._count.claims} {language === 'vn' ? 'đã dùng' : 'claimed'}
                          </span>
                        </div>

                        {/* Min Purchase */}
                        {coupon.minPurchase && (
                          <p className="text-xs text-gray-500 mt-2">
                            {language === 'vn' ? 'Đơn tối thiểu' : 'Min purchase'}: ${parseFloat(coupon.minPurchase)}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2">...</span>}
                      <Button
                        variant={p === pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => goToPage(p)}
                        className={p === pagination.page ? 'bg-rose-600 hover:bg-rose-700' : ''}
                      >
                        {p}
                      </Button>
                    </span>
                  ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
