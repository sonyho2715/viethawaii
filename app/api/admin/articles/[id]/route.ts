import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const updateArticleSchema = z.object({
  titleVn: z.string().min(5).max(500).optional(),
  titleEn: z.string().max(500).optional().nullable(),
  slug: z.string().min(3).max(200).optional(),
  excerptVn: z.string().max(1000).optional().nullable(),
  excerptEn: z.string().max(1000).optional().nullable(),
  contentVn: z.string().min(10).optional(),
  contentEn: z.string().optional().nullable(),
  categoryId: z.number().int().optional(),
  featuredImage: z.string().url().optional().nullable().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single article
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
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'ID không hợp lệ' },
        { status: 400 }
      );
    }

    const article = await db.article.findUnique({
      where: { id: articleId },
      include: {
        category: true,
        author: {
          select: { name: true, email: true },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Bài viết không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('Get article error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
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
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'ID không hợp lệ' },
        { status: 400 }
      );
    }

    const existingArticle = await db.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Bài viết không tồn tại' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validated = updateArticleSchema.parse(body);

    // Check slug uniqueness if changing slug
    if (validated.slug && validated.slug !== existingArticle.slug) {
      const slugExists = await db.article.findUnique({
        where: { slug: validated.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Slug đã tồn tại' },
          { status: 400 }
        );
      }
    }

    // Verify category exists if changing category
    if (validated.categoryId) {
      const category = await db.contentCategory.findUnique({
        where: { id: validated.categoryId },
      });
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Danh mục không tồn tại' },
          { status: 400 }
        );
      }
    }

    // Handle publishedAt based on status change
    let publishedAt = existingArticle.publishedAt;
    if (validated.status === 'PUBLISHED' && existingArticle.status !== 'PUBLISHED') {
      publishedAt = new Date();
    } else if (validated.status && validated.status !== 'PUBLISHED') {
      publishedAt = null;
    }

    const article = await db.article.update({
      where: { id: articleId },
      data: {
        ...validated,
        featuredImage: validated.featuredImage || null,
        publishedAt,
      },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update article error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (for status toggle)
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
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'ID không hợp lệ' },
        { status: 400 }
      );
    }

    const existingArticle = await db.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Bài viết không tồn tại' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Trạng thái không hợp lệ' },
        { status: 400 }
      );
    }

    // Handle publishedAt based on status change
    let publishedAt = existingArticle.publishedAt;
    if (status === 'PUBLISHED' && existingArticle.status !== 'PUBLISHED') {
      publishedAt = new Date();
    } else if (status !== 'PUBLISHED') {
      publishedAt = null;
    }

    const article = await db.article.update({
      where: { id: articleId },
      data: {
        status,
        publishedAt,
      },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('Patch article error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
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
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'ID không hợp lệ' },
        { status: 400 }
      );
    }

    const existingArticle = await db.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Bài viết không tồn tại' },
        { status: 404 }
      );
    }

    await db.article.delete({
      where: { id: articleId },
    });

    return NextResponse.json({ success: true, message: 'Đã xóa bài viết' });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
