import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '50');

    const where: any = {};

    // Status filter
    if (status && status !== 'all') {
      if (status === 'reported') {
        where.reportCount = { gt: 0 };
      } else {
        where.status = status;
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [listings, total] = await Promise.all([
      db.classifiedListing.findMany({
        where,
        orderBy: [
          { status: 'asc' }, // pending first
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          category: {
            select: {
              name: true,
              nameEn: true,
              icon: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              reports: true,
            },
          },
        },
      }),
      db.classifiedListing.count({ where }),
    ]);

    // Transform to include report count
    const transformedListings = listings.map((listing) => ({
      ...listing,
      reportCount: listing._count.reports,
      _count: undefined,
    }));

    return NextResponse.json({
      success: true,
      listings: transformedListings,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error('Error fetching admin classifieds:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
