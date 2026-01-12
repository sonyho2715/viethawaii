import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { notifyListingSaved } from '@/lib/notifications';

// GET /api/saved - Get user's saved listings
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    // Check if a specific listing is saved
    if (listingId) {
      const saved = await db.savedItem.findUnique({
        where: {
          userId_itemType_itemId: {
            userId: session.user.id,
            itemType: 'LISTING',
            itemId: parseInt(listingId),
          },
        },
      });
      return NextResponse.json({ isSaved: !!saved });
    }

    // Get all saved items
    const savedItems = await db.savedItem.findMany({
      where: {
        userId: session.user.id,
        itemType: 'LISTING',
      },
      orderBy: { savedAt: 'desc' },
    });

    return NextResponse.json({ savedItems });
  } catch (error) {
    console.error('Error fetching saved items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved items' },
      { status: 500 }
    );
  }
}

// POST /api/saved - Save a listing
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Get listing to check if it exists and get owner info
    const listing = await db.listing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        userId: true,
        title: true,
        listingType: true,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Don't allow users to save their own listings
    if (listing.userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot save your own listing' },
        { status: 400 }
      );
    }

    // Check if already saved
    const existing = await db.savedItem.findUnique({
      where: {
        userId_itemType_itemId: {
          userId: session.user.id,
          itemType: 'LISTING',
          itemId: listingId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already saved', isSaved: true },
        { status: 400 }
      );
    }

    // Save the listing
    await db.savedItem.create({
      data: {
        userId: session.user.id,
        itemType: 'LISTING',
        itemId: listingId,
      },
    });

    // Notify the listing owner (don't wait for this)
    notifyListingSaved(
      listing.userId,
      listing.id,
      listing.title,
      listing.listingType,
      session.user.id,
      session.user.name || undefined
    ).catch(console.error);

    return NextResponse.json({ success: true, isSaved: true });
  } catch (error) {
    console.error('Error saving listing:', error);
    return NextResponse.json(
      { error: 'Failed to save listing' },
      { status: 500 }
    );
  }
}

// DELETE /api/saved - Unsave a listing
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    await db.savedItem.deleteMany({
      where: {
        userId: session.user.id,
        itemType: 'LISTING',
        itemId: parseInt(listingId),
      },
    });

    return NextResponse.json({ success: true, isSaved: false });
  } catch (error) {
    console.error('Error unsaving listing:', error);
    return NextResponse.json(
      { error: 'Failed to unsave listing' },
      { status: 500 }
    );
  }
}
