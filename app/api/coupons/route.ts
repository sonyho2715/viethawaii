import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const category = searchParams.get('category');
    const businessId = searchParams.get('businessId');

    const now = new Date();

    const where: Record<string, unknown> = {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    };

    if (category && category !== 'all') {
      where.business = { category };
    }

    if (businessId) {
      where.businessId = parseInt(businessId, 10);
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
          _count: {
            select: { claims: true },
          },
        },
        orderBy: { endDate: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.coupon.count({ where }),
    ]);

    return NextResponse.json({
      coupons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}
