import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import AnalyticsClient from './AnalyticsClient';

export const metadata = {
  title: 'Thống kê - VietHawaii',
  description: 'Xem thống kê tin đăng của bạn',
};

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/dang-nhap?callbackUrl=/tai-khoan/analytics');
  }

  const userId = session.user.id;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get user's listings with analytics data
  const listings = await db.listing.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      views: true,
      status: true,
      createdAt: true,
      images: {
        select: { imageUrl: true },
        take: 1,
        orderBy: { sortOrder: 'asc' },
      },
      _count: {
        select: { savedBy: true },
      },
    },
    orderBy: { views: 'desc' },
  });

  // Get view history for the last 30 days
  const listingIds = listings.map((l) => l.id);
  const viewHistory = listingIds.length > 0
    ? await db.listingView.groupBy({
        by: ['viewedAt'],
        where: {
          listingId: { in: listingIds },
          viewedAt: { gte: thirtyDaysAgo },
        },
        _count: { id: true },
      })
    : [];

  // Aggregate views by date
  const viewsByDate: Record<string, number> = {};
  viewHistory.forEach((v) => {
    const dateKey = new Date(v.viewedAt).toISOString().split('T')[0];
    viewsByDate[dateKey] = (viewsByDate[dateKey] || 0) + v._count.id;
  });

  // Generate last 30 days with data
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

  // Calculate totals
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const totalSaves = listings.reduce((sum, l) => sum + l._count.savedBy, 0);
  const activeListings = listings.filter((l) => l.status === 'ACTIVE').length;
  const viewsLast30Days = chartData.reduce((sum, d) => sum + d.views, 0);

  return (
    <AnalyticsClient
      listings={listings.map((l) => ({
        id: l.id,
        title: l.title,
        views: l.views,
        saves: l._count.savedBy,
        status: l.status,
        imageUrl: l.images[0]?.imageUrl || null,
        createdAt: l.createdAt.toISOString(),
      }))}
      chartData={chartData}
      stats={{
        totalViews,
        totalSaves,
        activeListings,
        totalListings: listings.length,
        viewsLast30Days,
      }}
    />
  );
}
