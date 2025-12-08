import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const updateReviewSchema = z.object({
  id: z.string().uuid('Invalid review ID'),
  status: z.enum(['pending', 'approved', 'rejected']),
});

const deleteReviewSchema = z.object({
  id: z.string().uuid('Invalid review ID'),
});

export async function GET(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const status = searchParams.get('status') || undefined;

      const where: Prisma.ReviewWhereInput = {};
      if (status) {
        where.status = status;
      }

      const reviews = await prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          business: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return NextResponse.json(
        reviews.map(r => ({
          id: r.id,
          userName: r.userName,
          userEmail: r.userEmail,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          helpful: r.helpful,
          status: r.status,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
          business: r.business,
        }))
      );
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
    try {
      const body = await req.json();
      const validated = updateReviewSchema.safeParse(body);

      if (!validated.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validated.error.issues },
          { status: 400 }
        );
      }

      const { id, status } = validated.data;

      // Update review status
      const review = await prisma.review.update({
        where: { id },
        data: { status },
      });

      // If approved, update business rating
      if (status === 'approved') {
        const reviews = await prisma.review.findMany({
          where: {
            businessId: review.businessId,
            status: 'approved',
          },
        });

        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await prisma.business.update({
          where: { id: review.businessId },
          data: {
            rating: avgRating,
            reviewCount: reviews.length,
          },
        });
      }

      return NextResponse.json({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      });
    } catch (error) {
      console.error('Error updating review:', error);
      return NextResponse.json(
        { error: 'Failed to update review' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
    try {
      const body = await req.json();
      const validated = deleteReviewSchema.safeParse(body);

      if (!validated.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validated.error.issues },
          { status: 400 }
        );
      }

      const { id } = validated.data;

      const review = await prisma.review.findUnique({
        where: { id },
      });

      if (!review) {
        return NextResponse.json(
          { error: 'Review not found' },
          { status: 404 }
        );
      }

      await prisma.review.delete({
        where: { id },
      });

      // Recalculate business rating
      const reviews = await prisma.review.findMany({
        where: {
          businessId: review.businessId,
          status: 'approved',
        },
      });

      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      await prisma.business.update({
        where: { id: review.businessId },
        data: {
          rating: avgRating,
          reviewCount: reviews.length,
        },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting review:', error);
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      );
    }
  });
}
