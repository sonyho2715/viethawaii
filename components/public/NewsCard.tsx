'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Share2, Heart, Eye } from 'lucide-react';

interface NewsItem {
  id: number;
  slug: string;
  category: string;
  title: string;
  titleVn?: string;
  excerpt: string;
  image: string;
  date: string;
  views: number;
}

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const { language } = useLanguage();

  return (
    <Link
      href={`/tin-tuc/${item.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
    >
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
            {item.category}
          </div>
        </div>
        <div className="p-5 md:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-teal-600 transition-colors">
              {language === 'vn' && item.titleVn ? item.titleVn : item.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
              {item.excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center">
              <span>{item.date}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Eye size={12} className="mr-1" />
                {item.views.toLocaleString()} {language === 'vn' ? 'lượt xem' : 'views'}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Share functionality
                }}
                className="hover:text-teal-600"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Save functionality
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
