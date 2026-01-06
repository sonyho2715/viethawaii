import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const createCategorySchema = z.object({
  nameVn: z.string().min(2).max(100),
  nameEn: z.string().max(100).optional().nullable(),
  slug: z.string().min(2).max(100),
  type: z.enum(['NEWS', 'BLOG', 'VLOG', 'GUIDE']),
  color: z.string().max(20).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = createCategorySchema.parse(body);

    // Check slug is unique
    const existingSlug = await db.contentCategory.findUnique({
      where: { slug: validated.slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'Slug da ton tai' },
        { status: 400 }
      );
    }

    const category = await db.contentCategory.create({
      data: {
        nameVn: validated.nameVn,
        nameEn: validated.nameEn || null,
        slug: validated.slug,
        type: validated.type,
        color: validated.color || null,
        sortOrder: validated.sortOrder,
        isActive: validated.isActive,
      },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Du lieu khong hop le', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create category error:', error);
    return NextResponse.json(
      { success: false, error: 'Loi server' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const categories = await db.contentCategory.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Loi server' },
      { status: 500 }
    );
  }
}
