import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
    try {
      const [
        totalBusinesses,
        activeBusinesses,
        pendingBusinesses,
        totalReviews,
        pendingReviews,
        totalUsers,
        totalNews,
        totalBlogs,
        totalDiscover,
        recentReviews,
      ] = await Promise.all([
        prisma.business.count(),
        prisma.business.count({ where: { status: 'active' } }),
        prisma.business.count({ where: { status: 'pending' } }),
        prisma.review.count(),
        prisma.review.count({ where: { status: 'pending' } }),
        prisma.user.count(),
        prisma.newsArticle.count({ where: { published: true } }),
        prisma.blogPost.count({ where: { published: true } }),
        prisma.discoverItem.count({ where: { published: true } }),
        prisma.review.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            business: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        }),
      ]);

      const stats = {
        totalBusinesses,
        activeBusinesses,
        pendingBusinesses,
        totalReviews,
        pendingReviews,
        totalUsers,
        totalNews,
        totalBlogs,
        totalDiscover,
        recentReviews: recentReviews.map(review => ({
          id: review.id,
          userName: review.userName,
          rating: review.rating,
          comment: review.comment,
          businessName: review.business.name,
          businessSlug: review.business.slug,
          createdAt: review.createdAt.toISOString(),
          status: review.status,
        })),
      };

      return NextResponse.json(stats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }
  });
}
