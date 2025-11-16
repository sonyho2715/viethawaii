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

      if (result.success && result.data.role === 'admin') {
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with VietHawaii.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Businesses"
          value={stats.totalBusinesses}
          subtitle={`${stats.activeBusinesses} active`}
          icon={Store}
          color="blue"
        />
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          subtitle={stats.pendingReviews > 0 ? `${stats.pendingReviews} pending` : 'All reviewed'}
          icon={MessageSquare}
          color="purple"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="orange"
        />
        <StatCard
          title="Content Items"
          value={stats.totalNews + stats.totalBlogs + stats.totalDiscover}
          subtitle={`${stats.totalNews} news, ${stats.totalBlogs} blogs`}
          icon={FileText}
          color="green"
        />
      </div>

      {/* Pending Actions Alert */}
      {(stats.pendingBusinesses > 0 || stats.pendingReviews > 0) && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pending Actions Required</h3>
              <div className="space-y-2">
                {stats.pendingBusinesses > 0 && (
                  <Link
                    href="/admin/pending-businesses"
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {stats.pendingBusinesses} business{stats.pendingBusinesses !== 1 ? 'es' : ''} awaiting approval
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                  </Link>
                )}
                {stats.pendingReviews > 0 && (
                  <Link
                    href="/admin/reviews"
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {stats.pendingReviews} review{stats.pendingReviews !== 1 ? 's' : ''} awaiting moderation
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reviews */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
            <Link
              href="/admin/reviews"
              className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentReviews.length > 0 ? (
              stats.recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{review.userName}</p>
                      <Link
                        href={`/business/${review.businessSlug}`}
                        className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
                      >
                        {review.businessName}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-900">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{getTimeAgo(review.createdAt)}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        review.status === 'approved'
                          ? 'bg-green-50 text-green-700'
                          : review.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No reviews yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Business Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Business Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Active</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{stats.activeBusinesses}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-900">Pending</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{stats.pendingBusinesses}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/admin/businesses"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <Store className="w-5 h-5 text-gray-600 group-hover:text-rose-600" />
                <span className="font-medium text-gray-900">Manage Businesses</span>
              </Link>
              <Link
                href="/admin/content"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <FileText className="w-5 h-5 text-gray-600 group-hover:text-rose-600" />
                <span className="font-medium text-gray-900">Manage Content</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <Users className="w-5 h-5 text-gray-600 group-hover:text-rose-600" />
                <span className="font-medium text-gray-900">Manage Users</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
