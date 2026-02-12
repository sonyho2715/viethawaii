import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, Clock, ChevronRight, Share2 } from 'lucide-react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import ArticleContent from './ArticleContent';
import ShareButtons from './ShareButtons';
import StructuredData from '@/components/public/StructuredData';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function estimateReadingTime(content: string): number {
  // Vietnamese reading speed ~200 words/min (Vietnamese words are shorter)
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article) {
    return { title: 'Bai viet khong ton tai' };
  }

  return {
    title: `${article.titleVn} | VietHawaii`,
    description: article.excerptVn || article.titleVn,
    openGraph: {
      title: article.titleVn,
      description: article.excerptVn || undefined,
      images: article.featuredImage ? [article.featuredImage] : undefined,
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
      tags: true,
    },
  });

  if (article) {
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
    take: 4,
    orderBy: { publishedAt: 'desc' },
  });
}

async function getLatestArticles(currentSlug: string) {
  return db.article.findMany({
    where: {
      slug: { not: currentSlug },
      status: 'PUBLISHED',
    },
    include: {
      category: true,
    },
    take: 5,
    orderBy: { publishedAt: 'desc' },
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  const [relatedArticles, latestArticles] = await Promise.all([
    getRelatedArticles(article.categoryId, slug),
    getLatestArticles(slug),
  ]);

  const readingTime = estimateReadingTime(article.contentVn);

  // Prepare Schema.org JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.titleVn,
    image: article.featuredImage ? [article.featuredImage] : [],
    datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
    dateModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
    author: [
      {
        '@type': 'Person',
        name: article.author.name || 'VietHawaii',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <StructuredData data={articleSchema} />
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <nav className="max-w-[1200px] mx-auto px-4 py-3">
          <ol className="flex items-center text-[13px] text-gray-500 flex-wrap gap-1">
            <li>
              <Link href="/" className="hover:text-teal-600 transition-colors">
                Trang chu
              </Link>
            </li>
            <li><ChevronRight className="h-3 w-3 inline mx-1" /></li>
            <li>
              <Link href="/tin-tuc" className="hover:text-teal-600 transition-colors">
                Tin tuc
              </Link>
            </li>
            <li><ChevronRight className="h-3 w-3 inline mx-1" /></li>
            <li>
              <Link
                href={`/tin-tuc?category=${article.category.slug}`}
                className="hover:text-teal-600 transition-colors"
                style={{ color: article.category.color || undefined }}
              >
                {article.category.nameVn}
              </Link>
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Main Article Column */}
          <article className="flex-1 min-w-0 max-w-[780px]">
            {/* Category Badge */}
            <Link
              href={`/tin-tuc?category=${article.category.slug}`}
              className="inline-block px-3 py-1 text-[13px] font-semibold rounded mb-4 hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: `${article.category.color}15`,
                color: article.category.color || '#0D9488',
              }}
            >
              {article.category.nameVn}
            </Link>

            {/* Title - VNExpress style: large, bold */}
            <h1 className="text-[26px] md:text-[32px] font-bold text-gray-900 leading-tight mb-3">
              {article.titleVn}
            </h1>

            {/* Meta bar: author, date, reading time, views */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-gray-500 mb-5 pb-5 border-b border-gray-100">
              {/* Author */}
              <div className="flex items-center gap-2">
                {article.author.image ? (
                  <Image
                    src={article.author.image}
                    alt={article.author.name || 'Tac gia'}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-teal-700 text-[12px] font-semibold">
                      {(article.author.name || 'V')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="font-medium text-gray-700">
                  {article.author.name || 'VietHawaii'}
                </span>
              </div>

              <span className="text-gray-300">|</span>

              {/* Date */}
              {article.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}

              {/* Reading time */}
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} phut doc
              </span>

              {/* Views */}
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {article.views.toLocaleString('vi-VN')}
              </span>
            </div>

            {/* Sapo (lead paragraph) - VNExpress signature style */}
            {article.excerptVn && (
              <p className="text-[18px] md:text-[20px] font-bold text-gray-800 leading-[1.6] mb-6">
                {article.excerptVn}
              </p>
            )}

            {/* Featured Image */}
            {article.featuredImage && (
              <figure className="mb-6">
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={article.featuredImage}
                    alt={article.titleVn}
                    fill
                    className="object-cover"
                    sizes="(max-width: 780px) 100vw, 780px"
                    priority
                  />
                </div>
                {article.titleEn && (
                  <figcaption className="mt-2 text-[13px] text-gray-500 italic text-center">
                    {article.titleEn}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Article Body */}
            <ArticleContent content={article.contentVn} />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((at) => (
                    <span
                      key={at.tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[13px] hover:bg-gray-200 transition-colors"
                    >
                      #{at.tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share bar */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <ShareButtons title={article.titleVn} slug={slug} />
            </div>

            {/* Related Articles - Same category */}
            {relatedArticles.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h2 className="text-[20px] font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-teal-500 rounded-full" />
                  Tin cung chuyen muc
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/tin-tuc/${related.slug}`}
                      className="group flex gap-4 p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {related.featuredImage ? (
                        <div className="relative w-[120px] h-[80px] rounded-md overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={related.featuredImage}
                            alt={related.titleVn}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                        </div>
                      ) : (
                        <div className="w-[120px] h-[80px] rounded-md bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center shrink-0">
                          <span className="text-teal-400 text-[24px]">VH</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[15px] text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors leading-snug">
                          {related.titleVn}
                        </h3>
                        {related.publishedAt && (
                          <span className="text-[12px] text-gray-400 mt-1.5 block">
                            {new Date(related.publishedAt).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar - Latest Articles */}
          <aside className="hidden lg:block w-[340px] shrink-0">
            <div className="sticky top-6">
              <h3 className="text-[17px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-red-500 rounded-full" />
                Tin moi nhat
              </h3>
              <div className="space-y-4">
                {latestArticles.map((item, idx) => (
                  <Link
                    key={item.id}
                    href={`/tin-tuc/${item.slug}`}
                    className="group flex gap-3 items-start"
                  >
                    <span className="text-[28px] font-bold text-gray-200 leading-none w-8 shrink-0 group-hover:text-teal-400 transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <h4 className="text-[14px] font-medium text-gray-800 line-clamp-2 group-hover:text-teal-600 transition-colors leading-snug">
                        {item.titleVn}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: item.category.color || '#0D9488' }}
                        >
                          {item.category.nameVn}
                        </span>
                        {item.publishedAt && (
                          <span className="text-[11px] text-gray-400">
                            {new Date(item.publishedAt).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Quick links box */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-[14px] font-semibold text-gray-700 mb-3">Chuyen muc</h4>
                <div className="flex flex-wrap gap-2">
                  {['tin-tuc', 'huong-dan', 'cong-dong', 'am-thuc', 'du-lich'].map((cat) => (
                    <Link
                      key={cat}
                      href={`/tin-tuc?category=${cat}`}
                      className="px-3 py-1.5 text-[12px] font-medium bg-white border border-gray-200 rounded-full text-gray-600 hover:border-teal-300 hover:text-teal-600 transition-colors"
                    >
                      {cat === 'tin-tuc' ? 'Tin tuc' :
                       cat === 'huong-dan' ? 'Huong dan' :
                       cat === 'cong-dong' ? 'Cong dong' :
                       cat === 'am-thuc' ? 'Am thuc' :
                       'Du lich'}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
