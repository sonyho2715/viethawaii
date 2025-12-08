import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const updateBusinessSchema = z.object({
  id: z.string().uuid('Invalid business ID'),
  status: z.enum(['pending', 'active', 'inactive']).optional(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});

const deleteBusinessSchema = z.object({
  id: z.string().uuid('Invalid business ID'),
});

export async function GET(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const where: Prisma.BusinessWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const businesses = await prisma.business.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    return NextResponse.json(
      businesses.map(b => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
        reviewCount: b._count.reviews,
      }))
    );
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
  });
}

export async function PATCH(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
  try {
    const body = await request.json();
    const validated = updateBusinessSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.issues },
        { status: 400 }
      );
    }

    const { id, ...data } = validated.data;

    const business = await prisma.business.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      ...business,
      createdAt: business.createdAt.toISOString(),
      updatedAt: business.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    );
  }
  });
}

export async function DELETE(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
  try {
    const body = await request.json();
    const validated = deleteBusinessSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.issues },
        { status: 400 }
      );
    }

    const { id } = validated.data;

    await prisma.business.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 }
    );
  }
  });
}
