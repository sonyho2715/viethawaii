import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';

const reportSchema = z.object({
  itemType: z.enum(['LISTING', 'ARTICLE', 'USER']),
  itemId: z.number().int().positive(),
  reason: z.string().min(1).max(50),
  details: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting using Redis in production (keyed by user ID for reports)
    const rateLimit = await checkRateLimit(`report:${session.user.id}`, 'api');

    if (!rateLimit.success) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { success: false, error: 'Too many reports. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const body = await request.json();

    // Validate input
    const validated = reportSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      );
    }

    const { itemType, itemId, reason, details } = validated.data;

    // Verify the item exists
    if (itemType === 'LISTING') {
      const listing = await db.listing.findUnique({
        where: { id: itemId },
        select: { id: true, userId: true },
      });

      if (!listing) {
        return NextResponse.json(
          { success: false, error: 'Listing not found' },
          { status: 404 }
        );
      }

      // Prevent self-reporting
      if (listing.userId === session.user.id) {
        return NextResponse.json(
          { success: false, error: 'You cannot report your own listing' },
          { status: 400 }
        );
      }
    }

    // Check for duplicate report
    const existingReport = await db.report.findFirst({
      where: {
        reporterId: session.user.id,
        itemType,
        itemId,
        status: { in: ['PENDING', 'REVIEWED'] },
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { success: false, error: 'You have already reported this item' },
        { status: 409 }
      );
    }

    // Create the report
    const report = await db.report.create({
      data: {
        reporterId: session.user.id,
        itemType,
        itemId,
        reason,
        details,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: report.id },
    });
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}
