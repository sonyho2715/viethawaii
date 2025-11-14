import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const where: any = {
      published: true,
    };

    if (type) {
      where.type = type;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const items = await prisma.discoverItem.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching discover items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discover items' },
      { status: 500 }
    );
  }
}
