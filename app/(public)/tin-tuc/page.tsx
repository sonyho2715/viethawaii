import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, Eye, Clock, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Tin Tuc & Huong Dan | VietHawaii',
  description: 'Tin tuc, huong dan va cam nang huu ich cho cong dong Viet Nam tai Hawaii.',
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function getCategories() {
  return db.contentCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
}

async function getArticles(categorySlug?: string) {
  return db.article.findMany({
    where: {
      status: 'PUBLISHED',
      ...(categorySlug && {
        category: { slug: categorySlug },
      }),
    },
    include: {
      category: true,
      author: {
        select: { name: true },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });
}

export default async function NewsPage({ searchParams }: PageProps) {
  const { category: selectedCategory } = await searchParams;
  const [categories, articles] = await Promise.all([
    getCategories(),
    getArticles(selectedCategory),
  ]);

  const heroArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <h1 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-1">
            Tin Tuc & Huong Dan
          </h1>
          <p className="text-[15px] text-gray-500">
            Thong tin, cam nang va huong dan huu ich cho nguoi Viet tai Hawaii
          </p>
        </div>
      </div>

      {/* Category Tabs - Zing.vn style */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5">
            <Link
              href="/tin-tuc"
              className={`shrink-0 px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
                !selectedCategory
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Tat ca
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/tin-tuc?category=${cat.slug}`}
                className={`shrink-0 px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
                  selectedCategory === cat.slug
                    ? 'text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                style={
                  selectedCategory === cat.slug
                    ? { borderBottomColor: cat.color || '#0D9488', color: cat.color || '#0D9488' }
                    : undefined
                }
              >
                {cat.nameVn}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-[16px]">
              {selectedCategory
                ? 'Chua co bai viet nao trong danh muc nay.'
                : 'Chua co bai viet nao.'}
            </p>
          </div>
        ) : (
          <>
            {/* Hero Article - VNExpress/Zing style */}
            {heroArticle && (
              <div className="mb-8">
                <Link
                  href={`/tin-tuc/${heroArticle.slug}`}
                  className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    {/* Hero Image */}
                    <div className="relative md:w-[55%] aspect-[16/9] md:aspect-auto bg-gray-100">
                      {heroArticle.featuredImage ? (
                        <Image
                          src={heroArticle.featuredImage}
                          alt={heroArticle.titleVn}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 660px"
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                          <span className="text-white/30 text-[64px] font-bold">VH</span>
                        </div>
                      )}
                    </div>

                    {/* Hero Content */}
                    <div className="md:w-[45%] p-5 md:p-7 flex flex-col justify-center">
                      <span
                        className="inline-block w-fit px-2.5 py-0.5 text-[12px] font-semibold rounded mb-3"
                        style={{
                          backgroundColor: `${heroArticle.category.color}15`,
                          color: heroArticle.category.color || '#0D9488',
                        }}
                      >
                        {heroArticle.category.nameVn}
                      </span>

                      <h2 className="text-[22px] md:text-[26px] font-bold text-gray-900 leading-tight mb-3 group-hover:text-teal-600 transition-colors">
                        {heroArticle.titleVn}
                      </h2>

                      {heroArticle.excerptVn && (
                        <p className="text-[15px] md:text-[16px] text-gray-600 leading-relaxed mb-4 line-clamp-3">
                          {heroArticle.excerptVn}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[13px] text-gray-400">
                        {heroArticle.publishedAt && (
                          <span>
                            {new Date(heroArticle.publishedAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {estimateReadingTime(heroArticle.contentVn)} phut
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {heroArticle.views.toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Article Grid */}
            {remainingArticles.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {remainingArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/tin-tuc/${article.slug}`}
                    className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Article Thumbnail */}
                    <div className="relative aspect-[16/9] bg-gray-100">
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.titleVn}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Newspaper className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                      {/* Category badge overlay */}
                      <span
                        className="absolute top-3 left-3 px-2 py-0.5 text-[11px] font-semibold rounded text-white"
                        style={{
                          backgroundColor: article.category.color || '#0D9488',
                        }}
                      >
                        {article.category.nameVn}
                      </span>
                    </div>

                    {/* Article Info */}
                    <div className="p-4">
                      <h3 className="text-[16px] font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                        {article.titleVn}
                      </h3>

                      {article.excerptVn && (
                        <p className="text-[14px] text-gray-500 leading-relaxed mb-3 line-clamp-2">
                          {article.excerptVn}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[12px] text-gray-400">
                        <span>
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString('vi-VN')
                            : ''}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {estimateReadingTime(article.contentVn)}p
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views.toLocaleString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
