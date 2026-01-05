import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import MyListingsClient from './MyListingsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin đăng của tôi - VietHawaii',
  description: 'Quản lý tin đăng của bạn',
};

interface PageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

async function getUserListings(userId: string, status?: string, page = 1) {
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { userId };

  if (status && status !== 'all') {
    where.status = status.toUpperCase();
  }

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    db.listing.count({ where }),
  ]);

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getListingStats(userId: string) {
  const [active, pending, rejected, expired] = await Promise.all([
    db.listing.count({ where: { userId, status: 'ACTIVE' } }),
    db.listing.count({ where: { userId, status: 'PENDING' } }),
    db.listing.count({ where: { userId, status: 'REJECTED' } }),
    db.listing.count({ where: { userId, status: 'EXPIRED' } }),
  ]);

  return { active, pending, rejected, expired, total: active + pending + rejected + expired };
}

export default async function MyListingsPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session!.user!.id!;
  const params = await searchParams;
  const page = parseInt(params.page || '1');

  const [{ listings, pagination }, stats] = await Promise.all([
    getUserListings(userId, params.status, page),
    getListingStats(userId),
  ]);

  return (
    <MyListingsClient
      listings={listings}
      pagination={pagination}
      stats={stats}
      currentStatus={params.status || 'all'}
    />
  );
}
