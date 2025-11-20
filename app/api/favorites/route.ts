import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// Get all favorites for current user
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const businesses = await prisma.business.findMany({
      where: {
        id: {
          in: user.savedBusinesses
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        rating: true,
        reviewCount: true,
        priceRange: true,
        category: true,
        address: true,
        city: true,
        island: true,
      }
    });

    return NextResponse.json({
      success: true,
      favorites: businesses,
      count: businesses.length
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add to favorites
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { businessId } = await request.json();

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Check if business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId }
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    if (user.savedBusinesses.includes(businessId)) {
      return NextResponse.json({
        success: true,
        message: 'Already in favorites',
        savedBusinesses: user.savedBusinesses
      });
    }

    // Add to favorites
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        savedBusinesses: {
          push: businessId
        }
      },
      select: {
        savedBusinesses: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Added to favorites',
      savedBusinesses: updatedUser.savedBusinesses
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { businessId } = await request.json();

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Remove from favorites
    const updatedSaved = user.savedBusinesses.filter(id => id !== businessId);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        savedBusinesses: updatedSaved
      },
      select: {
        savedBusinesses: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
      savedBusinesses: updatedUser.savedBusinesses
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
