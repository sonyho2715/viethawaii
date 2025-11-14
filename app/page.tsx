'use client';

import { useState, useMemo } from 'react';
import SearchBar from '@/components/SearchBar';
import IslandSelector from '@/components/IslandSelector';
import BusinessCard from '@/components/BusinessCard';
import {
  Island,
  categories,
  sampleBusinesses,
  getFeaturedBusinesses,
  searchBusinesses,
  getBusinessesByIsland
} from '@/lib/sampleData';
import { MapPin } from 'lucide-react';

export default function Home() {
  const [selectedIsland, setSelectedIsland] = useState<Island | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredBusinesses = useMemo(() => {
    let filtered = [...sampleBusinesses];

    // Filter by search query
    if (searchQuery) {
      filtered = searchBusinesses(searchQuery);
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
  }, [searchQuery, selectedIsland, selectedCategory]);

  const featuredBusinesses = getFeaturedBusinesses();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🌺</span>
              <h1 className="text-2xl font-bold text-gray-900">
                VietHawaii
              </h1>
            </div>
            <p className="text-sm text-gray-600 hidden sm:block">
              Your guide to Vietnamese businesses in Hawaii
            </p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Discover Vietnamese Businesses in Hawaii
            </h2>
            <p className="text-xl opacity-90">
              From authentic phở to professional services, find it all here
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

      {/* Categories */}
      <section className="py-8 bg-white border-b">
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
                {category.count !== undefined && category.count > 0 && (
                  <span className="text-sm opacity-70">({category.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results or Featured */}
        {searchQuery || selectedIsland !== 'All' || selectedCategory !== 'All' ? (
          <div>
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
              <h3 className="text-2xl font-semibold mb-6">Featured Businesses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            </section>

            {/* All Businesses */}
            <section>
              <h3 className="text-2xl font-semibold mb-6">All Businesses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">VietHawaii</p>
            <p className="text-gray-400">
              Connecting the Vietnamese community across the Hawaiian Islands
            </p>
            <p className="text-gray-500 text-sm mt-4">
              © 2024 VietHawaii. A community project.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}