import Link from 'next/link';
import { NewsArticle } from '@/lib/enhancedData';
import { Calendar, User } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  const categoryColors = {
    Community: 'bg-blue-100 text-blue-700',
    Event: 'bg-purple-100 text-purple-700',
    Business: 'bg-green-100 text-green-700',
    Culture: 'bg-pink-100 text-pink-700',
    Food: 'bg-orange-100 text-orange-700',
  };

  const getImageUrl = () => {
    switch (article.category) {
      case 'Community':
        return 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop';
      case 'Event':
        return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop';
      case 'Business':
        return 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop';
      case 'Culture':
        return 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop';
      case 'Food':
        return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop';
    }
  };

  if (featured) {
    return (
      <Link href={`/news/${article.slug}`} className="block">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
          <div className="h-64 relative overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundImage: `url('${getImageUrl()}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="text-6xl drop-shadow-lg">📰</span>
            </div>
          </div>
          <div className="p-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${categoryColors[article.category]}`}>
              {article.category}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {article.title}
            </h2>
            {article.titleVi && (
              <p className="text-sm text-gray-600 mb-3 italic">{article.titleVi}</p>
            )}
            <p className="text-gray-700 mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${article.slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
        <div className="h-48 relative overflow-hidden group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundImage: `url('${getImageUrl()}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="text-4xl drop-shadow-lg">📰</span>
          </div>
        </div>
        <div className="p-4">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${categoryColors[article.category]}`}>
            {article.category}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}