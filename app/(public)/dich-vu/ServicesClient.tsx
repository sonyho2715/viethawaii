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
  Wrench,
  Search,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  X,
  Star,
  Scale,
  Calculator,
  Languages,
  Hammer,
} from 'lucide-react';
import type { SerializedCategory, SerializedNeighborhood, ListingWithRelations } from '@/components/public/ListingCard';

interface ServicesClientProps {
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
    neighborhood?: string;
    sort?: string;
    page?: string;
  };
}

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'luat-su': Scale,
  'ke-toan': Calculator,
  'phien-dich': Languages,
  'sua-chua': Hammer,
};

export default function ServicesClient({
  categories,
  neighborhoods,
  initialListings,
  pagination,
  searchParams,
}: ServicesClientProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const { language } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.q || '',
    category: searchParams.category || '',
    neighborhood: searchParams.neighborhood || '',
    sort: searchParams.sort || 'newest',
  });

  const subCategories = categories.filter(c => c.parentId);

  const updateFilters = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category) params.set('category', filters.category);
    if (filters.neighborhood) params.set('neighborhood', filters.neighborhood);
    if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
    router.push(`/dich-vu?${params.toString()}`);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      category: '',
      neighborhood: '',
      sort: 'newest',
    });
    router.push('/dich-vu');
    setShowFilters(false);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set('page', String(page));
    router.push(`/dich-vu?${params.toString()}`);
  };

  const hasActiveFilters = filters.q || filters.category || filters.neighborhood;

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

  const getServiceIcon = (slug: string) => {
    return SERVICE_ICONS[slug] || Wrench;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Wrench className="h-8 w-8" />
                {language === 'vn' ? 'Dịch vụ' : 'Services'}
              </h1>
              <p className="text-purple-100 mt-1">
                {language === 'vn'
                  ? 'Tìm dịch vụ từ cộng đồng Việt Hawaii'
                  : 'Find services from the Vietnamese Hawaii community'}
              </p>
            </div>
            <Button asChild className="bg-white text-purple-600 hover:bg-purple-50">
              <Link href="/dich-vu/dang-tin">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'vn' ? 'Đăng dịch vụ' : 'Post Service'}
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
                placeholder={language === 'vn' ? 'Tìm kiếm dịch vụ...' : 'Search services...'}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white text-gray-700 border-white hover:bg-purple-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              {language === 'vn' ? 'Lọc' : 'Filter'}
            </Button>
            <Button onClick={applyFilters} className="bg-purple-700 hover:bg-purple-800">
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
              className={!filters.category ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              {language === 'vn' ? 'Tất cả' : 'All'}
            </Button>
            {subCategories.map(cat => {
              const IconComponent = getServiceIcon(cat.slug);
              return (
                <Button
                  key={cat.id}
                  variant={filters.category === cat.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    updateFilters('category', cat.slug);
                    setTimeout(applyFilters, 0);
                  }}
                  className={filters.category === cat.slug ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  <IconComponent className="h-4 w-4 mr-1" />
                  {language === 'vn' ? cat.nameVn : cat.nameEn || cat.nameVn}
                </Button>
              );
            })}
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
                  <SelectValue placeholder={language === 'vn' ? 'Loại dịch vụ' : 'Service Type'} />
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
              <Button onClick={applyFilters} size="sm" className="bg-purple-600 hover:bg-purple-700">
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
            {pagination.total} {language === 'vn' ? 'dịch vụ' : 'services'}
          </p>
        </div>

        {initialListings.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'vn' ? 'Không tìm thấy dịch vụ' : 'No services found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {language === 'vn'
                ? 'Thử thay đổi bộ lọc hoặc đăng dịch vụ mới'
                : 'Try adjusting your filters or post a new service'}
            </p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/dich-vu/dang-tin">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'vn' ? 'Đăng dịch vụ' : 'Post Service'}
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialListings.map(listing => {
                const IconComponent = getServiceIcon(listing.category.slug);
                return (
                  <Link
                    key={listing.id}
                    href={`/dich-vu/chi-tiet/${listing.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      {/* Image or Icon */}
                      <div className="relative aspect-[16/9] bg-gradient-to-br from-purple-100 to-violet-100">
                        {listing.images && listing.images.length > 0 ? (
                          <Image
                            src={listing.images[0].imageUrl}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <IconComponent className="h-16 w-16 text-purple-300" />
                          </div>
                        )}
                        {listing.isFeatured && (
                          <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {language === 'vn' ? 'Uy tín' : 'Verified'}
                          </span>
                        )}
                      </div>

                      <CardContent className="p-4">
                        {/* Category */}
                        <div className="flex items-center gap-2 text-xs text-purple-600 mb-2">
                          <IconComponent className="h-3 w-3" />
                          <span>
                            {language === 'vn' ? listing.category.nameVn : listing.category.nameEn || listing.category.nameVn}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {listing.title}
                        </h3>

                        {/* Description */}
                        {listing.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {listing.description}
                          </p>
                        )}

                        {/* Service Area & Experience */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {listing.serviceArea && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {listing.serviceArea}
                            </span>
                          )}
                          {listing.experience && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {listing.experience}
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
                        className={p === pagination.page ? 'bg-purple-600 hover:bg-purple-700' : ''}
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
