'use client';

import { useState } from 'react';
import { BarChart3, Users, FileText, Eye, TrendingUp, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalListings: number;
  totalArticles: number;
  totalEvents: number;
  totalViews: number;
  recentUsers: number;
  recentListings: number;
  pendingListings: number;
  topCategories: Array<{ name: string; count: number }>;
  viewsByDay: Array<{ date: string; views: number }>;
}

interface AnalyticsClientProps {
  data: AnalyticsData;
}

export default function AnalyticsClient({ data }: AnalyticsClientProps) {
  const [dateRange, setDateRange] = useState('7d');

  const stats = [
    {
      label: 'Tổng người dùng',
      value: data.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: `+${data.recentUsers} tuần này`,
    },
    {
      label: 'Tổng tin đăng',
      value: data.totalListings,
      icon: FileText,
      color: 'bg-green-500',
      change: `+${data.recentListings} tuần này`,
    },
    {
      label: 'Chờ duyệt',
      value: data.pendingListings,
      icon: Calendar,
      color: 'bg-orange-500',
      change: 'cần xử lý',
    },
    {
      label: 'Lượt xem',
      value: data.totalViews,
      icon: Eye,
      color: 'bg-purple-500',
      change: 'tổng cộng',
    },
  ];

  // Calculate max views for chart scaling
  const maxViews = Math.max(...data.viewsByDay.map(d => d.views), 1);

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-orange-500" />
          Thống kê
        </h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="7d">7 ngày qua</option>
          <option value="30d">30 ngày qua</option>
          <option value="90d">90 ngày qua</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Lượt xem theo ngày
          </h3>
          <div className="h-64 flex items-end gap-2">
            {data.viewsByDay.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-orange-500 rounded-t transition-all hover:bg-orange-600"
                  style={{ height: `${(day.views / maxViews) * 200}px`, minHeight: '4px' }}
                  title={`${day.date}: ${day.views} lượt xem`}
                />
                <span className="text-xs text-gray-400 mt-2 -rotate-45 origin-top-left">
                  {new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Danh mục phổ biến
          </h3>
          <div className="space-y-4">
            {data.topCategories.map((cat, index) => {
              const maxCount = data.topCategories[0]?.count || 1;
              const percentage = (cat.count / maxCount) * 100;

              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{cat.name}</span>
                    <span className="text-gray-500">{cat.count} tin</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-blue-100 text-sm">Bài viết</p>
          <p className="text-2xl font-bold">{data.totalArticles}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-purple-100 text-sm">Sự kiện</p>
          <p className="text-2xl font-bold">{data.totalEvents}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <p className="text-green-100 text-sm">Tin hoạt động</p>
          <p className="text-2xl font-bold">
            {data.totalListings - data.pendingListings}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white">
          <p className="text-orange-100 text-sm">Tỷ lệ duyệt</p>
          <p className="text-2xl font-bold">
            {data.totalListings > 0
              ? Math.round(((data.totalListings - data.pendingListings) / data.totalListings) * 100)
              : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
