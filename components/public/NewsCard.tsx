'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Share2, Heart, Eye, Newspaper } from 'lucide-react';

// Type for serialized article from database
export interface SerializedArticle {
  id: number;
  slug: string;
  titleVn: string;
  titleEn: string | null;
  excerptVn: string | null;
  excerptEn: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  views: number;
  category: {
    id: number;
    nameVn: string;
    nameEn: string | null;
    color: string | null;
  };
}

interface NewsCardProps {
  article: SerializedArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const { language } = useLanguage();

  const title = language === 'vn' ? article.titleVn : (article.titleEn || article.titleVn);
  const excerpt = language === 'vn' ? article.excerptVn : (article.excerptEn || article.excerptVn);
  const categoryName = language === 'vn' ? article.category.nameVn : (article.category.nameEn || article.category.nameVn);

  // Format date
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
    >
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden bg-gray-100">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Newspaper className="h-12 w-12 text-gray-300" />
            </div>
          )}
          <div
            className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded"
            style={{ backgroundColor: article.category.color || '#0D9488' }}
          >
            {categoryName}
          </div>
        </div>
        <div className="p-5 md:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-teal-600 transition-colors">
              {title}
            </h3>
            {excerpt && (
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                {excerpt}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center">
              <span>{formattedDate}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Eye size={12} className="mr-1" />
                {article.views.toLocaleString()} {language === 'vn' ? 'lượt xem' : 'views'}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Share functionality
                  if (navigator.share) {
                    navigator.share({
                      title: title,
                      url: `/tin-tuc/${article.slug}`,
                    });
                  }
                }}
                className="hover:text-teal-600"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Save functionality (could be implemented later)
                }}
                className="hover:text-red-500"
              >
                <Heart size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
