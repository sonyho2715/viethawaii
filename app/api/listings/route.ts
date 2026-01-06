import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const createListingSchema = z.object({
  categoryId: z.number().int(),
  title: z.string().min(10).max(200),
  titleEn: z.string().max(200).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  price: z.number().min(0).nullable().optional(),
  priceType: z.enum(['FIXED', 'NEGOTIABLE', 'FREE', 'HOURLY', 'MONTHLY']).default('FIXED'),
  location: z.string().max(200).nullable().optional(),
  neighborhoodId: z.number().int().nullable().optional(),
  contactPhone: z.string().max(20).nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
  zaloNumber: z.string().max(20).nullable().optional(),
  hidePhone: z.boolean().optional(),
  images: z.array(z.string().url()).max(10).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = createListingSchema.parse(body);

    // Verify category exists
    const category = await db.category.findUnique({
      where: { id: validated.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 400 }
      );
    }

    // Verify neighborhood exists if provided
    if (validated.neighborhoodId) {
      const neighborhood = await db.neighborhood.findUnique({
        where: { id: validated.neighborhoodId },
      });

      if (!neighborhood) {
        return NextResponse.json(
          { success: false, error: 'Neighborhood not found' },
          { status: 400 }
        );
      }
    }

    // Create listing with images
    // Set expiration to 60 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);

    const listing = await db.listing.create({
      data: {
        userId: session.user.id,
        categoryId: validated.categoryId,
        title: validated.title,
        titleEn: validated.titleEn,
        description: validated.description,
        price: validated.price,
        priceType: validated.priceType,
        location: validated.location,
        neighborhoodId: validated.neighborhoodId || null,
        contactPhone: validated.contactPhone,
        contactEmail: validated.contactEmail,
        zaloNumber: validated.zaloNumber,
        hidePhone: validated.hidePhone ?? false,
        status: 'PENDING', // Require admin approval
        expiresAt, // Auto-delete after 60 days
        images: validated.images?.length
          ? {
              create: validated.images.map((url, index) => ({
                imageUrl: url,
                sortOrder: index,
                isPrimary: index === 0,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        neighborhood: true,
      },
    });

    return NextResponse.json({ success: true, data: listing }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create listing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
    const skip = (page - 1) * limit;

    const categorySlug = searchParams.get('category');
    const neighborhood = searchParams.get('neighborhood');
    const q = searchParams.get('q');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status') || 'ACTIVE';

    const where: Record<string, unknown> = {
      status: status,
    };

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (categorySlug) {
      const category = await db.category.findUnique({
        where: { slug: categorySlug },
      });

      if (category) {
        const categoryIds = [category.id];
        const children = await db.category.findMany({
          where: { parentId: category.id },
          select: { id: true },
        });
        categoryIds.push(...children.map(c => c.id));
        where.categoryId = { in: categoryIds };
      }
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { titleEn: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
    }

    if (neighborhood) {
      const n = await db.neighborhood.findUnique({
        where: { slug: neighborhood },
      });
      if (n) where.neighborhoodId = n.id;
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'views') orderBy = { views: 'desc' };

    const [listings, total] = await Promise.all([
      db.listing.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          neighborhood: true,
        },
        orderBy: [{ isFeatured: 'desc' }, orderBy],
        skip,
        take: limit,
      }),
      db.listing.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
