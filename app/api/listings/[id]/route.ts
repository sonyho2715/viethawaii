import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const listingId = parseInt(id, 10);

    if (isNaN(listingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    const listing = await db.listing.findUnique({
      where: { id: listingId },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        neighborhood: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await db.listing.update({
      where: { id: listingId },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: listing });
  } catch (error) {
    console.error('Get listing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

const updateListingSchema = z.object({
  title: z.string().min(10).max(200).optional(),
  titleEn: z.string().max(200).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  price: z.number().min(0).nullable().optional(),
  priceType: z.enum(['FIXED', 'NEGOTIABLE', 'FREE', 'HOURLY', 'MONTHLY']).optional(),
  location: z.string().max(200).nullable().optional(),
  neighborhoodId: z.number().int().nullable().optional(),
  contactPhone: z.string().max(20).nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
  zaloNumber: z.string().max(20).nullable().optional(),
  hidePhone: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const listingId = parseInt(id, 10);

    if (isNaN(listingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    // Check ownership
    const existing = await db.listing.findUnique({
      where: { id: listingId },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = updateListingSchema.parse(body);

    const listing = await db.listing.update({
      where: { id: listingId },
      data: {
        ...validated,
        status: 'PENDING', // Re-submit for approval after edit
      },
      include: {
        category: true,
        images: true,
        neighborhood: true,
      },
    });

    return NextResponse.json({ success: true, data: listing });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update listing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const listingId = parseInt(id, 10);

    if (isNaN(listingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    // Check ownership
    const existing = await db.listing.findUnique({
      where: { id: listingId },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Soft delete by changing status
    await db.listing.update({
      where: { id: listingId },
      data: { status: 'EXPIRED' },
    });

    return NextResponse.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
