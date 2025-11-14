'use client';

import { useState } from 'react';
import Link from 'next/link';
import { blogPosts } from '@/lib/enhancedData';
import { Search, Calendar, User, BookOpen, Clock, ChevronLeft, Tag } from 'lucide-react';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Guide', 'Culture', 'Food', 'Lifestyle', 'History'];

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
      <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=1920&h=600&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/90 via-pink-500/85 to-rose-500/90" />
        </div>

        {/* Animated Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 text-8xl opacity-20 animate-float">📚</div>
          <div className="absolute bottom-20 left-20 text-6xl opacity-20 animate-float animation-delay-2000">✨</div>
          <div className="absolute top-1/3 left-1/3 text-7xl opacity-15 animate-float animation-delay-3000">🌸</div>
          <div className="absolute bottom-1/4 right-1/4 text-6xl opacity-20 animate-float animation-delay-4000">🍜</div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className="flex justify-center mb-6">
              <div className="p-5 bg-white/25 rounded-3xl backdrop-blur-md shadow-2xl animate-float">
                <BookOpen className="w-20 h-20" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-6 drop-shadow-lg">VietHawaii Blog</h1>
            <p className="text-2xl text-pink-100 max-w-3xl mx-auto drop-shadow-md animate-slide-in-left">
              Guides, stories, and insights about Vietnamese culture, food, and life in Hawaii
            </p>
            <div className="mt-8 flex justify-center gap-4 animate-fade-in-up animation-delay-2000">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                📖 100+ Articles
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                🍜 Food Guides
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                🌺 Culture Stories
              </span>
            </div>
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
                placeholder="Search blog posts..."
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
            Showing {filteredPosts.length} of {blogPosts.length} posts
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-8">
            {filteredPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  index === 0 ? 'lg:grid lg:grid-cols-2 lg:gap-0' : 'flex flex-col md:flex-row'
                }`}
              >
                {/* Image */}
                {post.image && (
                  <div className={`overflow-hidden relative ${
                    index === 0 ? 'h-96 lg:h-auto' : 'h-64 md:w-80 md:flex-shrink-0'
                  }`}>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundImage: `url('${post.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-white" />
                        <span className="text-xs font-bold text-white uppercase tracking-wide">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className={`p-6 ${index === 0 ? 'lg:p-12' : 'flex-1'}`}>
                  {/* Title */}
                  <h2 className={`font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-rose-600 transition-colors ${
                    index === 0 ? 'text-3xl' : 'text-2xl'
                  }`}>
                    {post.title}
                  </h2>

                  {/* Vietnamese Title */}
                  {post.titleVi && (
                    <p className="text-sm text-gray-600 italic mb-3 line-clamp-1">
                      {post.titleVi}
                    </p>
                  )}

                  {/* Excerpt */}
                  <p className={`text-gray-700 mb-4 ${index === 0 ? 'text-lg line-clamp-4' : 'line-clamp-3'}`}>
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="font-semibold">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-rose-600 font-bold group-hover:gap-2 flex items-center gap-1 transition-all">
                      Continue Reading
                      <ChevronLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-black mb-4">Never Miss a Post</h2>
            <p className="text-pink-100 mb-6">
              Subscribe to get the latest blog posts, guides, and cultural insights delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-pink-50 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
