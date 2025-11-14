import Link from 'next/link';
import { notFound } from 'next/navigation';
import { newsArticles } from '@/lib/enhancedData';
import { Calendar, User, Tag, ChevronLeft, Share2, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}

function getArticleBySlug(slug: string) {
  return newsArticles.find(article => article.slug === slug);
}

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = newsArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/news" className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold">Back to News</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌺</span>
              <h1 className="text-3xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                VietHawaii
              </h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {article.image && (
        <div className="h-96 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${article.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          {article.featured && (
            <div className="absolute top-8 right-8 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              Featured Story
            </div>
          )}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 -mt-32 relative z-10">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-rose-500" />
            <span className="text-sm font-bold text-rose-600 uppercase tracking-wide">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {article.title}
          </h1>

          {/* Vietnamese Title */}
          {article.titleVi && (
            <p className="text-xl text-gray-600 italic mb-6">
              {article.titleVi}
            </p>
          )}

          {/* Excerpt */}
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-gray-600 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-semibold">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(article.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg font-semibold hover:bg-rose-200 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-semibold hover:bg-orange-200 transition-colors">
              <Bookmark className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h2: ({node, ...props}) => <h2 className="text-3xl font-black text-gray-900 mt-8 mb-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700" {...props} />,
                li: ({node, ...props}) => <li className="ml-4" {...props} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-2xl shadow-2xl p-8 text-white mb-8">
          <div className="text-center">
            <span className="text-5xl mb-4 block">📬</span>
            <h3 className="text-2xl font-black mb-3">Stay Updated</h3>
            <p className="text-orange-100 mb-6">
              Get the latest news from Hawaii's Vietnamese community
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-rose-600 rounded-lg font-bold hover:bg-orange-50 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6">Related News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/news/${related.slug}`}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {related.image && (
                    <div className="h-40 overflow-hidden relative">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundImage: `url('${related.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{related.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
