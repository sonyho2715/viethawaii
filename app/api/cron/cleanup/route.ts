import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { del } from '@vercel/blob';

// This endpoint is called by Vercel Cron to clean up expired listings
// Runs daily at midnight UTC

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();

    // Find all expired listings with their images
    const expiredListings = await db.listing.findMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
      include: {
        images: true,
      },
    });

    if (expiredListings.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No expired listings found',
        deleted: 0,
      });
    }

    // Collect all image URLs to delete from Vercel Blob
    const imageUrls: string[] = [];
    for (const listing of expiredListings) {
      for (const image of listing.images) {
        if (image.imageUrl.includes('blob.vercel-storage.com')) {
          imageUrls.push(image.imageUrl);
        }
      }
    }

    // Delete images from Vercel Blob
    if (imageUrls.length > 0) {
      await Promise.all(imageUrls.map(url => del(url).catch(() => {})));
    }

    // Delete expired listings (cascade will delete images records)
    const deleteResult = await db.listing.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    console.log(`Cleanup: Deleted ${deleteResult.count} expired listings and ${imageUrls.length} images`);

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleteResult.count} expired listings`,
      deleted: deleteResult.count,
      imagesDeleted: imageUrls.length,
    });
  } catch (error) {
    console.error('Cleanup cron error:', error);
    return NextResponse.json(
      { success: false, error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}
