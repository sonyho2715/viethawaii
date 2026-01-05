import Link from 'next/link';
import { Newspaper, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin Tức | VietHawaii',
  description: 'Tin tức và hướng dẫn hữu ích cho cộng đồng Việt Nam tại Hawaii.',
};

// Placeholder articles - will be replaced with database content
const articles = [
  {
    id: '1',
    slug: 'huong-dan-tim-nha-thue-hawaii',
    title: 'Hướng dẫn tìm nhà thuê tại Hawaii cho người Việt',
    titleEn: 'Guide to Finding Rentals in Hawaii for Vietnamese',
    excerpt: 'Những điều cần biết khi tìm nhà thuê tại Hawaii: khu vực, giá cả, và mẹo hữu ích.',
    category: 'Hướng dẫn',
    date: '2025-01-01',
    image: '/images/placeholder-news.jpg',
  },
  {
    id: '2',
    slug: 'viec-lam-pho-bien-nguoi-viet',
    title: 'Những công việc phổ biến cho người Việt tại Hawaii',
    titleEn: 'Popular Jobs for Vietnamese in Hawaii',
    excerpt: 'Tổng hợp các ngành nghề có nhiều cơ hội việc làm cho cộng đồng người Việt.',
    category: 'Việc làm',
    date: '2025-01-01',
    image: '/images/placeholder-news.jpg',
  },
  {
    id: '3',
    slug: 'quan-an-viet-o-honolulu',
    title: 'Những quán ăn Việt ngon nhất ở Honolulu',
    titleEn: 'Best Vietnamese Restaurants in Honolulu',
    excerpt: 'Khám phá các quán phở, bún, cơm tấm được yêu thích nhất tại Honolulu.',
    category: 'Ẩm thực',
    date: '2025-01-01',
    image: '/images/placeholder-news.jpg',
  },
];

export default function NewsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
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

      <div className="space-y-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">{article.date}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                <Link href={`/tin-tuc/${article.slug}`}>
                  {article.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-500 mb-3">{article.titleEn}</p>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
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

      {/* Coming Soon Note */}
      <div className="mt-10 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100 text-center">
        <h3 className="font-semibold text-gray-900 mb-2">
          Thêm nội dung sắp ra mắt!
        </h3>
        <p className="text-gray-600 text-sm">
          Chúng tôi đang xây dựng thêm nhiều bài viết hữu ích cho cộng đồng.
          Hãy quay lại thường xuyên để cập nhật tin mới nhất.
        </p>
      </div>
    </div>
  );
}
