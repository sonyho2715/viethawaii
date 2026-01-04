'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, Filter, MapPin, ChevronLeft, Grid, List, Star, DollarSign,
  TrendingUp, Award, Clock, Newspaper, ShoppingBag, Wrench, ArrowRight,
  Users, Calendar, Building2, Briefcase, Home as HomeIcon, Car, Sparkles,
  BookOpen, Calculator, DollarSign as Currency, Plane, Phone, ChevronRight
} from 'lucide-react';
import BusinessCard from '@/components/BusinessCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import BusinessMap from '@/components/BusinessMap';
import type { Business } from '@/types';

interface BusinessesHomepageProps {
  businesses: Business[];
}

export default function BusinessesHomepage({ businesses }: BusinessesHomepageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIsland, setSelectedIsland] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const allBusinesses = businesses;

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

    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedIsland, priceFilter, allBusinesses]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedIsland, priceFilter]);

  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);
  const paginatedBusinesses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredBusinesses.slice(startIndex, endIndex);
  }, [filteredBusinesses, currentPage]);

  // Three Pillars Data
  const pillars = [
    {
      title: 'Tin Tức',
      titleEn: 'News',
      description: 'Tin tức cộng đồng Việt tại Hawaii',
      icon: Newspaper,
      color: 'from-primary-500 to-primary-600',
      href: '/news',
      items: [
        { title: 'Lễ Hội Tết 2026 tại Honolulu', date: 'Hôm nay' },
        { title: 'Mở thêm nhà hàng Việt trên Maui', date: '2 ngày trước' },
        { title: 'Hội thảo kinh doanh Việt-Mỹ', date: '5 ngày trước' },
      ]
    },
    {
      title: 'Chợ & Rao Vặt',
      titleEn: 'Marketplace',
      description: 'Mua bán, việc làm, nhà ở',
      icon: ShoppingBag,
      color: 'from-accent-500 to-accent-600',
      href: '/rao-vat',
      items: [
        { title: 'Tuyển thợ nail full-time', category: 'Việc Làm' },
        { title: 'Cho thuê phòng $800/tháng', category: 'Nhà Ở' },
        { title: 'Bán xe Honda 2020', category: 'Xe Cộ' },
      ]
    },
    {
      title: 'Công Cụ',
      titleEn: 'Tools',
      description: 'Máy tính, quy đổi, hướng dẫn',
      icon: Wrench,
      color: 'from-warm-500 to-warm-600',
      href: '/cong-cu',
      items: [
        { title: 'Tính Thuế Hawaii', icon: Calculator },
        { title: 'Quy Đổi USD - VND', icon: Currency },
        { title: 'Hướng Dẫn Định Cư', icon: BookOpen },
      ]
    }
  ];

  // Quick Links for Classifieds
  const quickLinks = [
    { name: 'Việc Làm', icon: Briefcase, href: '/rao-vat?category=viec-lam', count: 45 },
    { name: 'Nhà Ở', icon: HomeIcon, href: '/rao-vat?category=nha-o', count: 32 },
    { name: 'Xe Cộ', icon: Car, href: '/rao-vat?category=xe-co', count: 18 },
    { name: 'Dịch Vụ', icon: Sparkles, href: '/rao-vat?category=dich-vu', count: 56 },
  ];

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
      <Header businesses={businesses} />

      {/* Hero Section - New Teal/Blue Design */}
      <div className="relative h-[600px] md:h-[650px] overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=2069&auto=format&fit=crop')",
            }}
          />
          {/* New Teal/Blue Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/80 to-accent-900/75" />

          {/* Animated Pattern */}
          <div className="absolute inset-0 opacity-5">
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
            <div className="max-w-4xl animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-5 py-2.5 mb-6 border border-white/20">
                <span className="text-xl">🌺</span>
                <span className="text-white font-semibold text-sm">Cộng Đồng Việt tại Hawaii</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Khám Phá
                <br />
                <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
                  VietHawaii
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-100 max-w-2xl mb-8">
                Tin tức, mua bán, dịch vụ và hướng dẫn cho cộng đồng người Việt tại Hawaii
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 border border-white/50">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm doanh nghiệp, dịch vụ, tin rao..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 outline-none text-lg text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105">
                    Tìm
                  </button>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-2 mt-3 px-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-primary-50 rounded-full text-sm font-medium text-gray-700 hover:text-primary-700 transition"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.name}
                      <span className="text-xs text-gray-500">({link.count})</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Pillars Section */}
      <div className="relative z-20 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  {/* Pillar Header */}
                  <div className={`bg-gradient-to-r ${pillar.color} p-5`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                          <p className="text-sm text-white/80">{pillar.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pillar Content */}
                  <div className="p-5">
                    <div className="space-y-3">
                      {pillar.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            {'icon' in item ? (
                              <item.icon className="w-5 h-5 text-primary-500" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-primary-500" />
                            )}
                            <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                          </div>
                          {'date' in item && (
                            <span className="text-xs text-gray-500">{item.date}</span>
                          )}
                          {'category' in item && (
                            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">{item.category}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <Link
                      href={pillar.href}
                      className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition"
                    >
                      Xem Thêm
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
            <div className="text-4xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
              {allBusinesses.length}+
            </div>
            <div className="text-sm font-semibold text-gray-600">Doanh Nghiệp</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
            <div className="text-4xl font-black bg-gradient-to-r from-success-600 to-success-500 bg-clip-text text-transparent mb-2">
              6
            </div>
            <div className="text-sm font-semibold text-gray-600">Đảo Hawaii</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
            <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              500+
            </div>
            <div className="text-sm font-semibold text-gray-600">Tin Rao Vặt</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
            <div className="text-4xl font-black bg-gradient-to-r from-warm-600 to-warm-500 bg-clip-text text-transparent mb-2">
              50+
            </div>
            <div className="text-sm font-semibold text-gray-600">Tổ Chức</div>
          </div>
        </div>
      </div>

      {/* Island Selection Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Khám Phá Theo Đảo
          </h2>
          <p className="text-lg text-gray-600">
            Tìm doanh nghiệp Việt trên các đảo Hawaii
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {islandData.map((island) => (
            <button
              key={island.name}
              onClick={() => setSelectedIsland(island.name === 'Big Island' ? 'Hawaii Island' : island.name)}
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 ${
                selectedIsland === (island.name === 'Big Island' ? 'Hawaii Island' : island.name)
                  ? 'ring-4 ring-primary-500'
                  : ''
              }`}
            >
              <div className="aspect-square relative">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${island.image}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                  <div className="font-black text-xl mb-1">{island.name}</div>
                  <div className="text-sm opacity-90">
                    <span className="font-semibold">{island.count}</span> doanh nghiệp
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/90 to-accent-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Khám Phá →</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Community Quick Links */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Cộng Đồng</h2>
            <p className="text-gray-600">Kết nối với cộng đồng người Việt tại Hawaii</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/cong-dong/to-chuc"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center group"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Tổ Chức</h3>
              <p className="text-sm text-gray-600">Nhà thờ, chùa, hội đoàn</p>
            </Link>

            <Link
              href="/cong-dong/su-kien"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center group"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Sự Kiện</h3>
              <p className="text-sm text-gray-600">Lễ hội, họp mặt, hoạt động</p>
            </Link>

            <Link
              href="/huong-dan"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center group"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-warm-500 to-warm-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Hướng Dẫn</h3>
              <p className="text-sm text-gray-600">Định cư, thủ tục, cuộc sống</p>
            </Link>

            <Link
              href="/discover"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center group"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Du Lịch</h3>
              <p className="text-sm text-gray-600">Điểm đến, trải nghiệm Hawaii</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Business Directory Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Doanh Nghiệp Việt</h2>
            <p className="text-gray-600">Nhà hàng, tiệm, dịch vụ người Việt tại Hawaii</p>
          </div>
          <Link
            href="/businesses"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-700 rounded-xl font-semibold hover:bg-primary-100 transition"
          >
            Xem Tất Cả
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Danh Mục</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-medium"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Địa Điểm</label>
              <select
                value={selectedIsland}
                onChange={(e) => setSelectedIsland(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-medium"
              >
                {islands.map(island => (
                  <option key={island} value={island}>{island}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Giá</label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-medium"
              >
                {priceRanges.map(range => (
                  <option key={range} value={range}>{range === 'All' ? 'Tất Cả' : range}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Xem</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-5 h-5 inline mr-2" />
                  Lưới
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-5 h-5 inline mr-2" />
                  Danh Sách
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-600">
              Hiển thị <span className="text-primary-600 font-black text-lg">{filteredBusinesses.length}</span> của {allBusinesses.length} doanh nghiệp
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedIsland('All');
                setPriceFilter('All');
              }}
              className="text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Business Results */}
        {filteredBusinesses.length > 0 ? (
          <>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {paginatedBusinesses.map((business) => (
                viewMode === 'grid' ? (
                  <BusinessCard key={business.id} business={business} />
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
                            <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs rounded-full font-bold flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              NỔI BẬT
                            </span>
                          )}
                        </div>
                        {business.nameVi && (
                          <p className="text-sm text-gray-600 italic mb-2">{business.nameVi}</p>
                        )}
                        <p className="text-gray-700 mb-3 line-clamp-2">{business.description}</p>
                        <div className="flex items-center gap-4 text-sm flex-wrap">
                          <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-semibold">{business.category}</span>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{business.city}, {business.island}</span>
                          </div>
                          {business.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-gray-900 font-semibold">{business.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-white border-2 border-gray-300 hover:border-primary-500 transition-colors"
                >
                  Trước
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                            : 'bg-white border-2 border-gray-300 hover:border-primary-500'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-white border-2 border-gray-300 hover:border-primary-500 transition-colors"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">Không tìm thấy kết quả</h3>
            <p className="text-gray-600 mb-8 text-lg">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-bold hover:shadow-2xl transition-all hover:scale-105"
            >
              + Thêm Doanh Nghiệp
            </Link>
          </div>
        )}
      </div>

      {/* Map Section */}
      <div id="map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Bản Đồ Doanh Nghiệp</h2>
          <p className="text-gray-600">Xem vị trí doanh nghiệp trên bản đồ</p>
        </div>
        <BusinessMap businesses={allBusinesses} />
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/cta/community.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/90 to-accent-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center text-white">
            <span className="text-6xl mb-6 block animate-bounce-slow">🌺</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Tham Gia Cộng Đồng VietHawaii</h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Đăng tin, quảng bá doanh nghiệp và kết nối với cộng đồng người Việt tại Hawaii. Hoàn toàn miễn phí!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/submit"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-600 rounded-xl font-bold hover:bg-primary-50 transition-all text-lg shadow-2xl hover:scale-105"
              >
                <Building2 className="w-6 h-6" />
                Thêm Doanh Nghiệp
              </Link>
              <Link
                href="/rao-vat/dang-tin"
                className="inline-flex items-center gap-3 px-10 py-5 bg-warm-500 text-white rounded-xl font-bold hover:bg-warm-600 transition-all text-lg shadow-2xl hover:scale-105"
              >
                <ShoppingBag className="w-6 h-6" />
                Đăng Tin Rao Vặt
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Spacer for mobile bottom nav */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
