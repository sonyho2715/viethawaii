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
  MapPin,
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
        {/* Background decorations - Hawaii inspired */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/2 w-[300px] h-[300px] bg-blue-400/5 rounded-full blur-2xl" />
          
          {/* Subtle tropical pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/leaves.png')] mix-blend-overlay" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 animate-fade-in tracking-tight text-shadow-md">
              {language === 'vn'
                ? 'Cộng đồng Việt Nam tại Hawaii'
                : 'Vietnamese Community in Hawaii'}
            </h2>
            <p className="text-teal-50 text-base md:text-xl mb-8 animate-slide-up leading-relaxed max-w-2xl text-shadow-sm font-medium opacity-90">
              {language === 'vn'
                ? 'Nền tảng kết nối người Việt. Tìm kiếm nhà ở, việc làm, dịch vụ và tin tức mới nhất tại đảo thiên đường.'
                : 'Connecting Vietnamese people in the islands. Find housing, jobs, services, and the latest news in paradise.'}
            </p>
            <div className="flex flex-wrap items-center gap-4 animate-slide-up">
              <Button asChild className="bg-white text-teal-700 hover:bg-teal-50 rounded-2xl shadow-xl font-bold px-8 py-6 text-base transition-all hover:scale-105 hover:shadow-white/10">
                <Link href="/rao-vat/dang-tin">
                  <PlusCircle size={20} className="mr-2" />
                  {language === 'vn' ? 'Đăng tin miễn phí' : 'Post for free'}
                </Link>
              </Button>
              <Button asChild variant="outline" className="glass border-white/40 text-white hover:bg-white/20 rounded-2xl px-6 py-6 text-base font-semibold transition-all">
                <Link href="/rao-vat">
                  <Search size={20} className="mr-2" />
                  {language === 'vn' ? 'Tìm kiếm' : 'Browse'}
                </Link>
              </Button>
              <Button asChild variant="outline" className="glass border-white/40 text-white hover:bg-white/20 rounded-2xl px-6 py-6 text-base font-semibold transition-all">
                <Link href="/ban-do">
                  <MapPin size={20} className="mr-2" />
                  {language === 'vn' ? 'Bản đồ' : 'Map'}
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Quick stats with glass effect */}
          {totalListings && totalListings > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
              <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-white/90 shadow-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-bold">{totalListings.toLocaleString()}</span>
                <span className="opacity-80">{language === 'vn' ? 'tin đăng' : 'listings'}</span>
              </div>
              <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-white/90 shadow-lg">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="font-bold">{featuredListings.length}</span>
                <span className="opacity-80">{language === 'vn' ? 'tin nổi bật' : 'featured'}</span>
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
          <div className="lg:col-span-6 space-y-8">
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
            <section className="bg-gradient-to-r from-teal-600 via-teal-700 to-blue-700 rounded-3xl shadow-2xl p-8 md:p-12 text-white text-center relative overflow-hidden group">
              {/* Background pattern - refined */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full translate-x-1/3 translate-y-1/3 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-extrabold mb-4 tracking-tight">
                  {language === 'vn'
                    ? 'Đăng tin miễn phí ngay hôm nay!'
                    : 'Post your listing for free today!'}
                </h2>
                <p className="text-teal-50 mb-8 text-base md:text-lg max-w-xl mx-auto opacity-90 font-medium">
                  {language === 'vn'
                    ? 'Tiếp cận hàng ngàn người Việt đang sinh sống và làm việc tại Hawaii.'
                    : 'Reach thousands of Vietnamese people living and working in Hawaii.'}
                </p>
                <Button asChild className="bg-white text-teal-700 hover:bg-teal-50 rounded-2xl shadow-xl font-bold px-10 py-7 text-lg transition-all hover:scale-105">
                  <Link href="/rao-vat/dang-tin">
                    <PlusCircle size={20} className="mr-2" />
                    {language === 'vn' ? 'Đăng Tin Ngay' : 'Post Ad Now'}
                  </Link>
                </Button>
              </div>
            </section>
          </div>

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
