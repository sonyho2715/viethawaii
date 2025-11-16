'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, MapPin, ChevronLeft, Grid, List, Star, DollarSign, TrendingUp, Award, Clock, ArrowUpDown, Navigation2 } from 'lucide-react';
import BusinessCard from '@/components/BusinessCard';
import InteractiveBusinessMap from '@/components/InteractiveBusinessMap';
import StructuredData from '@/components/StructuredData';
import { sampleBusinesses } from '@/lib/sampleData';
import { realBusinesses } from '@/lib/enhancedData';

export default function BusinessesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIsland, setSelectedIsland] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'distance' | 'name'>('featured');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [minRating, setMinRating] = useState<number>(0);

  const allBusinesses = [...sampleBusinesses, ...realBusinesses];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  // Calculate distance
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const categories = [
    'All',
    'Food & Dining',
    'Retail & Shopping',
    'Beauty & Wellness',
    'Health & Medical',
    'Professional Services',
    'Education & Training',
    'Automotive',
    'Home & Garden',
    'Entertainment & Events',
    'Technology',
    'Other Services'
  ];
  const islands = ['All', 'Oahu', 'Maui', 'Hawaii Island', 'Kauai', 'Molokai', 'Lanai'];
  const priceRanges = ['All', '$', '$$', '$$$', '$$$$'];

  const filteredBusinesses = useMemo(() => {
    let filtered = [...allBusinesses];

    // Apply filters
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.city.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        (b.nameVi && b.nameVi.toLowerCase().includes(query))
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

    if (minRating > 0) {
      filtered = filtered.filter(b => (b.rating || 0) >= minRating);
    }

    // Calculate distances for sorting
    if (userLocation) {
      filtered = filtered.map(b => ({
        ...b,
        distance: b.lat && b.lng
          ? calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
          : null
      }));
    }

    // Sort logic
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'distance':
          if (!userLocation) return 0;
          if (a.distance === null && b.distance === null) return 0;
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.rating || 0) - (a.rating || 0);
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedIsland, priceFilter, minRating, sortBy, userLocation, allBusinesses]);

  // Island data with counts
  const islandData = [
    { name: 'Oahu', count: allBusinesses.filter(b => b.island === 'Oahu').length, image: '/images/islands/oahu.jpg' },
    { name: 'Maui', count: allBusinesses.filter(b => b.island === 'Maui').length, image: '/images/islands/maui.jpg' },
    { name: 'Big Island', count: allBusinesses.filter(b => b.island === 'Hawaii Island').length, image: '/images/islands/big-island.jpg' },
    { name: 'Kauai', count: allBusinesses.filter(b => b.island === 'Kauai').length, image: '/images/islands/kauai.jpg' },
    { name: 'Molokai', count: allBusinesses.filter(b => b.island === 'Molokai').length, image: '/images/islands/molokai.jpg' },
    { name: 'Lanai', count: allBusinesses.filter(b => b.island === 'Lanai').length, image: '/images/islands/lanai.jpg' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Structured Data */}
      <StructuredData type="breadcrumb" />

      {/* Sticky Navigation */}
      <header className="bg-white/95 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors group">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
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

      {/* Modern Hero Section with Image Background */}
      <div className="relative h-[600px] overflow-hidden">
        {/* Hero Background Image - REPLACE WITH YOUR ENVATO IMAGE */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero/businesses-hero.jpg')",
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/80 via-orange-800/75 to-amber-900/70" />

          {/* Animated Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full"
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 }}
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-full">
            <div className="max-w-4xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/30">
                <TrendingUp className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Discover Authentic Vietnamese Experiences</span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                Vietnamese businesses
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  across Hawaii
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mb-10 drop-shadow-lg">
                Discover authentic Vietnamese experiences, from traditional phở to professional services
              </p>

              {/* Glassmorphism Search Bar */}
              <div className="max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 border border-white/50">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Vietnamese businesses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-rose-500 outline-none text-lg text-black"
                    />
                  </div>
                  <button className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-20 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="text-5xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-2">
                {allBusinesses.length}+
              </div>
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Businesses</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                6
              </div>
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Islands</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                10+
              </div>
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Categories</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                1000+
              </div>
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Island Selection Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Explore by Island
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find Vietnamese businesses across all Hawaiian Islands
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {islandData.map((island) => (
            <button
              key={island.name}
              onClick={() => setSelectedIsland(island.name === 'Big Island' ? 'Hawaii Island' : island.name)}
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 ${
                selectedIsland === (island.name === 'Big Island' ? 'Hawaii Island' : island.name)
                  ? 'ring-4 ring-rose-500'
                  : ''
              }`}
            >
              {/* Island Image - REPLACE WITH YOUR ENVATO IMAGES */}
              <div className="aspect-square relative">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${island.image}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                  <div className="font-black text-xl mb-1">{island.name}</div>
                  <div className="text-sm opacity-90">
                    <span className="font-semibold">{island.count}</span> businesses
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-rose-600/90 to-orange-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Explore →</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold text-black"
                style={{ color: '#000000' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="text-black" style={{ color: '#000000' }}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Island Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
              <select
                value={selectedIsland}
                onChange={(e) => setSelectedIsland(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold text-black"
                style={{ color: '#000000' }}
              >
                {islands.map(island => (
                  <option key={island} value={island} className="text-black" style={{ color: '#000000' }}>{island}</option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">View</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-5 h-5 inline mr-2" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-5 h-5 inline mr-2" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    viewMode === 'map'
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MapPin className="w-5 h-5 inline mr-2" />
                  Map
                </button>
              </div>
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Price Range</label>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map(range => (
                <button
                  key={range}
                  onClick={() => setPriceFilter(range)}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                    priceFilter === range
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-black hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {range === 'All' ? 'Any Price' : range}
                </button>
              ))}
            </div>
          </div>

          {/* Sort and Rating Filter Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Sort By
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSortBy('featured')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    sortBy === 'featured'
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  Featured
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    sortBy === 'rating'
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  Highest Rated
                </button>
                {userLocation && (
                  <button
                    onClick={() => setSortBy('distance')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1 ${
                      sortBy === 'distance'
                        ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    <Navigation2 className="w-3 h-3" />
                    Nearest
                  </button>
                )}
                <button
                  onClick={() => setSortBy('name')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    sortBy === 'name'
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  A-Z
                </button>
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Minimum Rating
              </label>
              <div className="flex flex-wrap gap-2">
                {[0, 3, 4, 4.5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      minRating === rating
                        ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-600">
              Showing <span className="text-rose-600 font-black text-lg">{filteredBusinesses.length}</span> of {allBusinesses.length} businesses
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedIsland('All');
                setPriceFilter('All');
                setSortBy('featured');
                setMinRating(0);
              }}
              className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {viewMode === 'map' ? (
          <InteractiveBusinessMap
            businesses={filteredBusinesses}
            selectedBusiness={selectedBusiness}
            onBusinessSelect={setSelectedBusiness}
          />
        ) : filteredBusinesses.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredBusinesses.map((business) => (
              viewMode === 'grid' ? (
                <BusinessCard key={business.id} business={business} userLocation={userLocation} />
              ) : (
                <Link
                  key={business.id}
                  href={`/business/${business.slug}`}
                  className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-black text-gray-900">{business.name}</h3>
                        {business.featured && (
                          <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs rounded-full font-bold flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            FEATURED
                          </span>
                        )}
                      </div>
                      {business.nameVi && (
                        <p className="text-sm text-gray-600 italic mb-2">{business.nameVi}</p>
                      )}
                      <p className="text-gray-700 mb-3 line-clamp-2">{business.description}</p>
                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full font-semibold">{business.category}</span>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{business.city}, {business.island}</span>
                        </div>
                        {business.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-gray-900 font-semibold">{business.rating}</span>
                            {business.reviewCount && (
                              <span className="text-gray-500">({business.reviewCount})</span>
                            )}
                          </div>
                        )}
                        {business.priceRange && (
                          <span className="text-gray-700 font-semibold">{business.priceRange}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">No businesses found</h3>
            <p className="text-gray-600 mb-8 text-lg">Try adjusting your search or filters</p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-2xl transition-all hover:scale-105"
            >
              + Add Your Business
            </Link>
          </div>
        )}
      </div>

      {/* CTA Section with Image Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/cta/community.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 via-orange-900/90 to-amber-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center text-white">
            <span className="text-6xl mb-6 block animate-bounce">🤝</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Is Your Business Not Listed?</h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Join our growing directory of Vietnamese businesses in Hawaii. It's free to add your business and connect with the community!
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-rose-600 rounded-xl font-bold hover:bg-orange-50 transition-all text-lg shadow-2xl hover:scale-105"
            >
              <Award className="w-6 h-6" />
              Add Your Business Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
