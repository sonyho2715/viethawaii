import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import ArticleContent from './ArticleContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
  });

  if (!article) {
    return { title: 'Bài viết không tồn tại' };
  }

  return {
    title: `${article.titleVn} | VietHawaii`,
    description: article.excerptVn || article.titleVn,
    openGraph: {
      title: article.titleVn,
      description: article.excerptVn || undefined,
    },
  };
}

async function getArticle(slug: string) {
  const article = await db.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (article) {
    // Increment view count
    await db.article.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  }

  return article;
}

async function getRelatedArticles(categoryId: number, currentSlug: string) {
  return db.article.findMany({
    where: {
      categoryId,
      slug: { not: currentSlug },
      status: 'PUBLISHED',
    },
    include: {
      category: true,
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.categoryId, slug);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Link */}
      <Link
        href="/tin-tuc"
        className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Quay lại tin tức
      </Link>

      {/* Article Header */}
      <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="px-3 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: `${article.category.color}20`,
                color: article.category.color || '#0D9488',
              }}
            >
              <Tag className="h-3 w-3 inline mr-1" />
              {article.category.nameVn}
            </span>
            {article.publishedAt && (
              <span className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            <span className="flex items-center text-sm text-gray-500">
              <Eye className="h-4 w-4 mr-1" />
              {article.views} lượt xem
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {article.titleVn}
          </h1>
          {article.titleEn && (
            <p className="text-lg text-gray-500 mb-6">{article.titleEn}</p>
          )}

          {/* Content - rendered safely */}
          <ArticleContent content={article.contentVn} />
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Bài viết liên quan
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/tin-tuc/${related.slug}`}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <span
                  className="inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2"
                  style={{
                    backgroundColor: `${related.category.color}20`,
                    color: related.category.color || '#0D9488',
                  }}
                >
                  {related.category.nameVn}
                </span>
                <h3 className="font-medium text-gray-900 line-clamp-2">
                  {related.titleVn}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
