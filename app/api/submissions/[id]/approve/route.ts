import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { requireCsrfToken } from '@/lib/csrf';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return requireCsrfToken(request, async (req) => {
    try {
      // Check if user is authenticated and is admin
      await requireAdmin();

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
        const businessData = submission.data as Record<string, unknown>;

        await prisma.business.create({
          data: {
            name: businessData.name as string,
            nameVi: businessData.nameVi as string | undefined,
            slug: businessData.slug as string,
            description: businessData.description as string,
            descriptionVi: businessData.descriptionVi as string | undefined,
            category: businessData.category as string,
            subcategory: businessData.subcategory as string | undefined,
            address: businessData.address as string,
            city: businessData.city as string,
            island: businessData.island as string,
            zipCode: businessData.zipCode as string | undefined,
            phone: businessData.phone as string | undefined,
            email: businessData.email as string | undefined,
            website: businessData.website as string | undefined,
            priceRange: businessData.priceRange as string | undefined,
            features: (businessData.features as string[]) || [],
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
    }
  });
}
