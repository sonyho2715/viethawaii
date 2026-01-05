import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { serialize, serializeArray } from '@/lib/serialize';
import ListingDetailClient, { type ListingWithDetails } from './ListingDetailClient';
import type { ListingWithRelations } from '@/components/public/ListingCard';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) return { title: 'Tin đăng không tồn tại' };

  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { category: true },
  });

  if (!listing) {
    return { title: 'Tin đăng không tồn tại' };
  }

  return {
    title: `${listing.title} - Rao vặt Hawaii`,
    description: listing.description?.slice(0, 160) || `${listing.title} - Xem chi tiết tin đăng trên VietHawaii`,
    openGraph: {
      title: listing.title,
      description: listing.description?.slice(0, 160),
    },
  };
}

async function getListing(id: number) {
  const listing = await db.listing.findUnique({
    where: { id },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      neighborhood: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              listings: {
                where: { status: 'ACTIVE' },
              },
            },
          },
        },
      },
    },
  });

  if (listing) {
    // Increment view count
    await db.listing.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  return listing;
}

async function getRelatedListings(listing: NonNullable<Awaited<ReturnType<typeof getListing>>>) {
  return db.listing.findMany({
    where: {
      id: { not: listing.id },
      status: 'ACTIVE',
      categoryId: listing.categoryId,
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      neighborhood: true,
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) notFound();

  const listing = await getListing(listingId);

  if (!listing || listing.status !== 'ACTIVE') {
    notFound();
  }

  const relatedListings = await getRelatedListings(listing);

  // Serialize data to convert Prisma Decimal/Date types to JSON-safe values
  const serializedListing = serialize(listing) as unknown as ListingWithDetails;
  const serializedRelated = serializeArray(relatedListings) as unknown as ListingWithRelations[];

  return <ListingDetailClient listing={serializedListing} relatedListings={serializedRelated} />;
}
