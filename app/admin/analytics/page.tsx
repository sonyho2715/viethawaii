import { db } from '@/lib/db';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  FileText,
  Store,
  Calendar,
  Tag,
  Eye,
  TrendingUp,
  MapPin,
  Clock,
} from 'lucide-react';

export const metadata = {
  title: 'Thống kê - Admin VietHawaii',
  description: 'Dashboard thống kê toàn trang',
};

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get overview stats
  const [
    totalUsers,
    totalListings,
    totalBusinesses,
    totalEvents,
    totalCoupons,
    activeListings,
    pendingListings,
    newUsersThisWeek,
    newListingsThisWeek,
  ] = await Promise.all([
    db.user.count(),
    db.listing.count(),
    db.business.count(),
    db.event.count(),
    db.coupon.count(),
    db.listing.count({ where: { status: 'ACTIVE' } }),
    db.listing.count({ where: { status: 'PENDING' } }),
    db.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    db.listing.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ]);

  // Get listings by category
  const listingsByCategory = await db.listing.groupBy({
    by: ['categoryId'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  const categoryIds = listingsByCategory.map((l) => l.categoryId).filter(Boolean) as number[];
  const categories = await db.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, nameVn: true },
  });

  const categoryMap = new Map(categories.map((c) => [c.id, c.nameVn]));
  const categoryStats = listingsByCategory.map((l) => ({
    name: l.categoryId ? categoryMap.get(l.categoryId) || 'Không danh mục' : 'Không danh mục',
    count: l._count.id,
  }));

  // Get listings by neighborhood
  const listingsByNeighborhood = await db.listing.groupBy({
    by: ['neighborhoodId'],
    _count: { id: true },
    where: { neighborhoodId: { not: null } },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  const neighborhoodIds = listingsByNeighborhood.map((l) => l.neighborhoodId).filter(Boolean) as number[];
  const neighborhoods = await db.neighborhood.findMany({
    where: { id: { in: neighborhoodIds } },
    select: { id: true, name: true },
  });

  const neighborhoodMap = new Map(neighborhoods.map((n) => [n.id, n.name]));
  const neighborhoodStats = listingsByNeighborhood.map((l) => ({
    name: l.neighborhoodId ? neighborhoodMap.get(l.neighborhoodId) || 'Không xác định' : 'Không xác định',
    count: l._count.id,
  }));

  // Get top viewed listings
  const topListings = await db.listing.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { views: 'desc' },
    take: 10,
    select: {
      id: true,
      title: true,
      views: true,
      category: { select: { nameVn: true } },
    },
  });

  // Get view history over last 30 days
  const viewsGrouped = await db.listingView.groupBy({
    by: ['viewedAt'],
    where: { viewedAt: { gte: thirtyDaysAgo } },
    _count: { id: true },
  });

  // Aggregate views by date
  const viewsByDate: Record<string, number> = {};
  viewsGrouped.forEach((v) => {
    const dateKey = new Date(v.viewedAt).toISOString().split('T')[0];
    viewsByDate[dateKey] = (viewsByDate[dateKey] || 0) + v._count.id;
  });

  // Generate chart data
  const chartData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    chartData.push({
      date: dateKey,
      views: viewsByDate[dateKey] || 0,
    });
  }

  const totalViewsLast30Days = chartData.reduce((sum, d) => sum + d.views, 0);
  const maxViews = Math.max(...chartData.map((d) => d.views), 1);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const statCards = [
    { label: 'Người dùng', value: totalUsers, icon: Users, color: 'bg-blue-500', change: newUsersThisWeek, changeLabel: 'tuần này' },
    { label: 'Tin đăng', value: totalListings, icon: FileText, color: 'bg-green-500', change: newListingsThisWeek, changeLabel: 'tuần này' },
    { label: 'Doanh nghiệp', value: totalBusinesses, icon: Store, color: 'bg-purple-500' },
    { label: 'Sự kiện', value: totalEvents, icon: Calendar, color: 'bg-orange-500' },
    { label: 'Khuyến mãi', value: totalCoupons, icon: Tag, color: 'bg-rose-500' },
    { label: 'Tin đang hoạt động', value: activeListings, icon: Eye, color: 'bg-emerald-500' },
    { label: 'Tin chờ duyệt', value: pendingListings, icon: Clock, color: 'bg-amber-500' },
    { label: 'Lượt xem (30 ngày)', value: totalViewsLast30Days, icon: TrendingUp, color: 'bg-cyan-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-blue-600" />
          Thống kê tổng quan
        </h1>
        <p className="text-gray-600">Dashboard thống kê toàn trang VietHawaii</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  {stat.change !== undefined && (
                    <span className="text-xs text-green-600">
                      +{stat.change} {stat.changeLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Views Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Lượt xem 30 ngày qua
        </h2>

        {totalViewsLast30Days === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Chưa có dữ liệu lượt xem
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bar Chart */}
            <div className="flex items-end gap-1 h-48">
              {chartData.map((point, idx) => {
                const heightPercent = (point.views / maxViews) * 100;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center justify-end group"
                  >
                    <div className="relative w-full">
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {formatDate(point.date)}: {point.views} lượt xem
                      </div>
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all duration-200 hover:bg-blue-600 min-h-[2px]"
                        style={{ height: `${Math.max(heightPercent, 1)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-xs text-gray-500 px-1">
              {chartData
                .filter((_, idx) => idx % 5 === 0 || idx === chartData.length - 1)
                .map((point, idx) => (
                  <span key={idx}>{formatDate(point.date)}</span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Listings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Tin đăng được xem nhiều nhất
          </h2>

          {topListings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có dữ liệu
            </div>
          ) : (
            <div className="space-y-3">
              {topListings.map((listing, idx) => (
                <Link
                  key={listing.id}
                  href={`/admin/listings/${listing.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                    <p className="text-xs text-gray-500">{listing.category?.nameVn || 'Không danh mục'}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {listing.views.toLocaleString()} views
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Listings by Category */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Tin đăng theo danh mục
          </h2>

          {categoryStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có dữ liệu
            </div>
          ) : (
            <div className="space-y-3">
              {categoryStats.map((cat, idx) => {
                const maxCount = categoryStats[0]?.count || 1;
                const widthPercent = (cat.count / maxCount) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="font-medium text-gray-900">{cat.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Listings by Neighborhood */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-600" />
            Tin đăng theo khu vực
          </h2>

          {neighborhoodStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có dữ liệu khu vực
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {neighborhoodStats.map((neighborhood, idx) => {
                const maxCount = neighborhoodStats[0]?.count || 1;
                const widthPercent = (neighborhood.count / maxCount) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{neighborhood.name}</span>
                      <span className="font-medium text-gray-900">{neighborhood.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
