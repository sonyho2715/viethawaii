'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building,
} from 'lucide-react';
import type { SerializedCategory, SerializedNeighborhood } from '@/components/public/ListingCard';

export interface JobListing {
  id: number;
  title: string;
  titleEn: string | null;
  description: string | null;
  price: number | null;
  priceType: string;
  location: string | null;
  jobType: string | null;
  salary: string | null;
  benefits: string | null;
  views: number;
  isFeatured: boolean;
  createdAt: string;
  category: SerializedCategory | null;
  neighborhood: {
    id: number;
    name: string;
    slug: string;
  } | null;
  images: {
    id: number;
    imageUrl: string;
    thumbnailUrl: string | null;
  }[];
}

interface JobsClientProps {
  categories: SerializedCategory[];
  neighborhoods: SerializedNeighborhood[];
  initialListings: JobListing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchParams: {
    category?: string;
    q?: string;
    jobType?: string;
    neighborhood?: string;
    sort?: string;
    page?: string;
  };
}

const JOB_TYPES = [
  { value: 'full-time', labelVn: 'Toàn thời gian', labelEn: 'Full-time' },
  { value: 'part-time', labelVn: 'Bán thời gian', labelEn: 'Part-time' },
  { value: 'contract', labelVn: 'Hợp đồng', labelEn: 'Contract' },
  { value: 'temporary', labelVn: 'Tạm thời', labelEn: 'Temporary' },
];

export default function JobsClient({
  categories,
  neighborhoods,
  initialListings,
  pagination,
  searchParams,
}: JobsClientProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(searchParams.q || '');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const mainCategory = categories.find(c => c.slug === 'viec-lam');
  const subcategories = categories.filter(c => c.parentId === mainCategory?.id);

  const currentSubcategory = searchParams.category
    ? categories.find(c => c.slug === searchParams.category)
    : null;

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== key && k !== 'page') {
        params.set(k, v);
      }
    });
    if (value) {
      params.set(key, value);
    }
    const queryString = params.toString();
    router.push(queryString ? `/viec-lam?${queryString}` : '/viec-lam');
  };

  const clearAllFilters = () => {
    router.push('/viec-lam');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('q', searchQuery || null);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set('page', page.toString());
    router.push(`/viec-lam?${params.toString()}`);
  };

  const hasActiveFilters = !!(
    searchParams.category ||
    searchParams.q ||
    searchParams.jobType ||
    searchParams.neighborhood
  );

  const formatSalary = (listing: JobListing) => {
    if (listing.salary) return listing.salary;
    if (listing.price) {
      const priceStr = `$${listing.price.toLocaleString()}`;
      if (listing.priceType === 'HOURLY') return `${priceStr}/hr`;
      if (listing.priceType === 'MONTHLY') return `${priceStr}/mo`;
      return priceStr;
    }
    return language === 'vn' ? 'Thương lượng' : 'Negotiable';
  };

  const getJobTypeLabel = (jobType: string | null) => {
    if (!jobType) return null;
    const found = JOB_TYPES.find(j => j.value === jobType);
    return found ? (language === 'vn' ? found.labelVn : found.labelEn) : jobType;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-2">
            <Link href="/" className="hover:text-white">{t.home}</Link>
            <span>/</span>
            <span className="text-white">{language === 'vn' ? 'Việc làm' : 'Jobs'}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Briefcase className="h-8 w-8" />
                {language === 'vn' ? 'Việc Làm' : 'Jobs'}
              </h1>
              <p className="text-blue-200 mt-1">
                {language === 'vn'
                  ? 'Tìm việc làm từ cộng đồng Việt Nam tại Hawaii'
                  : 'Find jobs from the Vietnamese community in Hawaii'}
              </p>
            </div>
            <Button asChild className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/viec-lam/dang-tin">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'vn' ? 'Đăng Tuyển Dụng' : 'Post a Job'}
              </Link>
            </Button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder={language === 'vn' ? 'Tìm công việc...' : 'Search jobs...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-gray-900 border-0"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Link
              href="/viec-lam"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !currentSubcategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'vn' ? 'Tất cả' : 'All Jobs'}
            </Link>
            {subcategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/viec-lam?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  currentSubcategory?.slug === cat.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {language === 'vn' ? cat.nameVn : cat.nameEn || cat.nameVn}
              </Link>
            ))}
          </div>
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
                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'vn' ? 'Loại công việc' : 'Job Type'}
                      </label>
                      <Select
                        value={searchParams.jobType || '__all__'}
                        onValueChange={(v) => {
                          updateFilters('jobType', v === '__all__' ? null : v);
                          setFiltersOpen(false);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">{language === 'vn' ? 'Tất cả' : 'All'}</SelectItem>
                          {JOB_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {language === 'vn' ? type.labelVn : type.labelEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'vn' ? 'Khu vực' : 'Area'}
                      </label>
                      <Select
                        value={searchParams.neighborhood || '__all__'}
                        onValueChange={(v) => {
                          updateFilters('neighborhood', v === '__all__' ? null : v);
                          setFiltersOpen(false);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">{language === 'vn' ? 'Tất cả' : 'All'}</SelectItem>
                          {neighborhoods.map((n) => (
                            <SelectItem key={n.id} value={n.slug}>
                              {n.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-2">
                <Select
                  value={searchParams.jobType || '__all__'}
                  onValueChange={(v) => updateFilters('jobType', v === '__all__' ? null : v)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={language === 'vn' ? 'Loại việc' : 'Job Type'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{language === 'vn' ? 'Tất cả loại' : 'All types'}</SelectItem>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {language === 'vn' ? type.labelVn : type.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={searchParams.neighborhood || '__all__'}
                  onValueChange={(v) => updateFilters('neighborhood', v === '__all__' ? null : v)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={language === 'vn' ? 'Khu vực' : 'Area'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{language === 'vn' ? 'Tất cả khu vực' : 'All areas'}</SelectItem>
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
                    <SelectItem value="views">{language === 'vn' ? 'Xem nhiều' : 'Most viewed'}</SelectItem>
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
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {language === 'vn' ? 'Xóa lọc' : 'Clear all'}
                  </Button>
                </div>
              )}
            </div>

            <span className="text-sm text-gray-500">
              {pagination.total} {language === 'vn' ? 'việc làm' : 'jobs'}
            </span>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="container mx-auto px-4 py-8">
        {initialListings.length > 0 ? (
          <>
            <div className="space-y-4">
              {initialListings.map((job) => (
                <Link
                  key={job.id}
                  href={`/viec-lam/chi-tiet/${job.id}`}
                  className="block bg-white rounded-lg border hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex gap-4">
                    {/* Company Logo / Image */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {job.images[0] ? (
                        <Image
                          src={job.images[0].thumbnailUrl || job.images[0].imageUrl}
                          alt={job.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate">
                            {job.title}
                          </h3>
                          {job.category && (
                            <p className="text-sm text-gray-500">
                              {language === 'vn' ? job.category.nameVn : job.category.nameEn || job.category.nameVn}
                            </p>
                          )}
                        </div>
                        {job.isFeatured && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                            {language === 'vn' ? 'Nổi bật' : 'Featured'}
                          </Badge>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        {job.neighborhood && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.neighborhood.name}
                          </span>
                        )}
                        {job.jobType && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {getJobTypeLabel(job.jobType)}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-semibold text-blue-600">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(job)}
                        </span>
                      </div>

                      {job.benefits && (
                        <p className="mt-2 text-sm text-gray-500 line-clamp-1">
                          {job.benefits}
                        </p>
                      )}
                    </div>
                  </div>
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
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1;
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
                        className={pagination.page === page ? 'bg-blue-600 hover:bg-blue-700' : ''}
                      >
                        {page}
                      </Button>
                    );
                  }
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
              <Briefcase className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'vn' ? 'Không tìm thấy việc làm' : 'No jobs found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'vn'
                ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc'
                : 'Try a different search or clear filters'}
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/viec-lam/dang-tin">
                {language === 'vn' ? 'Đăng tuyển dụng' : 'Post a Job'}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
