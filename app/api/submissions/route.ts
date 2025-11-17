import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const businessSubmissionSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  nameVi: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  descriptionVi: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  island: z.string().min(1, 'Island is required'),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  priceRange: z.string().optional(),
  features: z.array(z.string()).optional(),
  hours: z.record(z.any()).optional(),
  submitterName: z.string().min(2, 'Your name is required'),
  submitterEmail: z.string().email('Valid email is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = businessSubmissionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create slug from business name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        type: 'business',
        email: data.submitterEmail,
        submittedBy: data.submitterName,
        status: 'pending',
        data: {
          name: data.name,
          nameVi: data.nameVi,
          slug,
          description: data.description,
          descriptionVi: data.descriptionVi,
          category: data.category,
          subcategory: data.subcategory,
          address: data.address,
          city: data.city,
          island: data.island,
          zipCode: data.zipCode,
          phone: data.phone,
          email: data.email,
          website: data.website,
          priceRange: data.priceRange,
          features: data.features || [],
          hours: data.hours || {},
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Business submitted successfully! It will be reviewed and published soon.',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit business' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';

    const submissions = await prisma.submission.findMany({
      where: {
        type: 'business',
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to get submissions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
