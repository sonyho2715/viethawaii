import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const createReviewSchema = z.object({
  reviewedUserId: z.string().min(1),
  listingId: z.number().int().positive().optional(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().max(1000).optional(),
  transactionType: z.enum(['BUYER', 'SELLER']).optional(),
});

// GET /api/reviews?userId=xxx - Get reviews for a user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const listingId = searchParams.get('listingId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId && !listingId) {
      return NextResponse.json(
        { error: 'userId or listingId is required' },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {};
    if (userId) where.reviewedUserId = userId;
    if (listingId) where.listingId = parseInt(listingId);

    const [reviews, totalCount, aggregation] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          reviewer: {
            select: { id: true, name: true, image: true },
          },
          listing: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.review.count({ where }),
      userId
        ? db.review.aggregate({
            where: { reviewedUserId: userId },
            _avg: { rating: true },
            _count: { rating: true },
          })
        : null,
    ]);

    return NextResponse.json({
      reviews,
      totalCount,
      averageRating: aggregation?._avg.rating || 0,
      totalReviews: aggregation?._count.rating || 0,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a review
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = createReviewSchema.parse(body);

    // Cannot review yourself
    if (validated.reviewedUserId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot review yourself' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this listing (if listingId provided)
    if (validated.listingId) {
      const existing = await db.review.findUnique({
        where: {
          reviewerId_listingId: {
            reviewerId: session.user.id,
            listingId: validated.listingId,
          },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'You have already reviewed this listing' },
          { status: 409 }
        );
      }
    }

    const review = await db.review.create({
      data: {
        reviewerId: session.user.id,
        reviewedUserId: validated.reviewedUserId,
        listingId: validated.listingId,
        rating: validated.rating,
        reviewText: validated.reviewText,
        transactionType: validated.transactionType,
      },
      include: {
        reviewer: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
