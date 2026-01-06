import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// One-time endpoint to add Travel category
// DELETE THIS FILE after running once
export async function GET() {
  try {
    const category = await db.contentCategory.upsert({
      where: { slug: 'du-lich' },
      update: {},
      create: {
        slug: 'du-lich',
        nameVn: 'Du lịch',
        nameEn: 'Travel',
        type: 'BLOG',
        color: '#06B6D4', // Cyan color
        sortOrder: 6,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Travel category created',
      category: {
        id: category.id,
        slug: category.slug,
        nameVn: category.nameVn,
      }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
