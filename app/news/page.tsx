'use client';

import { useState } from 'react';
import Link from 'next/link';
import { newsArticles } from '@/lib/enhancedData';
import { Search, Calendar, User, Tag, ChevronLeft } from 'lucide-react';

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredNews = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Community', 'Event', 'Business', 'Culture', 'Food'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
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

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=600&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/80 via-orange-500/80 to-amber-500/80" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-20 text-7xl opacity-20 animate-float">📰</div>
          <div className="absolute bottom-10 right-40 text-6xl opacity-20 animate-float animation-delay-2000">🌺</div>
          <div className="absolute top-1/2 right-20 text-5xl opacity-20 animate-float animation-delay-3000">🏝️</div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/30 rounded-2xl backdrop-blur-md shadow-xl animate-float">
                <span className="text-6xl">📰</span>
              </div>
            </div>
            <h1 className="text-6xl font-black mb-4 drop-shadow-lg">Community News</h1>
            <p className="text-2xl text-orange-100 max-w-2xl mx-auto drop-shadow animate-slide-in-left">
              Stay updated with the latest news, events, and stories from Hawaii's Vietnamese community
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 font-semibold">
            Showing {filteredNews.length} of {newsArticles.length} articles
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                {article.image && (
                  <div className="h-56 overflow-hidden relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundImage: `url('${article.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {article.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Featured
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                      {article.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-rose-600 transition-colors">
                    {article.title}
                  </h3>

                  {/* Vietnamese Title */}
                  {article.titleVi && (
                    <p className="text-sm text-gray-600 italic mb-3 line-clamp-1">
                      {article.titleVi}
                    </p>
                  )}

                  {/* Excerpt */}
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-rose-600 font-bold text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                      Read Full Story
                      <ChevronLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-5xl mb-4 block">📬</span>
            <h2 className="text-3xl font-black mb-4">Stay in the Loop</h2>
            <p className="text-orange-100 mb-6">
              Get the latest news and updates from Hawaii's Vietnamese community delivered to your inbox
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
      </div>
    </div>
  );
}
