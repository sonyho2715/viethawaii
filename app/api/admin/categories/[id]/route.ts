import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const updateCategorySchema = z.object({
  nameVn: z.string().min(2).max(100).optional(),
  nameEn: z.string().max(100).optional().nullable(),
  slug: z.string().min(2).max(100).optional(),
  type: z.enum(['NEWS', 'BLOG', 'VLOG', 'GUIDE']).optional(),
  color: z.string().max(20).optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single category
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'ID khong hop le' },
        { status: 400 }
      );
    }

    const category = await db.contentCategory.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Danh muc khong ton tai' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Get category error:', error);
    return NextResponse.json(
      { success: false, error: 'Loi server' },
      { status: 500 }
    );
  }
}

// PUT - Full update
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'ID khong hop le' },
        { status: 400 }
      );
    }

    const existingCategory = await db.contentCategory.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Danh muc khong ton tai' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validated = updateCategorySchema.parse(body);

    // Check slug uniqueness if changing slug
    if (validated.slug && validated.slug !== existingCategory.slug) {
      const slugExists = await db.contentCategory.findUnique({
        where: { slug: validated.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Slug da ton tai' },
          { status: 400 }
        );
      }
    }

    const category = await db.contentCategory.update({
      where: { id: categoryId },
      data: validated,
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Du lieu khong hop le', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update category error:', error);
    return NextResponse.json(
      { success: false, error: 'Loi server' },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (for isActive toggle)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'ID khong hop le' },
        { status: 400 }
      );
    }

    const existingCategory = await db.contentCategory.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Danh muc khong ton tai' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isActive phai la boolean' },
        { status: 400 }
      );
    }

    const category = await db.contentCategory.update({
      where: { id: categoryId },
      data: { isActive },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Patch category error:', error);
    return NextResponse.json(
      { success: false, error: 'Loi server' },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'ID khong hop le' },
        { status: 400 }
      );
    }

    const existingCategory = await db.contentCategory.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Danh muc khong ton tai' },
        { status: 404 }
      );
    }

    // Prevent deletion if category has articles
    if (existingCategory._count.articles > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Khong the xoa danh muc nay vi con ${existingCategory._count.articles} bai viet. Hay chuyen bai viet sang danh muc khac truoc.`
        },
        { status: 400 }
      );
    }

    await db.contentCategory.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ success: true, message: 'Da xoa danh muc' });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, error: 'Loi server' },
      { status: 500 }
    );
  }
}
