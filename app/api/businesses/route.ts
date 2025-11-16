import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createBusinessSchema, validate } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const island = searchParams.get('island');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const where: any = {
      status: 'active',
    };

    if (island && island !== 'All') {
      where.island = island;
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const businesses = await prisma.business.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using Zod schema
    const validation = validate(createBusinessSchema, body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors
      }, { status: 400 });
    }

    // Check for duplicate slug
    const existing = await prisma.business.findUnique({
      where: { slug: validation.data.slug }
    });

    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'A business with this name already exists'
      }, { status: 409 });
    }

    // Create business with validated data
    const business = await prisma.business.create({
      data: {
        ...validation.data,
        status: 'pending', // Require approval
        rating: 0,
        reviewCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: business,
      message: 'Business submitted successfully and is pending approval'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create business. Please try again.'
    }, { status: 500 });
  }
}
