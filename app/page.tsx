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
} from '@/lib/sampleData';
import {
  realBusinesses,
  newsArticles,
  blogPosts,
  discoverItems
} from '@/lib/enhancedData';
import { MapPin, ChevronRight, Newspaper, BookOpen, Compass, TrendingUp, Users, Award, ArrowRight } from 'lucide-react';

export default function Home() {
  const [selectedIsland, setSelectedIsland] = useState<Island | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const allBusinesses = [...sampleBusinesses, ...realBusinesses];

  const filteredBusinesses = useMemo(() => {
    let filtered = [...allBusinesses];

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(lowercaseQuery) ||
        business.description.toLowerCase().includes(lowercaseQuery) ||
        business.category.toLowerCase().includes(lowercaseQuery) ||
        business.city.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (selectedIsland !== 'All') {
      filtered = filtered.filter(b => b.island === selectedIsland);
    }

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
      {/* Minimal Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌺</span>
              <span className="text-xl font-semibold text-gray-900">VietHawaii</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/#businesses" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Businesses
              </Link>
              <Link href="/#discover" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Discover
              </Link>
              <Link href="/#news" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                News
              </Link>
              <Link href="/#blog" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link
                href="/submit"
                className="ml-6 px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all"
              >
                Add Business
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Minimal & Spacious */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold text-gray-900 mb-6 tracking-tight leading-none">
              Vietnamese businesses
              <br />
              across Hawaii
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-light">
              Discover authentic experiences, from traditional phở to professional services
            </p>
          </div>

          {/* Search Bar - Minimalist */}
          <div className="max-w-3xl mx-auto mb-12">
            <SearchBar onSearch={setSearchQuery} />
          </div>

          {/* Island Selector - Clean */}
          <div className="max-w-4xl mx-auto">
            <IslandSelector
              selectedIsland={selectedIsland}
              onSelectIsland={setSelectedIsland}
            />
          </div>
        </div>
      </section>

      {/* Stats - Subtle */}
      <section className="py-16 border-t border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: `${allBusinesses.length}+`, label: 'Businesses' },
              { value: '6', label: 'Islands' },
              { value: '10+', label: 'Categories' },
              { value: '1000+', label: 'Reviews' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-semibold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section id="businesses" className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-3">Featured businesses</h2>
              <p className="text-lg text-gray-500">Curated selections from across the islands</p>
            </div>
            <Link
              href="/businesses"
              className="hidden md:flex items-center gap-2 text-gray-900 hover:gap-3 transition-all font-medium"
            >
              View all
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses.slice(0, 6).map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/businesses"
              className="inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all font-medium"
            >
              View all businesses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section id="discover" className="py-24 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-3">Discover</h2>
              <p className="text-lg text-gray-500">Explore Vietnamese culture and traditions</p>
            </div>
            <Link
              href="/discover"
              className="hidden md:flex items-center gap-2 text-gray-900 hover:gap-3 transition-all font-medium"
            >
              Explore more
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoverItems.slice(0, 6).map((item) => (
              <DiscoverCard key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all font-medium"
            >
              Explore more
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-3">Latest news</h2>
              <p className="text-lg text-gray-500">Stay connected with the community</p>
            </div>
            <Link
              href="/news"
              className="hidden md:flex items-center gap-2 text-gray-900 hover:gap-3 transition-all font-medium"
            >
              Read more
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNews.slice(0, 3).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all font-medium"
            >
              Read more news
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-3">From the blog</h2>
              <p className="text-lg text-gray-500">Stories, guides, and insights</p>
            </div>
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-2 text-gray-900 hover:gap-3 transition-all font-medium"
            >
              View all posts
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestBlogs.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all font-medium"
            >
              View all posts
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
            List your business
          </h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Join our growing directory and connect with the Vietnamese community across Hawaii
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-lg font-medium rounded-full hover:bg-gray-800 transition-all"
          >
            Get started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>
              <ul className="space-y-3">
                <li><Link href="/businesses" className="text-gray-600 hover:text-gray-900 transition-colors">Businesses</Link></li>
                <li><Link href="/discover" className="text-gray-600 hover:text-gray-900 transition-colors">Discover</Link></li>
                <li><Link href="/news" className="text-gray-600 hover:text-gray-900 transition-colors">News</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><Link href="/submit" className="text-gray-600 hover:text-gray-900 transition-colors">Add Business</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <p className="text-gray-600 text-sm">
                Connecting the Vietnamese community across the Hawaiian Islands
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌺</span>
              <span className="text-sm text-gray-600">© 2025 VietHawaii. All rights reserved.</span>
            </div>
            <div className="text-sm text-gray-500">
              Made with aloha in Hawaii
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
