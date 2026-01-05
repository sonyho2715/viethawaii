'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import ListingCard, {
  type ListingWithRelations,
  type SerializedCategory,
  type SerializedNeighborhood,
} from '@/components/public/ListingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from 'lucide-react';

interface CategoryWithChildren extends SerializedCategory {
  children?: SerializedCategory[];
}

interface ListingsClientProps {
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
    minPrice?: string;
    maxPrice?: string;
    neighborhood?: string;
    sort?: string;
    page?: string;
    featured?: string;
  };
  currentCategory?: CategoryWithChildren | null;
}

export default function ListingsClient({
  categories,
  neighborhoods,
  initialListings,
  pagination,
  searchParams,
  currentCategory: passedCategory,
}: ListingsClientProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.q || '');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Get main categories (no parent)
  const mainCategories = categories.filter(c => !c.parentId);

  // Get current category info (use passed category or find from searchParams)
  const currentCategory = passedCategory || (searchParams.category
    ? categories.find(c => c.slug === searchParams.category)
    : null);

  // Get subcategories of current category
  const subcategories = passedCategory?.children || (currentCategory
    ? categories.filter(c => c.parentId === currentCategory.id)
    : []);

  // Determine base URL (category page vs main listings page)
  const isOnCategoryPage = passedCategory != null;
  const baseUrl = isOnCategoryPage ? `/rao-vat/${passedCategory.slug}` : '/rao-vat';

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams();

    // Preserve existing params (except category when on category page)
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== key && k !== 'page' && !(isOnCategoryPage && k === 'category')) {
        params.set(k, v);
      }
    });

    // Set new value
    if (value) {
      params.set(key, value);
    }

    // Reset to page 1 when filters change
    const queryString = params.toString();
    router.push(queryString ? `${baseUrl}?${queryString}` : baseUrl);
  };

  const clearAllFilters = () => {
    router.push(baseUrl);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('q', searchQuery || null);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && !(isOnCategoryPage && k === 'category')) params.set(k, v);
    });
    params.set('page', page.toString());
    router.push(`${baseUrl}?${params.toString()}`);
  };

  const hasActiveFilters = !!(
    searchParams.category ||
    searchParams.q ||
    searchParams.minPrice ||
    searchParams.maxPrice ||
    searchParams.neighborhood ||
    searchParams.featured
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title & Breadcrumb */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Link href="/" className="hover:text-red-600">
                  {t.home}
                </Link>
                <span>/</span>
                <span className="text-gray-900">{t.listings}</span>
                {currentCategory && (
                  <>
                    <span>/</span>
                    <span className="text-gray-900">
                      {language === 'vn' ? currentCategory.nameVn : currentCategory.nameEn || currentCategory.nameVn}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-2xl font-bold">
                {currentCategory
                  ? language === 'vn'
                    ? currentCategory.nameVn
                    : currentCategory.nameEn || currentCategory.nameVn
                  : searchParams.featured === 'true'
                  ? t.featured_listings
                  : t.all_listings}
              </h1>
            </div>

            {/* Search & Post Button */}
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder={t.search_placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9"
                />
              </form>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/rao-vat/dang-tin">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.post_listing}
                </Link>
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            <Link
              href="/rao-vat"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !currentCategory
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'vn' ? 'Tất cả' : 'All'}
            </Link>
            {mainCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/rao-vat/${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  currentCategory?.slug === cat.slug || currentCategory?.parentId === cat.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {language === 'vn' ? cat.nameVn : cat.nameEn || cat.nameVn}
              </Link>
            ))}
          </div>

          {/* Subcategories */}
          {subcategories.length > 0 && (
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-2">
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/rao-vat/${sub.slug}`}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    currentCategory?.slug === sub.slug
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {language === 'vn' ? sub.nameVn : sub.nameEn || sub.nameVn}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {language === 'vn' ? 'Lọc' : 'Filter'}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>{language === 'vn' ? 'Bộ lọc' : 'Filters'}</SheetTitle>
                  </SheetHeader>
                  <FilterForm
                    categories={mainCategories}
                    neighborhoods={neighborhoods}
                    searchParams={searchParams}
                    language={language}
                    t={t}
                    onFilter={(key, value) => {
                      updateFilters(key, value);
                      setFiltersOpen(false);
                    }}
                  />
                </SheetContent>
              </Sheet>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-2">
                <Select
                  value={searchParams.neighborhood || ''}
                  onValueChange={(v) => updateFilters('neighborhood', v || null)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t.select_neighborhood} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{language === 'vn' ? 'Tất cả khu vực' : 'All areas'}</SelectItem>
                    {neighborhoods.map((n) => (
                      <SelectItem key={n.id} value={n.slug}>
                        {n.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={searchParams.sort || 'newest'}
                  onValueChange={(v) => updateFilters('sort', v === 'newest' ? null : v)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{language === 'vn' ? 'Mới nhất' : 'Newest'}</SelectItem>
                    <SelectItem value="price_asc">{language === 'vn' ? 'Giá thấp đến cao' : 'Price: Low to High'}</SelectItem>
                    <SelectItem value="price_desc">{language === 'vn' ? 'Giá cao đến thấp' : 'Price: High to Low'}</SelectItem>
                    <SelectItem value="views">{language === 'vn' ? 'Xem nhiều nhất' : 'Most viewed'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  {searchParams.q && (
                    <Badge variant="secondary" className="gap-1">
                      &ldquo;{searchParams.q}&rdquo;
                      <button onClick={() => updateFilters('q', null)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    {language === 'vn' ? 'Xóa bộ lọc' : 'Clear all'}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {pagination.total} {language === 'vn' ? 'kết quả' : 'results'}
              </span>
              <div className="hidden sm:flex border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className={viewMode === 'grid' ? 'bg-gray-100' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={viewMode === 'list' ? 'bg-gray-100' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="container mx-auto px-4 py-8">
        {initialListings.length > 0 ? (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {initialListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  variant={viewMode === 'list' ? 'horizontal' : 'default'}
                />
              ))}
            </div>

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
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show first, last, and pages around current
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={pagination.page === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className={pagination.page === page ? 'bg-red-600 hover:bg-red-700' : ''}
                      >
                        {page}
                      </Button>
                    );
                  }
                  // Show ellipsis
                  if (page === pagination.page - 2 || page === pagination.page + 2) {
                    return <span key={page}>...</span>;
                  }
                  return null;
                })}
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
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.no_results}</h3>
            <p className="text-gray-500 mb-6">{t.try_different_search}</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/rao-vat/dang-tin">{t.post_listing}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Filter Form Component for mobile
function FilterForm({
  categories,
  neighborhoods,
  searchParams,
  language,
  t,
  onFilter,
}: {
  categories: SerializedCategory[];
  neighborhoods: SerializedNeighborhood[];
  searchParams: ListingsClientProps['searchParams'];
  language: string;
  t: Record<string, string>;
  onFilter: (key: string, value: string | null) => void;
}) {
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || '');

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Category */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          {language === 'vn' ? 'Danh mục' : 'Category'}
        </label>
        <Select
          value={searchParams.category || ''}
          onValueChange={(v) => onFilter('category', v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t.select_category} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{language === 'vn' ? 'Tất cả' : 'All'}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {language === 'vn' ? cat.nameVn : cat.nameEn || cat.nameVn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Neighborhood */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          {language === 'vn' ? 'Khu vực' : 'Neighborhood'}
        </label>
        <Select
          value={searchParams.neighborhood || ''}
          onValueChange={(v) => onFilter('neighborhood', v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t.select_neighborhood} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{language === 'vn' ? 'Tất cả' : 'All'}</SelectItem>
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
        <label className="text-sm font-medium mb-2 block">
          {language === 'vn' ? 'Khoảng giá' : 'Price Range'}
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="flex-1"
          />
          <span>-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="flex-1"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          onClick={() => {
            if (minPrice) onFilter('minPrice', minPrice);
            if (maxPrice) onFilter('maxPrice', maxPrice);
          }}
        >
          {language === 'vn' ? 'Áp dụng' : 'Apply'}
        </Button>
      </div>
    </div>
  );
}
