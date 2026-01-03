import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single listing details
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session.userId || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const listing = await db.classifiedListing.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        reports: {
          include: {
            reporter: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        inquiries: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

// PATCH - Approve/Reject listing
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session.userId || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { action, reason } = body;

    const listing = await db.classifiedListing.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      const updated = await db.classifiedListing.update({
        where: { id },
        data: {
          status: 'active',
          moderatedAt: new Date(),
          moderatedBy: session.userId,
        },
      });

      // TODO: Send email notification to user about approval

      return NextResponse.json({ success: true, listing: updated });
    }

    if (action === 'reject') {
      const updated = await db.classifiedListing.update({
        where: { id },
        data: {
          status: 'rejected',
          moderatedAt: new Date(),
          moderatedBy: session.userId,
          rejectionReason: reason,
        },
      });

      // TODO: Send email notification to user about rejection with reason

      return NextResponse.json({ success: true, listing: updated });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

// DELETE - Delete listing
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session.userId || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Delete related records first (reports, inquiries, favorites)
    await db.$transaction([
      db.classifiedReport.deleteMany({ where: { listingId: id } }),
      db.classifiedInquiry.deleteMany({ where: { listingId: id } }),
      db.classifiedFavorite.deleteMany({ where: { listingId: id } }),
      db.classifiedListing.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
