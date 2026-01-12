import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { serialize, serializeArray } from '@/lib/serialize';
import CouponDetailClient from './CouponDetailClient';
import type { SerializedCoupon } from '../CouponsClient';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const couponId = parseInt(id, 10);
  if (isNaN(couponId)) return { title: 'Khuyến mãi không tồn tại' };

  const coupon = await db.coupon.findUnique({
    where: { id: couponId },
    include: { business: true },
  });

  if (!coupon) {
    return { title: 'Khuyến mãi không tồn tại' };
  }

  return {
    title: `${coupon.title} - Khuyến Mãi VietHawaii`,
    description: coupon.description?.slice(0, 160) || `${coupon.title} - Nhận ưu đãi từ ${coupon.business.name}`,
    openGraph: {
      title: coupon.title,
      description: coupon.description?.slice(0, 160),
      images: coupon.imageUrl ? [coupon.imageUrl] : undefined,
    },
  };
}

async function getCoupon(id: number, userId?: string) {
  const coupon = await db.coupon.findUnique({
    where: { id },
    include: {
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          address: true,
          phone: true,
          website: true,
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
  });

  return coupon;
}

async function getRelatedCoupons(coupon: NonNullable<Awaited<ReturnType<typeof getCoupon>>>, userId?: string) {
  const now = new Date();

  return db.coupon.findMany({
    where: {
      id: { not: coupon.id },
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
      OR: [
        { businessId: coupon.businessId },
        { business: { category: coupon.business.category } },
      ],
    },
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
    take: 4,
    orderBy: { endDate: 'asc' },
  });
}

export default async function CouponDetailPage({ params }: PageProps) {
  const { id } = await params;
  const couponId = parseInt(id, 10);
  if (isNaN(couponId)) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const coupon = await getCoupon(couponId, userId);

  if (!coupon) {
    notFound();
  }

  // Check if coupon is still valid
  const now = new Date();
  const isExpired = new Date(coupon.endDate) < now;
  const isNotStarted = new Date(coupon.startDate) > now;

  if (!coupon.isActive || isExpired || isNotStarted) {
    // Still show but with expired/inactive message
  }

  const relatedCoupons = await getRelatedCoupons(coupon, userId);

  const serializedCoupon = serialize(coupon) as unknown as SerializedCoupon & {
    business: { address: string | null; phone: string | null; website: string | null };
    claims?: { id: number; claimedAt: string; usedAt: string | null }[];
  };
  const serializedRelated = serializeArray(relatedCoupons) as unknown as SerializedCoupon[];

  return (
    <CouponDetailClient
      coupon={serializedCoupon}
      relatedCoupons={serializedRelated}
      isLoggedIn={!!userId}
      hasClaimed={!!(coupon.claims && coupon.claims.length > 0)}
    />
  );
}
