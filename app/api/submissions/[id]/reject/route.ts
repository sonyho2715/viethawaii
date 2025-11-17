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

    // Update submission status
    const submission = await prisma.submission.update({
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
  } finally {
    await prisma.$disconnect();
  }
}
