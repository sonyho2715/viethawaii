import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return requireAdmin(request, async (req, user) => {
    try {
      const business = await prisma.business.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      });

      if (!business) {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ...business,
        createdAt: business.createdAt.toISOString(),
        updatedAt: business.updatedAt.toISOString(),
        reviewCount: business._count.reviews,
      });
    } catch (error) {
      console.error('Error fetching business:', error);
      return NextResponse.json(
        { error: 'Failed to fetch business' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return requireAdmin(request, async (req, user) => {
    try {
      const data = await req.json();

      const business = await prisma.business.update({
        where: { id },
        data: {
          name: data.name,
          nameVi: data.nameVi || null,
          description: data.description,
          descriptionVi: data.descriptionVi || null,
          category: data.category,
          subcategory: data.subcategory || null,
          address: data.address,
          city: data.city,
          island: data.island,
          phone: data.phone || null,
          email: data.email || null,
          website: data.website || null,
          priceRange: data.priceRange || null,
          featured: data.featured,
          verified: data.verified,
          features: data.features || [],
          hours: data.hours || {},
        },
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
