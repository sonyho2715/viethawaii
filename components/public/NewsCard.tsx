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
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer ring-1 ring-black/[0.02]"
    >
      <div className="md:flex">
        <div className="md:w-1/3 h-52 md:h-auto relative overflow-hidden bg-gray-50">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Newspaper className="h-12 w-12 text-gray-200" />
            </div>
          )}
          <div
            className="absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg backdrop-blur-sm bg-opacity-90"
            style={{ backgroundColor: article.category.color || '#0D9488' }}
          >
            {categoryName}
          </div>
        </div>
        <div className="p-6 md:w-2/3 flex flex-col justify-between bg-white">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
              {title}
            </h3>
            {excerpt && (
              <p className="text-gray-500 text-sm line-clamp-2 mb-5 leading-relaxed opacity-80">
                {excerpt}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium uppercase tracking-wider">
              <span>{formatRelativeDate(article.publishedAt)}</span>
              <span className="flex items-center gap-1.5">
                <Eye size={13} className="text-gray-300" />
                {article.views.toLocaleString()}
              </span>
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
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
                className="p-2 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"
                title="Share"
              >
                <Share2 size={15} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Save"
              >
                <Bookmark size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
