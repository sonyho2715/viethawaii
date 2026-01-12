'use client';

import { useState, useEffect } from 'react';
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
  Home,
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  X,
  Building2,
  PawPrint,
} from 'lucide-react';
import type { SerializedCategory, SerializedNeighborhood, ListingWithRelations } from '@/components/public/ListingCard';

interface HousingClientProps {
  categories: SerializedCategory[];
  neighborhoods: SerializedNeighborhood[];
  initialListings: ListingWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchParams: {
    category?: string;
    q?: string;
    bedrooms?: string;
    maxPrice?: string;
    neighborhood?: string;
    sort?: string;
    page?: string;
  };
}

const BEDROOM_OPTIONS = [
  { value: 'studio', label: 'Studio', labelVn: 'Studio' },
  { value: '1', label: '1 Bedroom', labelVn: '1 Phòng ngủ' },
  { value: '2', label: '2 Bedrooms', labelVn: '2 Phòng ngủ' },
  { value: '3', label: '3 Bedrooms', labelVn: '3 Phòng ngủ' },
  { value: '4', label: '4+ Bedrooms', labelVn: '4+ Phòng ngủ' },
];

const PRICE_RANGES = [
  { value: '1000', label: 'Under $1,000', labelVn: 'Dưới $1,000' },
  { value: '1500', label: 'Under $1,500', labelVn: 'Dưới $1,500' },
  { value: '2000', label: 'Under $2,000', labelVn: 'Dưới $2,000' },
  { value: '2500', label: 'Under $2,500', labelVn: 'Dưới $2,500' },
  { value: '3000', label: 'Under $3,000', labelVn: 'Dưới $3,000' },
];

export default function HousingClient({
  categories,
  neighborhoods,
  initialListings,
  pagination,
  searchParams,
}: HousingClientProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const { language } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.q || '',
    category: searchParams.category || '',
    bedrooms: searchParams.bedrooms || '',
    maxPrice: searchParams.maxPrice || '',
    neighborhood: searchParams.neighborhood || '',
    sort: searchParams.sort || 'newest',
  });

  const mainCategories = categories.filter(c => !c.parentId);
  const subCategories = categories.filter(c => c.parentId);

  const updateFilters = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category) params.set('category', filters.category);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.neighborhood) params.set('neighborhood', filters.neighborhood);
    if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
    router.push(`/nha-o?${params.toString()}`);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      category: '',
      bedrooms: '',
      maxPrice: '',
      neighborhood: '',
      sort: 'newest',
    });
    router.push('/nha-o');
    setShowFilters(false);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set('page', String(page));
    router.push(`/nha-o?${params.toString()}`);
  };

  const hasActiveFilters = filters.q || filters.category || filters.bedrooms || filters.maxPrice || filters.neighborhood;

  const formatPrice = (price: string | number | null) => {
    if (!price) return language === 'vn' ? 'Liên hệ' : 'Contact';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toLocaleString()}/mo`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return language === 'vn' ? 'Hôm nay' : 'Today';
    if (diffDays === 1) return language === 'vn' ? 'Hôm qua' : 'Yesterday';
    if (diffDays < 7) return language === 'vn' ? `${diffDays} ngày trước` : `${diffDays} days ago`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Home className="h-8 w-8" />
                {language === 'vn' ? 'Nhà ở' : 'Housing'}
              </h1>
              <p className="text-emerald-100 mt-1">
                {language === 'vn'
                  ? 'Tìm phòng cho thuê trong cộng đồng Việt Hawaii'
                  : 'Find rentals in the Vietnamese Hawaii community'}
              </p>
            </div>
            <Button asChild className="bg-white text-emerald-600 hover:bg-emerald-50">
              <Link href="/nha-o/dang-tin">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'vn' ? 'Đăng tin' : 'Post'}
              </Link>
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={filters.q}
                onChange={e => updateFilters('q', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                placeholder={language === 'vn' ? 'Tìm kiếm nhà ở...' : 'Search housing...'}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white text-gray-700 border-white hover:bg-emerald-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              {language === 'vn' ? 'Lọc' : 'Filter'}
            </Button>
            <Button onClick={applyFilters} className="bg-emerald-700 hover:bg-emerald-800">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Select value={filters.category} onValueChange={v => updateFilters('category', v)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'vn' ? 'Loại nhà' : 'Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'vn' ? 'Tất cả' : 'All'}</SelectItem>
                  {subCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {language === 'vn' ? cat.nameVn : cat.nameEn || cat.nameVn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.bedrooms} onValueChange={v => updateFilters('bedrooms', v)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'vn' ? 'Phòng ngủ' : 'Bedrooms'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{language === 'vn' ? 'Bất kỳ' : 'Any'}</SelectItem>
                  {BEDROOM_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {language === 'vn' ? opt.labelVn : opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.maxPrice} onValueChange={v => updateFilters('maxPrice', v)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'vn' ? 'Giá tối đa' : 'Max Price'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{language === 'vn' ? 'Bất kỳ' : 'Any'}</SelectItem>
                  {PRICE_RANGES.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {language === 'vn' ? range.labelVn : range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.neighborhood} onValueChange={v => updateFilters('neighborhood', v)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'vn' ? 'Khu vực' : 'Area'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{language === 'vn' ? 'Tất cả' : 'All'}</SelectItem>
                  {neighborhoods.map(n => (
                    <SelectItem key={n.id} value={n.slug}>
                      {n.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.sort} onValueChange={v => updateFilters('sort', v)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'vn' ? 'Sắp xếp' : 'Sort'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{language === 'vn' ? 'Mới nhất' : 'Newest'}</SelectItem>
                  <SelectItem value="price-low">{language === 'vn' ? 'Giá thấp' : 'Price: Low'}</SelectItem>
                  <SelectItem value="price-high">{language === 'vn' ? 'Giá cao' : 'Price: High'}</SelectItem>
                  <SelectItem value="views">{language === 'vn' ? 'Xem nhiều' : 'Most Viewed'}</SelectItem>
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
              <Button onClick={applyFilters} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
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
            {pagination.total} {language === 'vn' ? 'tin đăng' : 'listings'}
          </p>
        </div>

        {initialListings.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'vn' ? 'Không tìm thấy tin đăng' : 'No listings found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {language === 'vn'
                ? 'Thử thay đổi bộ lọc hoặc đăng tin mới'
                : 'Try adjusting your filters or post a new listing'}
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/nha-o/dang-tin">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'vn' ? 'Đăng tin cho thuê' : 'Post Rental'}
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Housing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialListings.map(listing => (
                <Link
                  key={listing.id}
                  href={`/nha-o/chi-tiet/${listing.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-gray-100">
                      {listing.images && listing.images.length > 0 ? (
                        <Image
                          src={listing.images[0].imageUrl}
                          alt={listing.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                      {listing.isFeatured && (
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                          {language === 'vn' ? 'Nổi bật' : 'Featured'}
                        </span>
                      )}
                      {/* Price Badge */}
                      <div className="absolute bottom-2 right-2 bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold">
                        {formatPrice(listing.price)}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      {/* Category */}
                      <div className="flex items-center gap-2 text-xs text-emerald-600 mb-2">
                        <Home className="h-3 w-3" />
                        <span>
                          {language === 'vn' ? listing.category.nameVn : listing.category.nameEn || listing.category.nameVn}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {listing.title}
                      </h3>

                      {/* Features */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {listing.bedrooms !== null && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {listing.bedrooms === 0 ? 'Studio' : listing.bedrooms}
                          </span>
                        )}
                        {listing.bathrooms !== null && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {listing.bathrooms}
                          </span>
                        )}
                        {listing.sqft && (
                          <span className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            {listing.sqft} sqft
                          </span>
                        )}
                        {listing.petFriendly && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <PawPrint className="h-4 w-4" />
                          </span>
                        )}
                      </div>

                      {/* Location & Date */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {listing.neighborhood?.nameVn || listing.location || 'Hawaii'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(listing.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
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
                        className={p === pagination.page ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
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
