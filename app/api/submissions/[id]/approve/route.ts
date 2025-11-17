import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is admin
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Get submission
    const submission = await prisma.submission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    if (submission.type === 'business') {
      // Create business from submission data
      const businessData = submission.data as any;

      await prisma.business.create({
        data: {
          name: businessData.name,
          nameVi: businessData.nameVi,
          slug: businessData.slug,
          description: businessData.description,
          descriptionVi: businessData.descriptionVi,
          category: businessData.category,
          subcategory: businessData.subcategory,
          address: businessData.address,
          city: businessData.city,
          island: businessData.island,
          zipCode: businessData.zipCode,
          phone: businessData.phone,
          email: businessData.email,
          website: businessData.website,
          priceRange: businessData.priceRange,
          features: businessData.features || [],
          hours: businessData.hours || {},
          status: 'active',
          verified: true,
        },
      });
    }

    // Update submission status
    await prisma.submission.update({
      where: { id },
      data: { status: 'approved' },
    });

    return NextResponse.json({
      success: true,
      message: 'Submission approved and business created',
    });
  } catch (error) {
    console.error('Approve submission error:', error);
    return NextResponse.json(
      { error: 'Failed to approve submission' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
