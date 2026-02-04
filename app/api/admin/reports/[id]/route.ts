import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'ACTIONED', 'DISMISSED']),
  actionTaken: z.string().max(1000).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const reportId = parseInt(id);

    if (isNaN(reportId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid report ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate input
    const validated = updateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      );
    }

    const { status, actionTaken } = validated.data;

    // Check if report exists
    const existingReport = await db.report.findUnique({
      where: { id: reportId },
    });

    if (!existingReport) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Update the report
    const report = await db.report.update({
      where: { id: reportId },
      data: {
        status,
        actionTaken,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const reportId = parseInt(id);

    if (isNaN(reportId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid report ID' },
        { status: 400 }
      );
    }

    await db.report.delete({
      where: { id: reportId },
    });

    return NextResponse.json({
      success: true,
      message: 'Report deleted',
    });
  } catch (error) {
    console.error('Delete report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
