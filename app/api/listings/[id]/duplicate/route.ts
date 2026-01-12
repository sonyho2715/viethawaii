import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - Duplicate a listing
export async function POST(req: NextRequest, { params }: RouteParams) {
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

    // Check ownership and get full listing data
    const existing = await db.listing.findUnique({
      where: { id: listingId },
      include: {
        images: true,
        tags: true,
      },
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

    // Create the duplicate listing
    const duplicated = await db.listing.create({
      data: {
        userId: session.user.id,
        categoryId: existing.categoryId,
        neighborhoodId: existing.neighborhoodId,
        title: `${existing.title} (Copy)`,
        titleEn: existing.titleEn ? `${existing.titleEn} (Copy)` : null,
        description: existing.description,
        descriptionEn: existing.descriptionEn,
        price: existing.price,
        priceType: existing.priceType,
        location: existing.location,
        lat: existing.lat,
        lng: existing.lng,
        contactPhone: existing.contactPhone,
        contactEmail: existing.contactEmail,
        zaloNumber: existing.zaloNumber,
        hidePhone: existing.hidePhone,
        preferredContact: existing.preferredContact,
        listingType: existing.listingType,
        // Job-specific fields
        jobType: existing.jobType,
        salary: existing.salary,
        benefits: existing.benefits,
        // Housing-specific fields
        bedrooms: existing.bedrooms,
        bathrooms: existing.bathrooms,
        sqft: existing.sqft,
        petFriendly: existing.petFriendly,
        utilities: existing.utilities,
        moveInDate: existing.moveInDate,
        // Service-specific fields
        serviceArea: existing.serviceArea,
        availability: existing.availability,
        experience: existing.experience,
        status: 'PENDING', // New listings need approval
        // Copy images
        images: {
          create: existing.images.map((img) => ({
            imageUrl: img.imageUrl,
            thumbnailUrl: img.thumbnailUrl,
            cloudinaryId: img.cloudinaryId,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          })),
        },
        // Copy tags
        tags: {
          create: existing.tags.map((tag) => ({
            tag: tag.tag,
          })),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: duplicated,
      message: 'Listing duplicated successfully',
    });
  } catch (error) {
    console.error('Duplicate listing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
