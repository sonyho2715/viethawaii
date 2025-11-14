'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import IslandSelector from '@/components/IslandSelector';
import BusinessCard from '@/components/BusinessCard';
import NewsCard from '@/components/NewsCard';
import BlogCard from '@/components/BlogCard';
import DiscoverCard from '@/components/DiscoverCard';
import {
  Island,
  categories,
  sampleBusinesses,
} from '@/lib/sampleData';
import {
  realBusinesses,
  newsArticles,
  blogPosts,
  discoverItems
} from '@/lib/enhancedData';
import { MapPin, ChevronRight, Newspaper, BookOpen, Compass, TrendingUp, Users, Award } from 'lucide-react';

export default function Home() {
  const [selectedIsland, setSelectedIsland] = useState<Island | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Combine sample and real businesses
  const allBusinesses = [...sampleBusinesses, ...realBusinesses];

  const filteredBusinesses = useMemo(() => {
    let filtered = [...allBusinesses];

    // Filter by search query
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(lowercaseQuery) ||
        business.description.toLowerCase().includes(lowercaseQuery) ||
        business.category.toLowerCase().includes(lowercaseQuery) ||
        business.city.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Filter by island
    if (selectedIsland !== 'All') {
      filtered = filtered.filter(b => b.island === selectedIsland);
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }

    return filtered;
  }, [searchQuery, selectedIsland, selectedCategory, allBusinesses]);

  const featuredBusinesses = allBusinesses.filter(b => b.featured);
  const featuredNews = newsArticles.filter(n => n.featured);
  const latestBlogs = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Vibrant Header */}
      <header className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-white rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🌺</span>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white drop-shadow-lg">
                  VietHawaii
                </h1>
                <p className="text-xs text-yellow-100 font-medium">Your guide to Vietnamese businesses in Hawaii</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-2">
              <Link href="/#businesses" className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-semibold backdrop-blur-sm">
                Businesses
              </Link>
              <Link href="/#news" className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-semibold backdrop-blur-sm">
                News
              </Link>
              <Link href="/#blog" className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-semibold backdrop-blur-sm">
                Blog
              </Link>
              <Link href="/#discover" className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-semibold backdrop-blur-sm">
                Discover
              </Link>
              <Link
                href="/submit"
                className="ml-4 px-6 py-2.5 bg-white text-red-600 rounded-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 font-bold"
              >
                + Add Business
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Vibrant Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-full mb-6 shadow-lg">
                <span className="text-xl">🌴</span>
                <span className="font-bold text-sm">Aloha! Welcome to VietHawaii</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Discover
                <br />
                <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  Vietnamese
                </span>
                <br />
                Businesses
              </h2>
              <p className="text-2xl text-gray-700 mb-3 font-medium">
                From authentic phở to professional services 🍜
              </p>
              <p className="text-lg text-gray-600 italic mb-8">
                Khám phá cộng đồng Việt Nam tại Hawaii
              </p>

              {/* Search Bar */}
              <div className="mb-6">
                <SearchBar onSearch={setSearchQuery} />
              </div>

              {/* Island Selector */}
              <IslandSelector
                selectedIsland={selectedIsland}
                onSelectIsland={setSelectedIsland}
              />
            </div>

            {/* Right Image Collage */}
            <div className="relative hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl h-48 flex items-center justify-center text-white text-7xl shadow-xl transform hover:scale-105 transition-transform">
                    🍜
                  </div>
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl h-64 flex items-center justify-center text-white text-7xl shadow-xl transform hover:scale-105 transition-transform">
                    ☕
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-gradient-to-br from-green-400 to-teal-600 rounded-2xl h-64 flex items-center justify-center text-white text-7xl shadow-xl transform hover:scale-105 transition-transform">
                    🥖
                  </div>
                  <div className="bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl h-48 flex items-center justify-center text-white text-7xl shadow-xl transform hover:scale-105 transition-transform">
                    🌸
                  </div>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform">
                <div className="text-center">
                  <div className="text-4xl font-black text-red-600">{allBusinesses.length}+</div>
                  <div className="text-sm font-bold text-gray-700">Businesses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Vibrant Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🏪', value: `${allBusinesses.length}+`, label: 'Businesses', gradient: 'from-red-500 via-orange-500 to-yellow-500' },
              { icon: '🏝️', value: '6', label: 'Islands', gradient: 'from-blue-500 via-cyan-500 to-teal-500' },
              { icon: '🎯', value: '10+', label: 'Categories', gradient: 'from-purple-500 via-pink-500 to-red-500' },
              { icon: '⭐', value: '1000+', label: 'Reviews', gradient: 'from-yellow-500 via-orange-500 to-red-500' }
            ].map((stat, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${stat.gradient} rounded-3xl shadow-2xl p-8 transform hover:scale-110 hover:rotate-2 transition-all duration-300 cursor-pointer`}>
                <div className="text-center text-white">
                  <div className="text-5xl mb-3">{stat.icon}</div>
                  <div className="text-4xl font-black mb-2 drop-shadow-lg">{stat.value}</div>
                  <div className="text-sm font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Section with Vibrant Cards */}
      <section id="discover" className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full mb-6 shadow-lg">
              <Compass className="w-6 h-6" />
              <span className="text-base font-black uppercase tracking-wide">Discover</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                Vietnamese Culture
              </span>
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
              Immerse yourself in the rich traditions and flavors 🎭
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {discoverItems.map((item) => (
              <DiscoverCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories with Vibrant Buttons */}
      <section id="businesses" className="py-16 bg-white border-t-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-black text-gray-900 mb-8 text-center">
            Browse by <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">Category</span>
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 text-lg ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-red-600 to-yellow-600 text-white shadow-2xl scale-110'
                  : 'bg-gray-100 hover:bg-gradient-to-r hover:from-red-100 hover:to-yellow-100 text-gray-700 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              ⭐ All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 text-lg ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-red-600 to-yellow-600 text-white shadow-2xl scale-110'
                    : 'bg-gray-100 hover:bg-gradient-to-r hover:from-red-100 hover:to-yellow-100 text-gray-700 shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {searchQuery || selectedIsland !== 'All' || selectedCategory !== 'All' ? (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {searchQuery ? `Search Results` : 'Businesses'}
                </h3>
                {searchQuery && (
                  <p className="text-gray-600 mt-1">Showing results for "{searchQuery}"</p>
                )}
              </div>
              <div className="px-4 py-2 bg-primary-50 rounded-lg">
                <span className="text-primary-700 font-semibold">
                  {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'}
                </span>
              </div>
            </div>

            {filteredBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-xl font-medium">No businesses found</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Featured Businesses */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Featured Businesses</h3>
                  <p className="text-gray-600 mt-1">Handpicked top Vietnamese establishments</p>
                </div>
                <Link href="/businesses" className="text-primary-600 hover:text-primary-700 flex items-center gap-1 font-semibold group">
                  View All <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBusinesses.slice(0, 6).map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            </section>

            {/* News Section */}
            <section id="news" className="mb-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>

              <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                    <Newspaper className="w-6 h-6 text-white" />
                    <span className="text-base font-black text-white uppercase tracking-wide">Latest Updates</span>
                  </div>
                  <h3 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">Community News 📰</h3>
                  <p className="text-2xl text-white/90 font-medium">Stay connected with the Vietnamese community</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredNews.map((article, idx) => (
                    <NewsCard key={article.id} article={article} featured={idx === 0} />
                  ))}
                </div>
              </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="mb-16 bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20 rounded-3xl">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full mb-6 shadow-lg">
                    <BookOpen className="w-6 h-6" />
                    <span className="text-base font-black uppercase tracking-wide">Insights & Stories</span>
                  </div>
                  <h3 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                    Latest <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Articles</span> 📚
                  </h3>
                  <p className="text-2xl text-gray-700 font-medium">Explore Vietnamese culture, food, and traditions</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestBlogs.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </section>

            {/* All Businesses */}
            <section className="bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-3xl">
              <h3 className="text-4xl font-black text-gray-900 mb-8 text-center">
                All <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">Businesses</span> 🏪
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {allBusinesses.slice(0, 9).map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/businesses"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-600 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-black text-xl transform hover:scale-110 hover:rotate-1"
                >
                  View All {allBusinesses.length} Businesses
                  <ChevronRight className="w-6 h-6" />
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Vibrant Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white py-20 mt-20 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-white rounded-full p-2">
                  <span className="text-3xl">🌺</span>
                </div>
                <h4 className="text-3xl font-black">VietHawaii</h4>
              </div>
              <p className="text-gray-300 mb-4 text-lg">
                Connecting the Vietnamese community across the Hawaiian Islands
              </p>
              <p className="text-base text-yellow-300 italic font-medium">
                Cộng đồng Việt Nam tại Hawaii
              </p>
            </div>
            <div>
              <h5 className="font-black text-xl mb-6 text-yellow-300">Explore</h5>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/businesses" className="hover:text-yellow-300 transition-colors text-lg font-medium">Businesses</Link></li>
                <li><Link href="/news" className="hover:text-yellow-300 transition-colors text-lg font-medium">News</Link></li>
                <li><Link href="/blog" className="hover:text-yellow-300 transition-colors text-lg font-medium">Blog</Link></li>
                <li><Link href="/discover" className="hover:text-yellow-300 transition-colors text-lg font-medium">Discover</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-xl mb-6 text-yellow-300">Categories</h5>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/category/restaurants" className="hover:text-yellow-300 transition-colors text-lg font-medium">Restaurants</Link></li>
                <li><Link href="/category/markets" className="hover:text-yellow-300 transition-colors text-lg font-medium">Markets</Link></li>
                <li><Link href="/category/services" className="hover:text-yellow-300 transition-colors text-lg font-medium">Services</Link></li>
                <li><Link href="/category/healthcare" className="hover:text-yellow-300 transition-colors text-lg font-medium">Healthcare</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-xl mb-6 text-yellow-300">Community</h5>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/about" className="hover:text-yellow-300 transition-colors text-lg font-medium">About Us</Link></li>
                <li><Link href="/submit" className="hover:text-yellow-300 transition-colors text-lg font-medium">Add Business</Link></li>
                <li><Link href="/contact" className="hover:text-yellow-300 transition-colors text-lg font-medium">Contact</Link></li>
                <li><Link href="/support" className="hover:text-yellow-300 transition-colors text-lg font-medium">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-base font-medium">
              © 2025 VietHawaii. A community project connecting Vietnamese businesses in Hawaii.
            </p>
            <p className="text-yellow-300 text-base mt-2 md:mt-0 font-semibold">
              Made with ❤️ for the Vietnamese community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}