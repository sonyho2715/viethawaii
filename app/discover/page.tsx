'use client';

import Link from 'next/link';
import { ChevronLeft, Compass, MapPin, Utensils, Coffee, ShoppingBag, Heart, Users, Calendar, TrendingUp } from 'lucide-react';
import DiscoverCard from '@/components/DiscoverCard';
import { discoverItems } from '@/lib/enhancedData';

export default function DiscoverPage() {
  // Group discover items by type
  const foodTours = discoverItems.filter(item => item.type === 'collection' && item.title.includes('Food'));
  const guides = discoverItems.filter(item => item.type === 'guide');
  const events = discoverItems.filter(item => item.type === 'event');
  const features = discoverItems.filter(item => item.type === 'feature');

  const categories = [
    {
      title: 'Food Tours & Collections',
      icon: Utensils,
      color: 'from-red-500 to-orange-500',
      items: foodTours,
      description: 'Culinary journeys through Vietnamese flavors'
    },
    {
      title: 'Local Guides',
      icon: MapPin,
      color: 'from-blue-500 to-cyan-500',
      items: guides,
      description: 'Expert guides to Vietnamese culture and locations'
    },
    {
      title: 'Community Events',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      items: events,
      description: 'Celebrate Vietnamese traditions and festivals'
    },
    {
      title: 'Featured Stories',
      icon: Heart,
      color: 'from-green-500 to-teal-500',
      items: features,
      description: 'Inspiring stories from our community'
    }
  ];

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
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Compass className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">Discover Vietnamese Hawaii</h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto">
              Explore curated collections, guides, and experiences celebrating Vietnamese culture across the Hawaiian Islands
            </p>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: '🍜', label: 'Food Tours', count: '12+' },
                { icon: '📍', label: 'Locations', count: '50+' },
                { icon: '🎉', label: 'Events', count: '8+' },
                { icon: '💼', label: 'Businesses', count: '100+' }
              ].map((stat, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-black">{stat.count}</div>
                  <div className="text-sm text-pink-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Collection */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full mb-6 shadow-lg">
              <TrendingUp className="w-6 h-6" />
              <span className="text-base font-black uppercase tracking-wide">Trending Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Most Popular Experiences
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Don't miss these community favorites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoverItems.slice(0, 6).map((item) => (
              <DiscoverCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Categorized Collections */}
        {categories.map((category, index) => (
          <section key={index} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 bg-gradient-to-r ${category.color} rounded-xl text-white`}>
                <category.icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900">{category.title}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>

            {category.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <DiscoverCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-500">Coming soon...</p>
              </div>
            )}
          </section>
        ))}

        {/* Interactive Map Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-black mb-4">Explore by Island</h2>
              <p className="text-cyan-100 mb-8">
                Discover Vietnamese businesses and experiences on your island
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Oahu', 'Maui', 'Hawaii Island', 'Kauai', 'Molokai', 'Lanai'].map(island => (
                  <Link
                    key={island}
                    href={`/businesses?island=${island}`}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all rounded-lg p-4 font-bold"
                  >
                    {island}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-gray-900 mb-4">Join Our Community</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Connect with Vietnamese businesses, share experiences, and celebrate our culture together
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Coffee,
                  title: 'Coffee Meetups',
                  description: 'Monthly gatherings at local Vietnamese coffee shops'
                },
                {
                  icon: Utensils,
                  title: 'Food Festivals',
                  description: 'Annual celebrations of Vietnamese cuisine'
                },
                {
                  icon: Heart,
                  title: 'Community Support',
                  description: 'Supporting local Vietnamese-owned businesses'
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex p-3 bg-rose-100 rounded-xl mb-4">
                    <item.icon className="w-8 h-8 text-rose-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Get Involved
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-black mb-4">Share Your Discovery</h2>
              <p className="text-pink-100 mb-6">
                Know a hidden gem? Share your favorite Vietnamese spots and experiences with the community
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/submit"
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-pink-50 transition-all"
                >
                  Submit a Business
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all"
                >
                  Share Your Story
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}