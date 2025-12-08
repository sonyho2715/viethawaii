import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return requireAdmin(request, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const type = searchParams.get('type');

      if (!type) {
        return NextResponse.json(
          { error: 'Type parameter is required' },
          { status: 400 }
        );
      }

      let content;
      if (type === 'news') {
        content = await prisma.newsArticle.findUnique({
          where: { id },
        });
      } else if (type === 'blog') {
        content = await prisma.blogPost.findUnique({
          where: { id },
        });
      } else if (type === 'discover') {
        content = await prisma.discoverItem.findUnique({
          where: { id },
        });
      } else {
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
      }

      if (!content) {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ...content,
        createdAt: content.createdAt.toISOString(),
        updatedAt: content.updatedAt.toISOString(),
        publishedAt: 'publishedAt' in content ? content.publishedAt?.toISOString() || null : null,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return requireAdmin(request, async (req, user) => {
    try {
      const { type, ...data } = await req.json();

      if (type === 'news') {
        const article = await prisma.newsArticle.update({
          where: { id },
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
            publishedAt: data.published ? (data.publishedAt || new Date()) : null,
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
        const post = await prisma.blogPost.update({
          where: { id },
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
            publishedAt: data.published ? (data.publishedAt || new Date()) : null,
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
        const item = await prisma.discoverItem.update({
          where: { id },
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
            featured: data.featured || false,
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
      console.error('Error updating content:', error);
      return NextResponse.json(
        { error: 'Failed to update content' },
        { status: 500 }
      );
    }
  });
}
