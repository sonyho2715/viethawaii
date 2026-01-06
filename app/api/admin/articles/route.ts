import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const createArticleSchema = z.object({
  titleVn: z.string().min(5).max(500),
  titleEn: z.string().max(500).optional().nullable(),
  slug: z.string().min(3).max(200),
  excerptVn: z.string().max(1000).optional().nullable(),
  excerptEn: z.string().max(1000).optional().nullable(),
  contentVn: z.string().min(10),
  contentEn: z.string().optional().nullable(),
  categoryId: z.number().int(),
  featuredImage: z.string().url().optional().nullable().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
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
    const validated = createArticleSchema.parse(body);

    // Check slug is unique
    const existingSlug = await db.article.findUnique({
      where: { slug: validated.slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'Slug đã tồn tại' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await db.contentCategory.findUnique({
      where: { id: validated.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Danh mục không tồn tại' },
        { status: 400 }
      );
    }

    const article = await db.article.create({
      data: {
        authorId: session.user.id,
        categoryId: validated.categoryId,
        slug: validated.slug,
        titleVn: validated.titleVn,
        titleEn: validated.titleEn || null,
        excerptVn: validated.excerptVn || null,
        excerptEn: validated.excerptEn || null,
        contentVn: validated.contentVn,
        contentEn: validated.contentEn || null,
        featuredImage: validated.featuredImage || null,
        status: validated.status,
        publishedAt: validated.status === 'PUBLISHED' ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create article error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
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

    const articles = await db.article.findMany({
      include: {
        category: true,
        author: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error('Get articles error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
