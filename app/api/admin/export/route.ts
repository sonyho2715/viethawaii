import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { exportUsersCSV, exportListingsCSV, exportTransactionsCSV } from '@/lib/export';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || !['users', 'listings', 'transactions'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid export type. Must be: users, listings, or transactions' },
        { status: 400 }
      );
    }

    let csv: string;
    let filename: string;

    switch (type) {
      case 'users': {
        const users = await db.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            lastLogin: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        csv = exportUsersCSV(users);
        filename = `viethawaii-users-${new Date().toISOString().split('T')[0]}`;
        break;
      }

      case 'listings': {
        const listings = await db.listing.findMany({
          select: {
            id: true,
            title: true,
            price: true,
            status: true,
            listingType: true,
            location: true,
            views: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        csv = exportListingsCSV(
          listings.map((l) => ({
            ...l,
            price: l.price ? Number(l.price) : null,
          }))
        );
        filename = `viethawaii-listings-${new Date().toISOString().split('T')[0]}`;
        break;
      }

      case 'transactions': {
        const transactions = await db.transaction.findMany({
          select: {
            id: true,
            type: true,
            amount: true,
            currency: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        csv = exportTransactionsCSV(
          transactions.map((t) => ({
            ...t,
            amount: Number(t.amount),
          }))
        );
        filename = `viethawaii-transactions-${new Date().toISOString().split('T')[0]}`;
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Return CSV with proper headers
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
