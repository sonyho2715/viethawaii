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

      // Update submission status
      await prisma.submission.update({
        where: { id },
        data: { status: 'rejected' },
      });

      return NextResponse.json({
        success: true,
        message: 'Submission rejected',
      });
    } catch (error) {
      console.error('Reject submission error:', error);
      return NextResponse.json(
        { error: 'Failed to reject submission' },
        { status: 500 }
      );
    }
  });
}
