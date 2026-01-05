import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

const updateListingSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'REJECTED', 'EXPIRED', 'SOLD', 'DELETED']).optional(),
  isFeatured: z.boolean().optional(),
  rejectionReason: z.string().max(500).optional(),
});

// GET - Get single listing details for admin
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const listingId = parseInt(id, 10);

    if (isNaN(listingId)) {
      return NextResponse.json(
        { success: false, error: 'ID không hợp lệ' },
        { status: 400 }
      );
    }

    const listing = await db.listing.findUnique({
      where: { id: listingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
        category: true,
        neighborhood: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Tin đăng không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: listing });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    console.error('Get listing error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// PATCH - Update listing status (approve/reject/feature)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const listingId = parseInt(id, 10);

    if (isNaN(listingId)) {
      return NextResponse.json(
        { success: false, error: 'ID không hợp lệ' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validated = updateListingSchema.parse(body);

    // Check if listing exists
    const existingListing = await db.listing.findUnique({
      where: { id: listingId },
    });

    if (!existingListing) {
      return NextResponse.json(
        { success: false, error: 'Tin đăng không tồn tại' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    if (validated.status !== undefined) {
      updateData.status = validated.status;

      // If approving, set approvedAt and clear rejection reason
      if (validated.status === 'ACTIVE') {
        updateData.approvedAt = new Date();
        updateData.rejectionReason = null;
      }

      // If rejecting, set rejection reason
      if (validated.status === 'REJECTED' && validated.rejectionReason) {
        updateData.rejectionReason = validated.rejectionReason;
      }
    }

    if (validated.isFeatured !== undefined) {
      updateData.isFeatured = validated.isFeatured;
      if (validated.isFeatured) {
        updateData.featuredUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      }
    }

    const listing = await db.listing.update({
      where: { id: listingId },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { nameVn: true },
        },
      },
    });

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: session.user.id,
        action: validated.status === 'ACTIVE'
          ? 'APPROVE_LISTING'
          : validated.status === 'REJECTED'
          ? 'REJECT_LISTING'
          : 'UPDATE_LISTING',
        itemType: 'LISTING',
        itemId: listingId,
        details: {
          previousStatus: existingListing.status,
          newStatus: validated.status,
          isFeatured: validated.isFeatured,
          rejectionReason: validated.rejectionReason,
        },
      },
    });

    return NextResponse.json({ success: true, data: listing });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    console.error('Update listing error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// DELETE - Delete listing
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const listingId = parseInt(id, 10);

    if (isNaN(listingId)) {
      return NextResponse.json(
        { success: false, error: 'ID không hợp lệ' },
        { status: 400 }
      );
    }

    // Check if listing exists
    const existingListing = await db.listing.findUnique({
      where: { id: listingId },
      include: {
        user: { select: { email: true } },
      },
    });

    if (!existingListing) {
      return NextResponse.json(
        { success: false, error: 'Tin đăng không tồn tại' },
        { status: 404 }
      );
    }

    // Delete listing images first (due to foreign key constraint)
    await db.listingImage.deleteMany({
      where: { listingId: listingId },
    });

    // Delete the listing
    await db.listing.delete({
      where: { id: listingId },
    });

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: session.user.id,
        action: 'DELETE_LISTING',
        itemType: 'LISTING',
        itemId: listingId,
        details: {
          title: existingListing.title,
          userEmail: existingListing.user.email,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa tin đăng thành công',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    console.error('Delete listing error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
