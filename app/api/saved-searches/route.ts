import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const savedSearchSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  filters: z.object({
    category: z.string().optional(),
    island: z.string().optional(),
    priceRange: z.string().optional(),
    rating: z.number().optional(),
    search: z.string().optional(),
  }),
  frequency: z.enum(['instant', 'daily', 'weekly']).default('daily'),
});

// Get all saved searches for current user
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      savedSearches,
      count: savedSearches.length
    });
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new saved search
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = savedSearchSchema.parse(body);

    // Check if user already has a saved search with this name
    const existing = await prisma.savedSearch.findFirst({
      where: {
        userId: user.id,
        name: validated.name
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You already have a saved search with this name' },
        { status: 400 }
      );
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: user.id,
        name: validated.name,
        filters: validated.filters,
        frequency: validated.frequency
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Search saved successfully',
      savedSearch
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating saved search:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete saved search
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Search ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership before deleting
    const savedSearch = await prisma.savedSearch.findUnique({
      where: { id }
    });

    if (!savedSearch) {
      return NextResponse.json(
        { error: 'Saved search not found' },
        { status: 404 }
      );
    }

    if (savedSearch.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.savedSearch.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Saved search deleted'
    });
  } catch (error) {
    console.error('Error deleting saved search:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
