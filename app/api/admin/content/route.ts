import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { z } from 'zod';

const contentTypeSchema = z.enum(['news', 'blog', 'discover']);

const createContentSchema = z.object({
  type: contentTypeSchema,
  title: z.string().min(1, 'Title is required'),
  titleVi: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  description: z.string().optional(), // For discover items
  discoverType: z.string().optional(), // discover item type (event, place, etc.)
  author: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().url().optional().nullable(),
  published: z.boolean().optional(),
});

const updateContentSchema = z.object({
  id: z.string().uuid('Invalid content ID'),
  type: contentTypeSchema,
  title: z.string().min(1).optional(),
  titleVi: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
});

const deleteContentSchema = z.object({
  id: z.string().uuid('Invalid content ID'),
  type: contentTypeSchema,
});

export async function GET(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const type = searchParams.get('type'); // news, blog, discover

      if (type === 'news') {
        const articles = await prisma.newsArticle.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(
          articles.map(a => ({
            ...a,
            createdAt: a.createdAt.toISOString(),
            updatedAt: a.updatedAt.toISOString(),
            publishedAt: a.publishedAt?.toISOString() || null,
          }))
        );
      }

      if (type === 'blog') {
        const posts = await prisma.blogPost.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(
          posts.map(p => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
            publishedAt: p.publishedAt?.toISOString() || null,
          }))
        );
      }

      if (type === 'discover') {
        const items = await prisma.discoverItem.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(
          items.map(i => ({
            ...i,
            createdAt: i.createdAt.toISOString(),
            updatedAt: i.updatedAt.toISOString(),
          }))
        );
      }

      // Return all content if no type specified
      const [news, blogs, discover] = await Promise.all([
        prisma.newsArticle.count(),
        prisma.blogPost.count(),
        prisma.discoverItem.count(),
      ]);

      return NextResponse.json({
        news,
        blogs,
        discover,
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      return NextResponse.json(
        { error: 'Failed to fetch content' },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
    try {
      const body = await req.json();
      const validated = updateContentSchema.safeParse(body);

      if (!validated.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validated.error.issues },
          { status: 400 }
        );
      }

      const { id, type, ...data } = validated.data;

      if (type === 'news') {
        const article = await prisma.newsArticle.update({
          where: { id },
          data,
        });
        return NextResponse.json({
          ...article,
          createdAt: article.createdAt.toISOString(),
          updatedAt: article.updatedAt.toISOString(),
          publishedAt: article.publishedAt?.toISOString() || null,
        });
      }

      if (type === 'blog') {
        const post = await prisma.blogPost.update({
          where: { id },
          data,
        });
        return NextResponse.json({
          ...post,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
          publishedAt: post.publishedAt?.toISOString() || null,
        });
      }

      if (type === 'discover') {
        const item = await prisma.discoverItem.update({
          where: { id },
          data,
        });
        return NextResponse.json({
          ...item,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        });
      }

      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    } catch (error) {
      console.error('Error updating content:', error);
      return NextResponse.json(
        { error: 'Failed to update content' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
    try {
      const body = await req.json();
      const validated = createContentSchema.safeParse(body);

      if (!validated.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validated.error.issues },
          { status: 400 }
        );
      }

      const { type, ...data } = validated.data;

      if (type === 'news') {
        const article = await prisma.newsArticle.create({
          data: {
            title: data.title,
            titleVi: data.titleVi || null,
            slug: data.slug,
            content: data.content,
            excerpt: data.excerpt || '',
            author: data.author || 'Admin',
            category: data.category || 'Community',
            tags: data.tags || [],
            image: data.image || null,
            published: data.published !== undefined ? data.published : true,
            publishedAt: data.published ? new Date() : null,
          },
        });
        return NextResponse.json({
          ...article,
          createdAt: article.createdAt.toISOString(),
          updatedAt: article.updatedAt.toISOString(),
          publishedAt: article.publishedAt?.toISOString() || null,
        });
      }

      if (type === 'blog') {
        const post = await prisma.blogPost.create({
          data: {
            title: data.title,
            titleVi: data.titleVi || null,
            slug: data.slug,
            content: data.content,
            excerpt: data.excerpt || '',
            author: data.author || 'Admin',
            category: data.category || 'Lifestyle',
            tags: data.tags || [],
            image: data.image || null,
            published: data.published !== undefined ? data.published : true,
            publishedAt: data.published ? new Date() : null,
          },
        });
        return NextResponse.json({
          ...post,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
          publishedAt: post.publishedAt?.toISOString() || null,
        });
      }

      if (type === 'discover') {
        const item = await prisma.discoverItem.create({
          data: {
            title: data.title,
            titleVi: data.titleVi || null,
            slug: data.slug,
            description: data.description || data.content,
            content: data.content,
            type: data.discoverType || 'feature',
            category: data.category || '',
            image: data.image || null,
            published: data.published !== undefined ? data.published : true,
            featured: false,
          },
        });
        return NextResponse.json({
          ...item,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        });
      }

      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    } catch (error) {
      console.error('Error creating content:', error);
      return NextResponse.json(
        { error: 'Failed to create content' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
    try {
      const body = await req.json();
      const validated = deleteContentSchema.safeParse(body);

      if (!validated.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validated.error.issues },
          { status: 400 }
        );
      }

      const { id, type } = validated.data;

      if (type === 'news') {
        await prisma.newsArticle.delete({ where: { id } });
      } else if (type === 'blog') {
        await prisma.blogPost.delete({ where: { id } });
      } else if (type === 'discover') {
        await prisma.discoverItem.delete({ where: { id } });
      } else {
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting content:', error);
      return NextResponse.json(
        { error: 'Failed to delete content' },
        { status: 500 }
      );
    }
  });
}
