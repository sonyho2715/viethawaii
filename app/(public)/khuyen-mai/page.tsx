import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { serializeArray } from '@/lib/serialize';
import CouponsClient, { type SerializedCoupon } from './CouponsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khuyến mãi - VietHawaii',
  description: 'Khám phá các chương trình khuyến mãi, giảm giá từ các doanh nghiệp Việt Hawaii.',
};

interface SearchParams {
  category?: string;
  q?: string;
  page?: string;
}

async function getCoupons(searchParams: SearchParams, userId?: string) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 12;
  const skip = (page - 1) * limit;

  const now = new Date();

  // Build where clause - only active coupons that haven't expired
  const where: Record<string, unknown> = {
    isActive: true,
    startDate: { lte: now },
    endDate: { gte: now },
  };

  // Filter by business category
  if (searchParams.category && searchParams.category !== 'all') {
    where.business = {
      category: searchParams.category,
    };
  }

  // Search query
  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: 'insensitive' } },
      { titleEn: { contains: searchParams.q, mode: 'insensitive' } },
      { description: { contains: searchParams.q, mode: 'insensitive' } },
      { business: { name: { contains: searchParams.q, mode: 'insensitive' } } },
    ];
  }

  const [coupons, total] = await Promise.all([
    db.coupon.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
          },
        },
        claims: userId
          ? {
              where: { userId },
              select: { id: true, claimedAt: true, usedAt: true },
            }
          : false,
        _count: {
          select: { claims: true },
        },
      },
      orderBy: [{ endDate: 'asc' }], // Show ending soon first
      skip,
      take: limit,
    }),
    db.coupon.count({ where }),
  ]);

  return {
    coupons,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getBusinessCategories() {
  const businesses = await db.business.findMany({
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  });
  return businesses.map(b => b.category);
}

export default async function CouponsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [params, session] = await Promise.all([
    searchParams,
    auth(),
  ]);

  const [{ coupons, pagination }, categories] = await Promise.all([
    getCoupons(params, session?.user?.id),
    getBusinessCategories(),
  ]);

  const serializedCoupons = serializeArray(coupons) as unknown as SerializedCoupon[];

  return (
    <CouponsClient
      initialCoupons={serializedCoupons}
      categories={categories}
      pagination={pagination}
      searchParams={params}
      isLoggedIn={!!session?.user}
    />
  );
}
