import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const photoUploadSchema = z.object({
  businessId: z.string().optional(),
  caption: z.string().max(200).optional(),
  featured: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const businessId = formData.get('businessId') as string | null;
    const caption = formData.get('caption') as string | null;
    const featured = formData.get('featured') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Create photo record in database
    const photo = await prisma.photo.create({
      data: {
        url: blob.url,
        caption: caption || null,
        businessId: businessId || null,
        uploadedBy: user.userId,
        featured,
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
      photo,
      message: 'Photo uploaded successfully',
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (businessId) where.businessId = businessId;
    if (userId) where.uploadedBy = userId;

    const photos = await prisma.photo.findMany({
      where,
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
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
