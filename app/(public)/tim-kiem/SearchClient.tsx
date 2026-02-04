'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Star,
} from 'lucide-react';
import type { Category, Listing, ListingImage, Neighborhood } from '@prisma/client';

interface ListingWithRelations extends Listing {
  category: Category;
  images: ListingImage[];
  neighborhood: Neighborhood | null;
}

interface SearchClientProps {
  categories: Category[];
  neighborhoods: Neighborhood[];
  listings: ListingWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    neighborhood?: string;
    sort?: string;
    page?: string;
  };
}

export default function SearchClient({
  categories,
  neighborhoods,
  listings,
  pagination,
  searchParams,
}: SearchClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [query, setQuery] = useState(searchParams.q || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || '');
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || '');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(searchParams.neighborhood || '');
  const [sortBy, setSortBy] = useState(searchParams.sort || 'relevance');

  // Get parent categories only
  const parentCategories = categories.filter(c => !c.parentId);

  // Build search URL
  const buildSearchUrl = (params: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    return `/tim-kiem?${searchParams.toString()}`;
  };

  // Handle search submit
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const url = buildSearchUrl({
      q: query || undefined,
      category: selectedCategory || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      neighborhood: selectedNeighborhood || undefined,
      sort: sortBy !== 'relevance' ? sortBy : undefined,
    });
    router.push(url);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    const currentParams = {
      q: query || undefined,
      category: selectedCategory || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      neighborhood: selectedNeighborhood || undefined,
      sort: sortBy !== 'relevance' ? sortBy : undefined,
    };

    if (key === 'category') setSelectedCategory(value);
    if (key === 'neighborhood') setSelectedNeighborhood(value);
    if (key === 'sort') setSortBy(value);

    const url = buildSearchUrl({
      ...currentParams,
      [key]: value || undefined,
    });
    router.push(url);
  };

  // Clear all filters
  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedNeighborhood('');
    setSortBy('relevance');
    router.push('/tim-kiem');
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory || minPrice || maxPrice || selectedNeighborhood;

  // Pagination
  const goToPage = (page: number) => {
    const url = buildSearchUrl({
      q: query || undefined,
      category: selectedCategory || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      neighborhood: selectedNeighborhood || undefined,
      sort: sortBy !== 'relevance' ? sortBy : undefined,
      page: page > 1 ? page.toString() : undefined,
    });
    router.push(url);
  };

  const formatPrice = (listing: Listing) => {
    if (listing.price) {
      return `$${Number(listing.price).toLocaleString()}`;
    }
    if (listing.priceType === 'FREE') {
      return language === 'vn' ? 'Miễn phí' : 'Free';
    }
    return language === 'vn' ? 'Liên hệ' : 'Contact';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return language === 'vn' ? 'Hôm nay' : 'Today';
    if (days === 1) return language === 'vn' ? 'Hôm qua' : 'Yesterday';
    if (days < 7) return language === 'vn' ? `${days} ngày trước` : `${days} days ago`;
    return new Date(date).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={language === 'vn' ? 'Tìm kiếm tin rao vặt...' : 'Search listings...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          <Button type="submit" className="h-12 px-6 bg-red-600 hover:bg-red-700">
            <Search className="h-5 w-5 mr-2" />
            {language === 'vn' ? 'Tìm kiếm' : 'Search'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            {language === 'vn' ? 'Bộ lọc' : 'Filters'}
          </Button>
        </form>

        {/* Search Query Display */}
        {searchParams.q && (
          <div className="mt-4">
            <p className="text-gray-600">
              {language === 'vn' ? 'Kết quả tìm kiếm cho' : 'Search results for'}:{' '}
              <span className="font-semibold text-gray-900">&quot;{searchParams.q}&quot;</span>
            </p>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'vn' ? 'Danh mục' : 'Category'}
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'vn' ? 'Tất cả danh mục' : 'All categories'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {language === 'vn' ? 'Tất cả danh mục' : 'All categories'}
                    </SelectItem>
                    {parentCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.icon} {language === 'vn' ? cat.nameVn : (cat.nameEn || cat.nameVn)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Neighborhood Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'vn' ? 'Khu vực' : 'Area'}
                </label>
                <Select
                  value={selectedNeighborhood}
                  onValueChange={(value) => handleFilterChange('neighborhood', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'vn' ? 'Tất cả khu vực' : 'All areas'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {language === 'vn' ? 'Tất cả khu vực' : 'All areas'}
                    </SelectItem>
                    {neighborhoods.map((n) => (
                      <SelectItem key={n.id} value={n.slug}>
                        {n.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'vn' ? 'Giá từ' : 'Min Price'}
                </label>
                <Input
                  type="number"
                  placeholder="$0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'vn' ? 'Giá đến' : 'Max Price'}
                </label>
                <Input
                  type="number"
                  placeholder={language === 'vn' ? 'Không giới hạn' : 'No limit'}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <Button variant="ghost" onClick={clearFilters} disabled={!hasActiveFilters}>
                <X className="h-4 w-4 mr-2" />
                {language === 'vn' ? 'Xóa bộ lọc' : 'Clear filters'}
              </Button>
              <Button onClick={() => handleSearch()} className="bg-red-600 hover:bg-red-700">
                {language === 'vn' ? 'Áp dụng' : 'Apply'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {parentCategories.find(c => c.slug === selectedCategory)?.nameVn || selectedCategory}
              <button onClick={() => handleFilterChange('category', '')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedNeighborhood && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {neighborhoods.find(n => n.slug === selectedNeighborhood)?.name || selectedNeighborhood}
              <button onClick={() => handleFilterChange('neighborhood', '')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(minPrice || maxPrice) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {minPrice && maxPrice
                ? `$${minPrice} - $${maxPrice}`
                : minPrice
                ? `${language === 'vn' ? 'Từ' : 'From'} $${minPrice}`
                : `${language === 'vn' ? 'Đến' : 'Up to'} $${maxPrice}`}
              <button onClick={() => { setMinPrice(''); setMaxPrice(''); handleSearch(); }}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {pagination.total} {language === 'vn' ? 'kết quả' : 'results'}
        </p>
        <Select
          value={sortBy}
          onValueChange={(value) => handleFilterChange('sort', value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">
              {language === 'vn' ? 'Liên quan nhất' : 'Most Relevant'}
            </SelectItem>
            <SelectItem value="newest">
              {language === 'vn' ? 'Mới nhất' : 'Newest'}
            </SelectItem>
            <SelectItem value="price_asc">
              {language === 'vn' ? 'Giá thấp đến cao' : 'Price: Low to High'}
            </SelectItem>
            <SelectItem value="price_desc">
              {language === 'vn' ? 'Giá cao đến thấp' : 'Price: High to Low'}
            </SelectItem>
            <SelectItem value="views">
              {language === 'vn' ? 'Xem nhiều nhất' : 'Most Viewed'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/rao-vat/chi-tiet/${listing.id}`}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div className="aspect-[4/3] relative bg-gray-100">
                  {listing.images[0] ? (
                    <Image
                      src={listing.images[0].imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <ShoppingBag className="h-12 w-12" />
                    </div>
                  )}
                  {listing.isFeatured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      {language === 'vn' ? 'Nổi bật' : 'Featured'}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2 group-hover:text-red-600 transition-colors mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-lg font-bold text-red-600 mb-2">
                    {formatPrice(listing)}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {listing.neighborhood && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {listing.neighborhood.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(listing.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {listing.views}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {language === 'vn' ? listing.category.nameVn : (listing.category.nameEn || listing.category.nameVn)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {language === 'vn' ? 'Không tìm thấy kết quả' : 'No results found'}
          </h3>
          <p className="text-gray-500 mb-6">
            {language === 'vn'
              ? 'Thử thay đổi từ khóa hoặc bộ lọc để tìm được kết quả phù hợp hơn'
              : 'Try changing your search terms or filters to find what you\'re looking for'}
          </p>
          <Button variant="outline" onClick={clearFilters}>
            {language === 'vn' ? 'Xóa tất cả bộ lọc' : 'Clear all filters'}
          </Button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className={pageNum === pagination.page ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
