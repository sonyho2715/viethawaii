'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Share2, Heart, Eye, Newspaper, Bookmark } from 'lucide-react';

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

  // Relative date formatting
  const formatRelativeDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return language === 'vn' ? 'Vừa xong' : 'Just now';
    if (diffMins < 60) return `${diffMins} ${language === 'vn' ? 'phút trước' : 'min ago'}`;
    if (diffHours < 24) return `${diffHours} ${language === 'vn' ? 'giờ trước' : 'hours ago'}`;
    if (diffDays < 7) return `${diffDays} ${language === 'vn' ? 'ngày trước' : 'days ago'}`;
    return date.toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
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
            className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm"
            style={{ backgroundColor: article.category.color || '#0D9488' }}
          >
            {categoryName}
          </div>
        </div>
        <div className="p-5 md:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
              {title}
            </h3>
            {excerpt && (
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                {excerpt}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <span>{formatRelativeDate(article.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {article.views.toLocaleString()}
              </span>
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (navigator.share) {
                    navigator.share({
                      title: title,
                      url: `/tin-tuc/${article.slug}`,
                    });
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-teal-600 transition-colors"
              >
                <Share2 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-red-500 transition-colors"
              >
                <Bookmark size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
