import { db } from '@/lib/db';
import {
  Users,
  FileText,
  Clock,
  TrendingUp,
  Eye,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';

async function getStats() {
  const [
    totalUsers,
    totalListings,
    pendingListings,
    activeListings,
    newUsersToday,
    newListingsToday,
  ] = await Promise.all([
    db.user.count(),
    db.listing.count(),
    db.listing.count({ where: { status: 'PENDING' } }),
    db.listing.count({ where: { status: 'ACTIVE' } }),
    db.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    db.listing.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalListings,
    pendingListings,
    activeListings,
    newUsersToday,
    newListingsToday,
  };
}

async function getRecentListings() {
  return db.listing.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      category: { select: { nameVn: true } },
    },
  });
}

async function getRecentUsers() {
  return db.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export default async function AdminDashboard() {
  const [stats, recentListings, recentUsers] = await Promise.all([
    getStats(),
    getRecentListings(),
    getRecentUsers(),
  ]);

  const statCards = [
    {
      label: 'Tổng Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/users',
    },
    {
      label: 'Tổng Tin đăng',
      value: stats.totalListings,
      icon: FileText,
      color: 'bg-green-500',
      href: '/admin/listings',
    },
    {
      label: 'Chờ duyệt',
      value: stats.pendingListings,
      icon: Clock,
      color: 'bg-amber-500',
      href: '/admin/listings/pending',
    },
    {
      label: 'Đang hiển thị',
      value: stats.activeListings,
      icon: Eye,
      color: 'bg-teal-500',
      href: '/admin/listings?status=ACTIVE',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hệ thống VietHawaii</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h2 className="font-semibold text-gray-900">Hôm nay</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Users mới</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.newUsersToday}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Tin mới</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.newListingsToday}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="space-y-2">
            <Link
              href="/admin/listings/pending"
              className="flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <span className="font-medium text-amber-800">Duyệt tin chờ</span>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 text-sm font-medium rounded">
                {stats.pendingListings}
              </span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="font-medium text-blue-800">Quản lý users</span>
              <span className="text-blue-600">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Tin đăng gần đây</h2>
            <Link href="/admin/listings" className="text-sm text-teal-600 hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentListings.map((listing) => (
              <div key={listing.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {listing.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {listing.user.name || listing.user.email} • {listing.category.nameVn}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      listing.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : listing.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>
              </div>
            ))}
            {recentListings.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Chưa có tin đăng nào
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Users mới đăng ký</h2>
            <Link href="/admin/users" className="text-sm text-teal-600 hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {user.name || 'Chưa đặt tên'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      user.role === 'SUPERADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'ADMIN'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Chưa có user nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
