import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const couponId = parseInt(id, 10);

    if (isNaN(couponId)) {
      return NextResponse.json(
        { error: 'Invalid coupon ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { isActive } = body;

    const coupon = await db.coupon.update({
      where: { id: couponId },
      data: { isActive },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const couponId = parseInt(id, 10);

    if (isNaN(couponId)) {
      return NextResponse.json(
        { error: 'Invalid coupon ID' },
        { status: 400 }
      );
    }

    // Delete related claims first
    await db.couponClaim.deleteMany({
      where: { couponId },
    });

    // Delete the coupon
    await db.coupon.delete({
      where: { id: couponId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
