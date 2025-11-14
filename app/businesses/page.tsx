'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, ChevronLeft, Grid, List, Star, DollarSign } from 'lucide-react';
import BusinessCard from '@/components/BusinessCard';
import { sampleBusinesses } from '@/lib/sampleData';
import { realBusinesses } from '@/lib/enhancedData';

export default function BusinessesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIsland, setSelectedIsland] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const allBusinesses = [...sampleBusinesses, ...realBusinesses];

  const categories = ['All', 'Restaurant', 'Retail', 'Service', 'Healthcare', 'Education', 'Real Estate', 'Entertainment'];
  const islands = ['All', 'Oahu', 'Maui', 'Hawaii Island', 'Kauai', 'Molokai', 'Lanai'];
  const priceRanges = ['All', '$', '$$', '$$$', '$$$$'];

  const filteredBusinesses = useMemo(() => {
    let filtered = [...allBusinesses];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.city.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }

    if (selectedIsland !== 'All') {
      filtered = filtered.filter(b => b.island === selectedIsland);
    }

    if (priceFilter !== 'All') {
      filtered = filtered.filter(b => b.priceRange === priceFilter);
    }

    // Sort by rating and featured status
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedIsland, priceFilter, allBusinesses]);

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
      <div className="relative bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=600&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/85 via-orange-500/85 to-amber-500/85" />
        </div>

        {/* Floating Business Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-7xl opacity-20 animate-float">🏪</div>
          <div className="absolute bottom-10 right-20 text-6xl opacity-20 animate-float animation-delay-2000">🍜</div>
          <div className="absolute top-1/3 right-1/3 text-5xl opacity-20 animate-float animation-delay-3000">☕</div>
          <div className="absolute bottom-1/3 left-1/4 text-6xl opacity-20 animate-float animation-delay-4000">🥖</div>
          <div className="absolute top-20 right-40 text-5xl opacity-20 animate-float animation-delay-2000">💇</div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className="flex justify-center mb-6">
              <div className="p-5 bg-white/25 rounded-3xl backdrop-blur-md shadow-2xl animate-float">
                <span className="text-7xl">🏪</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-6 drop-shadow-lg">Vietnamese Businesses</h1>
            <p className="text-2xl text-orange-100 max-w-3xl mx-auto mb-4 drop-shadow animate-slide-in-left">
              Discover {allBusinesses.length}+ authentic Vietnamese businesses across the Hawaiian Islands
            </p>

            {/* Stats Bar */}
            <div className="flex justify-center gap-6 mb-8 animate-fade-in-up animation-delay-2000">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="text-3xl font-black">{allBusinesses.filter(b => b.category === 'Restaurant').length}+</span>
                <p className="text-sm">Restaurants</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="text-3xl font-black">6</span>
                <p className="text-sm">Islands</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="text-3xl font-black">1000+</span>
                <p className="text-sm">Reviews</p>
              </div>
            </div>

            <div className="flex justify-center gap-4 animate-fade-in-up animation-delay-3000">
              <Link
                href="/submit"
                className="px-8 py-4 bg-white text-rose-600 rounded-xl font-bold text-lg hover:bg-orange-50 hover:scale-105 transition-all shadow-xl"
              >
                + Add Your Business
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search businesses..."
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
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Island Filter */}
            <div>
              <select
                value={selectedIsland}
                onChange={(e) => setSelectedIsland(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
              >
                {islands.map(island => (
                  <option key={island} value={island}>{island}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              {priceRanges.map(range => (
                <button
                  key={range}
                  onClick={() => setPriceFilter(range)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    priceFilter === range
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range === 'All' ? 'Any Price' : range}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-rose-100 text-rose-700' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-rose-100 text-rose-700' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 font-semibold">
            Showing {filteredBusinesses.length} of {allBusinesses.length} businesses
          </div>
        </div>

        {/* Results */}
        {filteredBusinesses.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredBusinesses.map((business) => (
              viewMode === 'grid' ? (
                <BusinessCard key={business.id} business={business} />
              ) : (
                <Link
                  key={business.id}
                  href={`/business/${business.slug}`}
                  className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-black text-gray-900">{business.name}</h3>
                        {business.featured && (
                          <span className="px-2 py-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs rounded-full font-bold">
                            FEATURED
                          </span>
                        )}
                      </div>
                      {business.nameVi && (
                        <p className="text-sm text-gray-600 italic mb-2">{business.nameVi}</p>
                      )}
                      <p className="text-gray-700 mb-3 line-clamp-2">{business.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold text-gray-700">{business.category}</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{business.city}, {business.island}</span>
                        </div>
                        {business.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-gray-700 font-semibold">{business.rating}</span>
                            {business.reviewCount && (
                              <span className="text-gray-500">({business.reviewCount})</span>
                            )}
                          </div>
                        )}
                        {business.priceRange && (
                          <span className="text-gray-600 font-semibold">{business.priceRange}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              + Add Your Business
            </Link>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-5xl mb-4 block">🤝</span>
            <h2 className="text-3xl font-black mb-4">Is Your Business Not Listed?</h2>
            <p className="text-orange-100 mb-6">
              Join our growing directory of Vietnamese businesses in Hawaii. It's free to add your business!
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-600 rounded-lg font-bold hover:bg-orange-50 transition-all text-lg"
            >
              + Add Your Business Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}