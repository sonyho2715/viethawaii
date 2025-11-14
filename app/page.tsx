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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Modern Header with Glass Effect */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🌺</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  VietHawaii
                </h1>
                <p className="text-xs text-gray-500">Cộng đồng Việt Nam</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/#businesses" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Businesses
              </Link>
              <Link href="/#news" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                News
              </Link>
              <Link href="/#blog" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Blog
              </Link>
              <Link href="/#discover" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Discover
              </Link>
              <Link
                href="/submit"
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
              >
                Add Business
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/95 via-secondary-600/90 to-primary-700/95 z-10"></div>
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070')] bg-cover bg-center opacity-30"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center mb-10">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                🌴 Aloha! Welcome to VietHawaii
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Vietnamese
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Businesses in Hawaii
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-2 max-w-3xl mx-auto">
              From authentic phở to professional services, find it all here
            </p>
            <p className="text-lg text-white/75 italic">
              Khám phá cộng đồng Việt Nam tại Hawaii
            </p>
          </div>

          {/* Search Bar with Modern Design */}
          <div className="max-w-3xl mx-auto mb-8">
            <SearchBar onSearch={setSearchQuery} />
          </div>

          {/* Island Selector */}
          <div className="flex justify-center">
            <IslandSelector
              selectedIsland={selectedIsland}
              onSelectIsland={setSelectedIsland}
            />
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section with Cards */}
      <section className="relative -mt-16 z-30 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: <Users className="w-8 h-8" />, value: `${allBusinesses.length}+`, label: 'Businesses', color: 'from-blue-500 to-blue-600' },
              { icon: <MapPin className="w-8 h-8" />, value: '6', label: 'Islands', color: 'from-green-500 to-green-600' },
              { icon: <Award className="w-8 h-8" />, value: '10+', label: 'Categories', color: 'from-purple-500 to-purple-600' },
              { icon: <TrendingUp className="w-8 h-8" />, value: '1000+', label: 'Reviews', color: 'from-orange-500 to-orange-600' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Section with Images */}
      <section id="discover" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
              <Compass className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Explore</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Vietnamese Culture
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Immerse yourself in the rich traditions and flavors of Vietnam in Hawaii
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {discoverItems.map((item) => (
              <DiscoverCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories with Modern Cards */}
      <section id="businesses" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg scale-105'
                  : 'bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg scale-105'
                    : 'bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg'
                }`}
              >
                <span>{category.icon}</span>
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
            <section id="news" className="mb-16 bg-gradient-to-br from-blue-50 to-purple-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-3xl">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-4">
                    <Newspaper className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Latest Updates</span>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">Community News</h3>
                  <p className="text-xl text-gray-600">Stay connected with the Vietnamese community in Hawaii</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredNews.map((article, idx) => (
                    <NewsCard key={article.id} article={article} featured={idx === 0} />
                  ))}
                </div>
              </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-4">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Insights</span>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-4">Latest Articles</h3>
                <p className="text-xl text-gray-600">Explore Vietnamese culture, food, and traditions</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestBlogs.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* All Businesses */}
            <section>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">All Businesses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allBusinesses.slice(0, 9).map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link
                  href="/businesses"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                >
                  View All {allBusinesses.length} Businesses
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-4xl">🌺</span>
                <h4 className="text-2xl font-bold">VietHawaii</h4>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting the Vietnamese community across the Hawaiian Islands
              </p>
              <p className="text-sm text-gray-500 italic">
                Cộng đồng Việt Nam tại Hawaii
              </p>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Explore</h5>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/businesses" className="hover:text-white transition-colors">Businesses</Link></li>
                <li><Link href="/news" className="hover:text-white transition-colors">News</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/discover" className="hover:text-white transition-colors">Discover</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Categories</h5>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/category/restaurants" className="hover:text-white transition-colors">Restaurants</Link></li>
                <li><Link href="/category/markets" className="hover:text-white transition-colors">Markets</Link></li>
                <li><Link href="/category/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/category/healthcare" className="hover:text-white transition-colors">Healthcare</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Community</h5>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/submit" className="hover:text-white transition-colors">Add Business</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 VietHawaii. A community project connecting Vietnamese businesses in Hawaii.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Made with ❤️ for the Vietnamese community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}