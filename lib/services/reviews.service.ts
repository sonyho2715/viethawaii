/**
 * Reviews Service Module
 * Handles all review-related business logic
 */

import { prisma } from '@/lib/prisma';
import type { Review } from '@prisma/client';

export interface CreateReviewInput {
  businessId: string;
  userId?: string;
  rating: number;
  title?: string;
  comment: string;
  userName: string;
  userEmail?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  comment?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface ReviewFilters {
  businessId?: string;
  userId?: string;
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  limit?: number;
}

export class ReviewsService {
  /**
   * Create a new review
   */
  async createReview(input: CreateReviewInput): Promise<Review> {
    const review = await prisma.review.create({
      data: {
        businessId: input.businessId,
        userId: input.userId,
        rating: input.rating,
        title: input.title,
        comment: input.comment,
        userName: input.userName,
        userEmail: input.userEmail,
        status: 'pending', // Reviews need admin approval
      },
    });

    // Update business rating asynchronously (don't block)
    this.updateBusinessRating(input.businessId).catch(error => {
      console.error('Failed to update business rating:', error);
    });

    return review;
  }

  /**
   * Get reviews with filters
   */
  async getReviews(filters: ReviewFilters): Promise<{
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.businessId) {
      where.businessId = filters.businessId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Get a single review by ID
   */
  async getReviewById(id: string): Promise<Review | null> {
    return prisma.review.findUnique({
      where: { id },
    });
  }

  /**
   * Update a review
   */
  async updateReview(id: string, input: UpdateReviewInput): Promise<Review> {
    const review = await prisma.review.update({
      where: { id },
      data: input,
    });

    // If status changed to approved/rejected, update business rating
    if (input.status === 'approved' || input.status === 'rejected') {
      this.updateBusinessRating(review.businessId).catch(error => {
        console.error('Failed to update business rating:', error);
      });
    }

    return review;
  }

  /**
   * Delete a review
   */
  async deleteReview(id: string): Promise<Review> {
    const review = await prisma.review.delete({
      where: { id },
    });

    // Update business rating
    this.updateBusinessRating(review.businessId).catch(error => {
      console.error('Failed to update business rating:', error);
    });

    return review;
  }

  /**
   * Approve a review
   */
  async approveReview(id: string): Promise<Review> {
    return this.updateReview(id, { status: 'approved' });
  }

  /**
   * Reject a review
   */
  async rejectReview(id: string): Promise<Review> {
    return this.updateReview(id, { status: 'rejected' });
  }

  /**
   * Update business rating based on approved reviews
   */
  private async updateBusinessRating(businessId: string): Promise<void> {
    const reviews = await prisma.review.findMany({
      where: {
        businessId,
        status: 'approved',
      },
      select: {
        rating: true,
      },
    });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await prisma.business.update({
      where: { id: businessId },
      data: {
        rating: avgRating,
        reviewCount: reviews.length,
      },
    });
  }

  /**
   * Get review statistics for a business
   */
  async getBusinessReviewStats(businessId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  }> {
    const reviews = await prisma.review.findMany({
      where: {
        businessId,
        status: 'approved',
      },
      select: {
        rating: true,
      },
    });

    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let totalRating = 0;

    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
      totalRating += review.rating;
    });

    return {
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
      ratingDistribution,
    };
  }
}

// Export singleton instance
export const reviewsService = new ReviewsService();
