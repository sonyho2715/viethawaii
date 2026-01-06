'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Newspaper, ShoppingBag } from 'lucide-react';
import Sidebar from './Sidebar';
import Widgets from './Widgets';
import ListingCard, { ListingWithRelations, SerializedCategory } from './ListingCard';
import NewsCard, { SerializedArticle } from './NewsCard';

interface HomeClientProps {
  categories: SerializedCategory[];
  featuredListings: ListingWithRelations[];
  latestListings: ListingWithRelations[];
  latestArticles: SerializedArticle[];
}

export default function HomeClient({
  categories,
  featuredListings,
  latestListings,
  latestArticles,
}: HomeClientProps) {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Categories */}
          <aside className="hidden lg:block lg:col-span-3">
            <Sidebar categories={categories} />
          </aside>

          {/* Center Content - News + Listings */}
          <main className="lg:col-span-6 space-y-8">
            {/* News Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <Newspaper size={20} className="mr-2 text-teal-600" />
                  {language === 'vn' ? 'Tin Tức Mới' : 'Latest News'}
                </h2>
                <Link
                  href="/tin-tuc"
                  className="text-teal-600 text-sm font-medium hover:underline flex items-center"
                >
                  {language === 'vn' ? 'Xem tất cả' : 'View all'}
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              {latestArticles.length > 0 ? (
                <div className="space-y-4">
                  {latestArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
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
                    <ShoppingBag size={20} className="mr-2 text-teal-600" />
                    {language === 'vn' ? 'Tin Nổi Bật' : 'Featured Listings'}
                  </h2>
                  <Link
                    href="/rao-vat?featured=true"
                    className="text-teal-600 text-sm font-medium hover:underline flex items-center"
                  >
                    {language === 'vn' ? 'Xem tất cả' : 'View all'}
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {featuredListings.slice(0, 6).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} variant="compact" />
                  ))}
                </div>
              </section>
            )}

            {/* Latest Listings */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <ShoppingBag size={20} className="mr-2 text-teal-600" />
                  {language === 'vn' ? 'Tin Mới Nhất' : 'Latest Listings'}
                </h2>
                <Link
                  href="/rao-vat"
                  className="text-teal-600 text-sm font-medium hover:underline flex items-center"
                >
                  {language === 'vn' ? 'Xem tất cả' : 'View all'}
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              {latestListings.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {latestListings.slice(0, 9).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {language === 'vn'
                      ? 'Chưa có tin đăng nào. Hãy là người đầu tiên!'
                      : 'No listings yet. Be the first to post!'}
                  </p>
                  <Button asChild className="bg-teal-600 hover:bg-teal-700">
                    <Link href="/rao-vat/dang-tin">
                      {language === 'vn' ? 'Đăng Tin Ngay' : 'Post Now'}
                    </Link>
                  </Button>
                </div>
              )}
            </section>

            {/* CTA Banner */}
            <section className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-xl shadow-md p-6 text-white text-center">
              <h2 className="text-xl font-bold mb-2">
                {language === 'vn'
                  ? 'Đăng tin miễn phí ngay hôm nay!'
                  : 'Post your listing for free today!'}
              </h2>
              <p className="text-teal-100 mb-4">
                {language === 'vn'
                  ? 'Tiếp cận hàng ngàn người Việt tại Hawaii'
                  : 'Reach thousands of Vietnamese in Hawaii'}
              </p>
              <Button asChild className="bg-white text-teal-700 hover:bg-teal-50">
                <Link href="/rao-vat/dang-tin">
                  {language === 'vn' ? 'Đăng Tin' : 'Post Ad'}
                </Link>
              </Button>
            </section>
          </main>

          {/* Right Sidebar - Widgets */}
          <aside className="hidden lg:block lg:col-span-3">
            <Widgets />
          </aside>
        </div>

        {/* Mobile Category Links */}
        <div className="lg:hidden mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-semibold text-gray-800 mb-3">
            {language === 'vn' ? 'Danh Mục' : 'Categories'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.filter(c => !c.parentId).map((cat) => (
              <Link
                key={cat.id}
                href={`/rao-vat/${cat.slug}`}
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"
              >
                {language === 'vn' ? cat.nameVn : (cat.nameEn || cat.nameVn)}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Widgets */}
        <div className="lg:hidden mt-6">
          <Widgets />
        </div>
      </div>
    </div>
  );
}
