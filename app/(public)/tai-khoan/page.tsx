import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import AccountDashboardClient from './AccountDashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài khoản - VietHawaii',
  description: 'Quản lý tài khoản và tin đăng của bạn',
};

async function getUserStats(userId: string) {
  const [totalListings, activeListings, pendingListings, totalViews] = await Promise.all([
    db.listing.count({ where: { userId } }),
    db.listing.count({ where: { userId, status: 'ACTIVE' } }),
    db.listing.count({ where: { userId, status: 'PENDING' } }),
    db.listing.aggregate({
      where: { userId },
      _sum: { views: true },
    }),
  ]);

  return {
    totalListings,
    activeListings,
    pendingListings,
    totalViews: totalViews._sum.views || 0,
  };
}

async function getRecentListings(userId: string) {
  return db.listing.findMany({
    where: { userId },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
}

export default async function AccountPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [stats, recentListings] = await Promise.all([
    getUserStats(userId),
    getRecentListings(userId),
  ]);

  return (
    <AccountDashboardClient
      user={session!.user!}
      stats={stats}
      recentListings={recentListings}
    />
  );
}
