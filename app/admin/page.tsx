'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  MapPin,
  Star,
  TrendingUp,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Eye,
  Heart,
  MessageSquare,
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { sampleBusinesses, realBusinesses } from '@/lib/sampleData';
import { newsArticles, blogPosts } from '@/lib/enhancedData';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const allBusinesses = [...sampleBusinesses, ...realBusinesses];

  // Mock stats data
  const stats = {
    totalBusinesses: allBusinesses.length,
    totalViews: 12543,
    totalReviews: 1247,
    totalRevenue: 2859,
    viewsChange: 12.5,
    reviewsChange: -3.2,
    businessesChange: 8.1,
    revenueChange: 15.3
  };

  const recentActivity = [
    { id: 1, type: 'business', action: 'New business added', name: 'Pho Saigon', time: '2 hours ago', icon: '🍜' },
    { id: 2, type: 'review', action: 'New review posted', name: 'The Pig and The Lady', time: '5 hours ago', icon: '⭐' },
    { id: 3, type: 'user', action: 'New user registered', name: 'John Doe', time: '1 day ago', icon: '👤' },
    { id: 4, type: 'blog', action: 'Blog post published', name: 'Ultimate Pho Guide', time: '2 days ago', icon: '📝' },
    { id: 5, type: 'news', action: 'News article published', name: 'Tet Festival 2025', time: '3 days ago', icon: '📰' },
  ];

  const topBusinesses = allBusinesses
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-red-600 to-orange-600 text-white shadow-xl z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white rounded-full p-2">
              <span className="text-2xl">🌺</span>
            </div>
            <div>
              <h1 className="text-xl font-black">VietHawaii</h1>
              <p className="text-xs text-yellow-200">Admin Dashboard</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-white/20 rounded-lg font-semibold">
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/admin/businesses" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
              <MapPin className="w-5 h-5" />
              Businesses
            </Link>
            <Link href="/admin/reviews" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
              <Star className="w-5 h-5" />
              Reviews
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
              Users
            </Link>
            <Link href="/admin/content" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
              <FileText className="w-5 h-5" />
              Content
            </Link>
            <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
              <TrendingUp className="w-5 h-5" />
              Analytics
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors w-full text-left">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl font-black text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with VietHawaii.</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:border-red-500 transition-colors"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Link
                href="/"
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stats.businessesChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.businessesChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(stats.businessesChange)}%
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalBusinesses}</div>
            <div className="text-sm font-medium text-gray-600">Total Businesses</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stats.viewsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.viewsChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(stats.viewsChange)}%
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalViews.toLocaleString()}</div>
            <div className="text-sm font-medium text-gray-600">Total Views</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stats.reviewsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.reviewsChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(stats.reviewsChange)}%
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalReviews.toLocaleString()}</div>
            <div className="text-sm font-medium text-gray-600">Total Reviews</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.revenueChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(stats.revenueChange)}%
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm font-medium text-gray-600">Monthly Revenue</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="text-3xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.name}</p>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Businesses */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Top Rated</h3>
            <div className="space-y-4">
              {topBusinesses.map((business, index) => (
                <div key={business.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-yellow-600 rounded-full flex items-center justify-center text-white font-black">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{business.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-gray-700">{business.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-10 h-10" />
              <div className="text-4xl font-black">{blogPosts.length}</div>
            </div>
            <div className="text-lg font-bold">Blog Posts</div>
            <div className="text-sm text-blue-100 mt-1">Published articles</div>
          </div>

          <div className="bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-10 h-10" />
              <div className="text-4xl font-black">{newsArticles.length}</div>
            </div>
            <div className="text-lg font-bold">News Articles</div>
            <div className="text-sm text-pink-100 mt-1">Community updates</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10" />
              <div className="text-4xl font-black">847</div>
            </div>
            <div className="text-lg font-bold">Active Users</div>
            <div className="text-sm text-green-100 mt-1">This month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
