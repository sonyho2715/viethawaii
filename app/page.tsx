'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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
  getFeaturedBusinesses,
  searchBusinesses,
} from '@/lib/sampleData';
import {
  realBusinesses,
  newsArticles,
  blogPosts,
  discoverItems
} from '@/lib/enhancedData';
import { MapPin, ChevronRight, Newspaper, BookOpen, Compass } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl">🌺</span>
              <h1 className="text-2xl font-bold text-gray-900">
                VietHawaii
              </h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/#businesses" className="text-gray-600 hover:text-gray-900 transition-colors">
                Businesses
              </Link>
              <Link href="/#news" className="text-gray-600 hover:text-gray-900 transition-colors">
                News
              </Link>
              <Link href="/#blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link href="/#discover" className="text-gray-600 hover:text-gray-900 transition-colors">
                Discover
              </Link>
            </nav>
            <p className="text-sm text-gray-600 hidden lg:block">
              Your guide to Vietnamese businesses in Hawaii
            </p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Vietnamese Businesses in Hawaii
            </h2>
            <p className="text-xl md:text-2xl opacity-90">
              From authentic phở to professional services, find it all here
            </p>
            <p className="text-lg opacity-75 mt-2">
              Khám phá cộng đồng Việt Nam tại Hawaii
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
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
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">{allBusinesses.length}+</div>
              <div className="text-sm text-gray-600 mt-1">Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">6</div>
              <div className="text-sm text-gray-600 mt-1">Islands</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">10+</div>
              <div className="text-sm text-gray-600 mt-1">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">1000+</div>
              <div className="text-sm text-gray-600 mt-1">Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section id="discover" className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Compass className="w-8 h-8 text-primary-600" />
              <h2 className="text-3xl font-bold text-gray-900">Discover</h2>
            </div>
            <Link href="/discover" className="text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {discoverItems.map((item) => (
              <DiscoverCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="businesses" className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedCategory === category.name
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results or Featured */}
        {searchQuery || selectedIsland !== 'All' || selectedCategory !== 'All' ? (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Businesses'}
              </h3>
              <p className="text-gray-600">
                {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'} found
              </p>
            </div>

            {filteredBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No businesses found</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Featured Businesses */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">Featured Businesses</h3>
                <Link href="/businesses" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBusinesses.slice(0, 6).map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            </section>

            {/* News Section */}
            <section id="news" className="mb-12 bg-gray-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Newspaper className="w-8 h-8 text-primary-600" />
                    <h3 className="text-3xl font-bold">Community News</h3>
                  </div>
                  <Link href="/news" className="text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredNews.map((article, idx) => (
                    <NewsCard key={article.id} article={article} featured={idx === 0} />
                  ))}
                </div>
              </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-primary-600" />
                  <h3 className="text-3xl font-bold">Latest Articles</h3>
                </div>
                <Link href="/blog" className="text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestBlogs.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* All Businesses */}
            <section>
              <h3 className="text-2xl font-semibold mb-6">All Businesses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allBusinesses.slice(0, 9).map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/businesses"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  View All {allBusinesses.length} Businesses
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">VietHawaii</h4>
              <p className="text-gray-400">
                Connecting the Vietnamese community across the Hawaiian Islands
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Explore</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/businesses" className="hover:text-white">Businesses</Link></li>
                <li><Link href="/news" className="hover:text-white">News</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/discover" className="hover:text-white">Discover</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Categories</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/category/restaurants" className="hover:text-white">Restaurants</Link></li>
                <li><Link href="/category/markets" className="hover:text-white">Markets</Link></li>
                <li><Link href="/category/services" className="hover:text-white">Services</Link></li>
                <li><Link href="/category/healthcare" className="hover:text-white">Healthcare</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Community</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/submit" className="hover:text-white">Add Business</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 VietHawaii. A community project connecting Vietnamese businesses in Hawaii.</p>
            <p className="mt-2 text-sm">Made with ❤️ for the Vietnamese community</p>
          </div>
        </div>
      </footer>
    </div>
  );
}