import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Find the photo
    const photo = await prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Check permissions: user must be the uploader or admin
    if (photo.uploadedBy !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to delete this photo' },
        { status: 403 }
      );
    }

    // Delete from Vercel Blob
    try {
      await del(photo.url);
    } catch (error) {
      console.error('Error deleting from blob storage:', error);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await prisma.photo.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    console.error('Photo deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Find the photo
    const photo = await prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Check permissions: user must be the uploader or admin
    if (photo.uploadedBy !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to update this photo' },
        { status: 403 }
      );
    }

    // Update photo metadata
    const updatedPhoto = await prisma.photo.update({
      where: { id },
      data: {
        caption: body.caption,
        featured: body.featured,
      },
      include: {
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
        business: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      photo: updatedPhoto,
      message: 'Photo updated successfully',
    });
  } catch (error) {
    console.error('Photo update error:', error);
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}
