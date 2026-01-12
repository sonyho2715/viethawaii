import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const listingId = parseInt(id, 10);

    if (isNaN(listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    // Verify listing exists
    const listing = await db.listing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Get user session if logged in
    const session = await auth();
    const userId = session?.user?.id;

    // Get or generate session ID for anonymous tracking
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('vh_session_id')?.value;

    // Parse request body for additional tracking data
    let referrer: string | null = null;
    try {
      const body = await req.json();
      referrer = body.referrer || null;
    } catch {
      // Body might be empty
    }

    // Create view record
    await db.listingView.create({
      data: {
        listingId,
        userId: userId || null,
        sessionId: sessionId || null,
        referrer,
      },
    });

    // Also increment the views counter on the listing for quick access
    await db.listing.update({
      where: { id: listingId },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}
