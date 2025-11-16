import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createReviewSchema, validate } from '@/lib/validations';
import type { ApiResponse } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validate(createReviewSchema, body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors
      }, { status: 400 });
    }

    // Check if business exists
    const business = await prisma.business.findUnique({
      where: { id: validation.data.businessId }
    });

    if (!business) {
      return NextResponse.json({
        success: false,
        error: 'Business not found'
      }, { status: 404 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        businessId: validation.data.businessId,
        userName: validation.data.userName,
        userEmail: validation.data.userEmail,
        rating: validation.data.rating,
        comment: validation.data.content,
        title: validation.data.title,
        status: 'pending', // Reviews need approval
      }
    });

    // Update business rating (recalculate average)
    const reviews = await prisma.review.findMany({
      where: {
        businessId: validation.data.businessId,
        status: 'approved'
      }
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await prisma.business.update({
      where: { id: validation.data.businessId },
      data: {
        rating: avgRating,
        reviewCount: reviews.length
      }
    });

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review submitted successfully and is pending approval'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create review'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const status = searchParams.get('status') || 'approved';

    const reviews = await prisma.review.findMany({
      where: {
        ...(businessId ? { businessId } : {}),
        status: status as string
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reviews'
    }, { status: 500 });
  }
}
