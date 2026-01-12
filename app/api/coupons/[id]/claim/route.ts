import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
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

    // Get the coupon
    const coupon = await db.coupon.findUnique({
      where: { id: couponId },
      include: {
        _count: { select: { claims: true } },
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Check if coupon is active and valid
    const now = new Date();
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'Coupon is no longer active' },
        { status: 400 }
      );
    }

    if (new Date(coupon.startDate) > now) {
      return NextResponse.json(
        { error: 'Coupon has not started yet' },
        { status: 400 }
      );
    }

    if (new Date(coupon.endDate) < now) {
      return NextResponse.json(
        { error: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // Check if max uses reached
    if (coupon.maxUses && coupon._count.claims >= coupon.maxUses) {
      return NextResponse.json(
        { error: 'Coupon has reached maximum uses' },
        { status: 400 }
      );
    }

    // Check if user already claimed this coupon
    const existingClaim = await db.couponClaim.findUnique({
      where: {
        couponId_userId: {
          couponId,
          userId: session.user.id,
        },
      },
    });

    if (existingClaim) {
      return NextResponse.json(
        { error: 'You have already claimed this coupon' },
        { status: 400 }
      );
    }

    // Create the claim
    const claim = await db.couponClaim.create({
      data: {
        couponId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    console.error('Error claiming coupon:', error);
    return NextResponse.json(
      { error: 'Failed to claim coupon' },
      { status: 500 }
    );
  }
}
