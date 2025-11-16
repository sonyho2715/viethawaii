import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';

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
      const { id, type, ...data } = await req.json();

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
      const { type, ...data } = await req.json();

      if (type === 'news') {
        const article = await prisma.newsArticle.create({
          data: {
            title: data.title,
            titleVi: data.titleVi || null,
            slug: data.slug,
            content: data.content,
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
            type: data.type || 'feature',
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
      const { id, type } = await req.json();

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
