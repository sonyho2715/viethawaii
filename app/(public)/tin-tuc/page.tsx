import Link from 'next/link';
import { Newspaper, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Tin Tức | VietHawaii',
  description: 'Tin tức và hướng dẫn hữu ích cho cộng đồng Việt Nam tại Hawaii.',
};

// Revalidate every 60 seconds
export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ category?: string }>;
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-4">
          <Newspaper className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tin Tức & Hướng Dẫn
        </h1>
        <p className="text-gray-600">
          News & Guides for Vietnamese in Hawaii
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Link
          href="/tin-tuc"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tất cả
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/tin-tuc?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.slug
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={
              selectedCategory === cat.slug
                ? { backgroundColor: cat.color || '#0D9488' }
                : undefined
            }
          >
            {cat.nameVn}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {selectedCategory
              ? 'Chưa có bài viết nào trong danh mục này.'
              : 'Chưa có bài viết nào.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Link
                    href={`/tin-tuc?category=${article.category.slug}`}
                    className="px-3 py-1 text-xs font-medium rounded-full hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: `${article.category.color}20`,
                      color: article.category.color || '#0D9488',
                    }}
                  >
                    {article.category.nameVn}
                  </Link>
                  <span className="text-sm text-gray-500">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString('vi-VN')
                      : ''}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                  <Link href={`/tin-tuc/${article.slug}`}>
                    {article.titleVn}
                  </Link>
                </h2>
                {article.titleEn && (
                  <p className="text-sm text-gray-500 mb-3">{article.titleEn}</p>
                )}
                {article.excerptVn && (
                  <p className="text-gray-600 mb-4">{article.excerptVn}</p>
                )}
                <Link
                  href={`/tin-tuc/${article.slug}`}
                  className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Đọc thêm
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
