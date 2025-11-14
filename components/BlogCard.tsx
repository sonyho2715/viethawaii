import Link from 'next/link';
import { BlogPost } from '@/lib/enhancedData';
import { Clock, User, Calendar } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const categoryColors = {
    Guide: 'bg-indigo-100 text-indigo-700',
    Culture: 'bg-pink-100 text-pink-700',
    Food: 'bg-orange-100 text-orange-700',
    Lifestyle: 'bg-teal-100 text-teal-700',
    History: 'bg-amber-100 text-amber-700',
  };

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <span className="text-6xl opacity-40">
            {post.category === 'Food' && '🍜'}
            {post.category === 'Culture' && '🎭'}
            {post.category === 'Guide' && '📖'}
            {post.category === 'Lifestyle' && '✨'}
            {post.category === 'History' && '📜'}
          </span>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category]}`}>
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{post.readTime} min read</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h3>

          {post.titleVi && (
            <p className="text-sm text-gray-600 mb-2 italic line-clamp-1">
              {post.titleVi}
            </p>
          )}

          <p className="text-gray-700 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 pt-3 border-t">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}