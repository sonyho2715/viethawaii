import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const bulkActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'delete', 'feature']),
  listingIds: z.array(z.number().int().positive()).min(1).max(100),
  rejectionReason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = bulkActionSchema.parse(body);

    let result: { count: number };

    switch (validated.action) {
      case 'approve':
        result = await db.listing.updateMany({
          where: { id: { in: validated.listingIds } },
          data: {
            status: 'ACTIVE',
            approvedAt: new Date(),
          },
        });
        break;

      case 'reject':
        result = await db.listing.updateMany({
          where: { id: { in: validated.listingIds } },
          data: {
            status: 'REJECTED',
            rejectionReason: validated.rejectionReason || null,
          },
        });
        break;

      case 'delete':
        result = await db.listing.deleteMany({
          where: { id: { in: validated.listingIds } },
        });
        break;

      case 'feature':
        result = await db.listing.updateMany({
          where: { id: { in: validated.listingIds } },
          data: {
            isFeatured: true,
            featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log admin action
    try {
      await db.adminLog.create({
        data: {
          adminId: session.user.id,
          action: `BULK_${validated.action.toUpperCase()}`,
          targetType: 'LISTING',
          details: `Bulk ${validated.action} on ${validated.listingIds.length} listings: [${validated.listingIds.join(', ')}]`,
        },
      });
    } catch {
      // AdminLog might not exist yet, don't block the operation
    }

    return NextResponse.json({
      success: true,
      count: result.count,
      action: validated.action,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Bulk action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
}
