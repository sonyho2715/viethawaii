'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import IslandSelector from '@/components/IslandSelector';
import BusinessCard from '@/components/BusinessCard';
import NewsCard from '@/components/NewsCard';
import BlogCard from '@/components/BlogCard';
import DiscoverCard from '@/components/DiscoverCard';
import { Island } from '@/lib/sampleData';
import { ArrowRight } from 'lucide-react';
import type { Business, NewsArticle, BlogPost, DiscoverItem } from '@/types';

interface HomeClientProps {
  businesses: Business[];
  newsArticles: NewsArticle[];
  blogPosts: BlogPost[];
  discoverItems: DiscoverItem[];
}

export default function HomeClient({
  businesses,
  newsArticles,
  blogPosts,
  discoverItems,
}: HomeClientProps) {
  const [selectedIsland, setSelectedIsland] = useState<Island | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredBusinesses = useMemo(() => {
    let filtered = [...businesses];

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
  }, [searchQuery, selectedIsland, selectedCategory, businesses]);

  const featuredBusinesses = businesses.filter(b => b.featured);
  const featuredNews = newsArticles.filter(n => n.featured);
  const latestBlogs = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🌺</span>
              <span className="text-lg font-semibold text-gray-900">VietHawaii</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/#businesses" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Businesses
              </Link>
              <Link href="/#discover" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Discover
              </Link>
              <Link href="/#news" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                News
              </Link>
              <Link href="/#blog" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link
                href="/submit"
                className="ml-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all"
              >
                List your business
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
              Vietnamese businesses
              <br />
              across Hawaii
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
              Discover authentic Vietnamese experiences, from traditional phở to professional services
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar onSearch={setSearchQuery} />
          </div>

          {/* Island Selector */}
          <div className="max-w-3xl mx-auto">
            <IslandSelector
              selectedIsland={selectedIsland}
              onSelectIsland={setSelectedIsland}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${businesses.length}+`, label: 'Businesses' },
              { value: '6', label: 'Islands' },
              { value: '10+', label: 'Categories' },
              { value: '1000+', label: 'Reviews' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section id="businesses" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">Featured businesses</h2>
              <p className="text-base text-gray-600">Hand-picked selections from across the islands</p>
            </div>
            <Link
              href="/businesses"
              className="hidden md:flex items-center gap-2 text-sm text-gray-900 hover:gap-3 transition-all font-medium"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredBusinesses.slice(0, 6).map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/businesses"
              className="inline-flex items-center gap-2 text-sm text-gray-900 hover:gap-3 transition-all font-medium"
            >
              View all businesses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section id="discover" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">Discover</h2>
              <p className="text-base text-gray-600">Explore Vietnamese culture and traditions in Hawaii</p>
            </div>
            <Link
              href="/discover"
              className="hidden md:flex items-center gap-2 text-sm text-gray-900 hover:gap-3 transition-all font-medium"
            >
              Explore more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {discoverItems.slice(0, 6).map((item) => (
              <DiscoverCard key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-sm text-gray-900 hover:gap-3 transition-all font-medium"
            >
              Explore more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">Latest news</h2>
              <p className="text-base text-gray-600">Stay connected with the community</p>
            </div>
            <Link
              href="/news"
              className="hidden md:flex items-center gap-2 text-sm text-gray-900 hover:gap-3 transition-all font-medium"
            >
              Read more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredNews.slice(0, 3).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm text-gray-900 hover:gap-3 transition-all font-medium"
            >
              Read more news
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">From the blog</h2>
              <p className="text-base text-gray-600">Stories, guides, and insights</p>
            </div>
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-2 text-sm text-gray-900 hover:gap-3 transition-all font-medium"
            >
              View all posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestBlogs.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-900 hover:gap-3 transition-all font-medium"
            >
              View all posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            List your business
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Join our growing directory and connect with the Vietnamese community across Hawaii
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-base font-medium rounded-lg hover:bg-gray-800 transition-all"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/businesses" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Businesses</Link></li>
                <li><Link href="/discover" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Discover</Link></li>
                <li><Link href="/news" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">News</Link></li>
                <li><Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/submit" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Add business</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</Link></li>
                <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Connect</h3>
              <p className="text-sm text-gray-600">
                Connecting the Vietnamese community across the Hawaiian Islands
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌺</span>
              <span className="text-xs text-gray-600">© 2025 VietHawaii. All rights reserved.</span>
            </div>
            <div className="text-xs text-gray-500">
              Made with aloha in Hawaii
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
