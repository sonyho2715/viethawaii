'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Newspaper,
  ShoppingBag,
  PlusCircle,
  Search,
  BookOpen,
  Star,
  Home,
  Briefcase,
  Wrench,
  Calendar,
  Tag,
  MessageCircle,
} from 'lucide-react';
import Sidebar from './Sidebar';
import Widgets from './Widgets';
import ListingCard, { ListingWithRelations, SerializedCategory } from './ListingCard';
import NewsCard, { SerializedArticle } from './NewsCard';

interface HomeClientProps {
  categories: SerializedCategory[];
  featuredListings: ListingWithRelations[];
  latestListings: ListingWithRelations[];
  latestArticles: SerializedArticle[];
  totalListings?: number;
}

const MOBILE_CATEGORIES = [
  { labelVn: 'Nhà ở', labelEn: 'Housing', icon: Home, href: '/nha-o', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { labelVn: 'Việc làm', labelEn: 'Jobs', icon: Briefcase, href: '/viec-lam', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { labelVn: 'Rao vặt', labelEn: 'Classifieds', icon: ShoppingBag, href: '/rao-vat', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { labelVn: 'Dịch vụ', labelEn: 'Services', icon: Wrench, href: '/dich-vu', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { labelVn: 'Sự kiện', labelEn: 'Events', icon: Calendar, href: '/su-kien', color: 'bg-pink-50 text-pink-600 border-pink-100' },
  { labelVn: 'Cộng đồng', labelEn: 'Community', icon: MessageCircle, href: '/cong-dong', color: 'bg-orange-50 text-orange-600 border-orange-100' },
];

export default function HomeClient({
  categories,
  featuredListings,
  latestListings,
  latestArticles,
  totalListings,
}: HomeClientProps) {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 animate-fade-in">
              {language === 'vn'
                ? 'Chào mừng đến VietHawaii'
                : 'Welcome to VietHawaii'}
            </h2>
            <p className="text-teal-100 text-sm md:text-base mb-5 animate-slide-up leading-relaxed">
              {language === 'vn'
                ? 'Nền tảng kết nối cộng đồng Việt Nam tại Hawaii. Tìm nhà ở, việc làm, dịch vụ và tin tức.'
                : 'The platform connecting the Vietnamese community in Hawaii. Find housing, jobs, services, and news.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 animate-slide-up">
              <Button asChild className="bg-white text-teal-700 hover:bg-teal-50 rounded-xl shadow-md font-semibold">
                <Link href="/rao-vat/dang-tin">
                  <PlusCircle size={16} className="mr-2" />
                  {language === 'vn' ? 'Đăng tin miễn phí' : 'Post for free'}
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl">
                <Link href="/rao-vat">
                  <Search size={16} className="mr-2" />
                  {language === 'vn' ? 'Tìm kiếm' : 'Browse listings'}
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl">
                <Link href="/huong-dan">
                  <BookOpen size={16} className="mr-2" />
                  {language === 'vn' ? 'Hướng dẫn' : 'Guide'}
                </Link>
              </Button>
            </div>
          </div>
          {/* Quick stats */}
          {totalListings && totalListings > 0 && (
            <div className="mt-6 flex items-center gap-6 text-sm text-teal-200">
              <div className="flex items-center gap-1.5">
                <ShoppingBag size={14} />
                <span>{totalListings.toLocaleString()} {language === 'vn' ? 'tin đăng' : 'listings'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={14} />
                <span>{featuredListings.length} {language === 'vn' ? 'tin nổi bật' : 'featured'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Category Grid */}
      <div className="lg:hidden bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            {MOBILE_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all hover:shadow-sm ${cat.color}`}
              >
                <cat.icon size={20} />
                <span className="text-xs font-medium text-center">
                  {language === 'vn' ? cat.labelVn : cat.labelEn}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Categories */}
          <aside className="hidden lg:block lg:col-span-3">
            <Sidebar categories={categories} />
          </aside>

          {/* Center Content - Listings + News */}
          <main className="lg:col-span-6 space-y-8">
            {/* Latest Listings */}
            <section className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <div className="w-1 h-5 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full mr-2.5" />
                  <ShoppingBag size={18} className="mr-2 text-teal-600" />
                  {language === 'vn' ? 'Tin Mới Nhất' : 'Latest Listings'}
                </h2>
                <Link
                  href="/rao-vat"
                  className="text-teal-600 text-sm font-medium hover:text-teal-700 flex items-center group"
                >
                  {language === 'vn' ? 'Xem tất cả' : 'View all'}
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              {latestListings.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 stagger-children">
                  {latestListings.slice(0, 9).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {language === 'vn'
                      ? 'Chưa có tin đăng nào. Hãy là người đầu tiên!'
                      : 'No listings yet. Be the first to post!'}
                  </p>
                  <Button asChild className="bg-teal-600 hover:bg-teal-700 rounded-xl">
                    <Link href="/rao-vat/dang-tin">
                      {language === 'vn' ? 'Đăng Tin Ngay' : 'Post Now'}
                    </Link>
                  </Button>
                </div>
              )}
            </section>

            {/* News Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <div className="w-1 h-5 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full mr-2.5" />
                  <Newspaper size={18} className="mr-2 text-teal-600" />
                  {language === 'vn' ? 'Tin Tức Mới' : 'Latest News'}
                </h2>
                <Link
                  href="/tin-tuc"
                  className="text-teal-600 text-sm font-medium hover:text-teal-700 flex items-center group"
                >
                  {language === 'vn' ? 'Xem tất cả' : 'View all'}
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              {latestArticles.length > 0 ? (
                <div className="space-y-4">
                  {latestArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {language === 'vn'
                      ? 'Chưa có tin tức nào.'
                      : 'No news articles yet.'}
                  </p>
                </div>
              )}
            </section>

            {/* Featured Listings */}
            {featuredListings.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <div className="w-1 h-5 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full mr-2.5" />
                    <Star size={18} className="mr-2 text-amber-500" />
                    {language === 'vn' ? 'Tin Nổi Bật' : 'Featured Listings'}
                  </h2>
                  <Link
                    href="/rao-vat?featured=true"
                    className="text-teal-600 text-sm font-medium hover:text-teal-700 flex items-center group"
                  >
                    {language === 'vn' ? 'Xem tất cả' : 'View all'}
                    <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 stagger-children">
                  {featuredListings.slice(0, 6).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} variant="compact" />
                  ))}
                </div>
              </section>
            )}

            {/* CTA Banner */}
            <section className="bg-gradient-to-r from-teal-600 via-teal-700 to-blue-700 rounded-2xl shadow-lg p-6 md:p-8 text-white text-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
              </div>
              <div className="relative">
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  {language === 'vn'
                    ? 'Đăng tin miễn phí ngay hôm nay!'
                    : 'Post your listing for free today!'}
                </h2>
                <p className="text-teal-100 mb-5 text-sm md:text-base">
                  {language === 'vn'
                    ? 'Tiếp cận hàng ngàn người Việt tại Hawaii'
                    : 'Reach thousands of Vietnamese in Hawaii'}
                </p>
                <Button asChild className="bg-white text-teal-700 hover:bg-teal-50 rounded-xl shadow-md font-semibold px-6">
                  <Link href="/rao-vat/dang-tin">
                    <PlusCircle size={16} className="mr-2" />
                    {language === 'vn' ? 'Đăng Tin' : 'Post Ad'}
                  </Link>
                </Button>
              </div>
            </section>
          </main>

          {/* Right Sidebar - Widgets */}
          <aside className="hidden lg:block lg:col-span-3">
            <Widgets />
          </aside>
        </div>

        {/* Mobile Widgets */}
        <div className="lg:hidden mt-6">
          <Widgets />
        </div>
      </div>
    </div>
  );
}
