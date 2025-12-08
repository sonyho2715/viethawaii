import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAdmin } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const business = await prisma.business.findUnique({
      where: {
        slug: slug,
      },
      include: {
        reviews: {
          where: {
            status: 'approved',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: business });
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch business' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return requireAuth(request, async (req, user) => {
    try {
      const { slug } = await params;
      const data = await req.json();

      // Check if user owns this business or is admin
      const existingBusiness = await prisma.business.findUnique({
        where: { slug },
        select: { ownerId: true },
      });

      if (!existingBusiness) {
        return NextResponse.json(
          { success: false, error: 'Business not found' },
          { status: 404 }
        );
      }

      if (existingBusiness.ownerId !== user.userId && user.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Not authorized to update this business' },
          { status: 403 }
        );
      }

      const business = await prisma.business.update({
        where: { slug },
        data,
      });

      return NextResponse.json({ success: true, data: business });
    } catch (error) {
      console.error('Error updating business:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update business' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return requireAdmin(request, async (req, user) => {
    try {
      const { slug } = await params;

      await prisma.business.delete({
        where: { slug },
      });

      return NextResponse.json({ success: true, message: 'Business deleted' });
    } catch (error) {
      console.error('Error deleting business:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete business' },
        { status: 500 }
      );
    }
  });
}
