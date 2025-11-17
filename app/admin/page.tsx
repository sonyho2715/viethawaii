'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import StatCard from '@/components/admin/StatCard';
import {
  Store,
  MessageSquare,
  Users,
  FileText,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Activity,
  Eye,
  ThumbsUp,
  MapPin,
  Plus,
  BarChart3,
} from 'lucide-react';

interface Stats {
  totalBusinesses: number;
  activeBusinesses: number;
  pendingBusinesses: number;
  totalReviews: number;
  pendingReviews: number;
  totalUsers: number;
  totalNews: number;
  totalBlogs: number;
  totalDiscover: number;
  recentReviews: Array<{
    id: string;
    userName: string;
    rating: number;
    comment: string;
    businessName: string;
    businessSlug: string;
    createdAt: string;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const result = await response.json();

      if (result.success && result.user.role === 'admin') {
        await fetchStats();
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Failed to load dashboard data</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header with Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Real-time insights for VietHawaii
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/submit"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-rose-500 hover:text-rose-600 transition-all shadow-sm hover:shadow-md"
            >
              <Eye className="w-4 h-4" />
              Preview Site
            </Link>
            <Link
              href="/admin/businesses"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Business
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid with Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Businesses"
          value={stats.totalBusinesses}
          subtitle={`${stats.activeBusinesses} active listings`}
          icon={Store}
          color="blue"
          trend={{
            value: `${((stats.activeBusinesses / stats.totalBusinesses) * 100).toFixed(0)}%`,
            isPositive: true
          }}
        />
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          subtitle={stats.pendingReviews > 0 ? `${stats.pendingReviews} awaiting review` : 'All moderated'}
          icon={Star}
          color="purple"
          trend={stats.pendingReviews > 0 ? {
            value: `${stats.pendingReviews} pending`,
            isPositive: false
          } : undefined}
        />
        <StatCard
          title="Community Users"
          value={stats.totalUsers}
          subtitle="Registered members"
          icon={Users}
          color="orange"
        />
        <StatCard
          title="Content Library"
          value={stats.totalNews + stats.totalBlogs + stats.totalDiscover}
          subtitle={`${stats.totalNews} news · ${stats.totalBlogs} blogs · ${stats.totalDiscover} guides`}
          icon={FileText}
          color="green"
        />
      </div>

      {/* Pending Actions Alert - Enhanced */}
      {(stats.pendingBusinesses > 0 || stats.pendingReviews > 0) && (
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-2 border-amber-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-gray-900">Action Required</h3>
                <span className="px-2.5 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full animate-pulse">
                  {(stats.pendingBusinesses || 0) + (stats.pendingReviews || 0)}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stats.pendingBusinesses > 0 && (
                  <Link
                    href="/admin/pending-businesses"
                    className="group relative overflow-hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-xl transition-all border border-gray-200 hover:border-rose-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <Store className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{stats.pendingBusinesses}</p>
                        <p className="text-sm text-gray-600">Business{stats.pendingBusinesses !== 1 ? 'es' : ''} to review</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                )}
                {stats.pendingReviews > 0 && (
                  <Link
                    href="/admin/reviews"
                    className="group relative overflow-hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-xl transition-all border border-gray-200 hover:border-rose-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <Star className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{stats.pendingReviews}</p>
                        <p className="text-sm text-gray-600">Review{stats.pendingReviews !== 1 ? 's' : ''} to moderate</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats & Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Business Performance */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Business Health</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{stats.activeBusinesses}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">Pending</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{stats.pendingBusinesses}</span>
            </div>
          </div>
        </div>

        {/* Review Metrics */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Review Analytics</h3>
            <ThumbsUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Reviews</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalReviews}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <span className="text-sm font-medium text-gray-700">Avg per Business</span>
              <span className="text-lg font-bold text-gray-900">
                {stats.totalBusinesses > 0 ? (stats.totalReviews / stats.totalBusinesses).toFixed(1) : '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Island Distribution */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Coverage</h3>
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Islands</span>
              <span className="text-lg font-bold text-gray-900">6</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <span className="text-sm font-medium text-gray-700">Content Pieces</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalNews + stats.totalBlogs + stats.totalDiscover}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reviews */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
            </div>
            <Link
              href="/admin/reviews"
              className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {stats.recentReviews.length > 0 ? (
              stats.recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="relative overflow-hidden bg-white p-5 border border-gray-200 rounded-xl hover:border-rose-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 mb-1">{review.userName}</p>
                        <Link
                          href={`/business/${review.businessSlug}`}
                          className="text-sm text-gray-600 hover:text-rose-600 transition-colors flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          {review.businessName}
                        </Link>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gradient-to-br from-yellow-50 to-amber-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-900">{review.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 line-clamp-2 mb-3 leading-relaxed">{review.comment}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(review.createdAt)}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          review.status === 'approved'
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200'
                            : review.status === 'pending'
                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border border-yellow-200'
                            : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {review.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <div className="p-4 bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No reviews yet</p>
                <p className="text-sm text-gray-500 mt-1">Reviews will appear here once submitted</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          {/* Business Stats */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-200 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <Store className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Business Status</h3>
            </div>
            <div className="space-y-3">
              <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/30 to-transparent rounded-full blur-xl" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">Active</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.activeBusinesses}</span>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 hover:shadow-md transition-all group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200/30 to-transparent rounded-full blur-xl" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">Pending</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.pendingBusinesses}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-white to-rose-50 rounded-2xl border border-rose-200 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <Link
                href="/admin/businesses"
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors">
                    <Store className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Businesses</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/admin/content"
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg group-hover:from-purple-100 group-hover:to-pink-100 transition-colors">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Content</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Users</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
