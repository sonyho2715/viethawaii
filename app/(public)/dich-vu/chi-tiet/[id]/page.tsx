import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { serialize, serializeArray } from '@/lib/serialize';
import ServiceDetailClient from './ServiceDetailClient';
import type { ListingWithRelations } from '@/components/public/ListingCard';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) return { title: 'Dịch vụ không tồn tại' };

  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { category: true },
  });

  if (!listing) {
    return { title: 'Dịch vụ không tồn tại' };
  }

  return {
    title: `${listing.title} - Dịch Vụ VietHawaii`,
    description: listing.description?.slice(0, 160) || `${listing.title} - Xem chi tiết dịch vụ trên VietHawaii`,
    openGraph: {
      title: listing.title,
      description: listing.description?.slice(0, 160),
    },
  };
}

async function getService(id: number) {
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
    await db.listing.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  return listing;
}

async function getRelatedServices(listing: NonNullable<Awaited<ReturnType<typeof getService>>>) {
  return db.listing.findMany({
    where: {
      id: { not: listing.id },
      status: 'ACTIVE',
      listingType: 'SERVICE',
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

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) notFound();

  const [listing, session] = await Promise.all([
    getService(listingId),
    auth(),
  ]);

  if (!listing) {
    notFound();
  }

  const isOwner = session?.user?.id === listing.userId;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canView = listing.status === 'ACTIVE' || isOwner || isAdmin;

  if (!canView) {
    notFound();
  }

  const relatedServices = await getRelatedServices(listing);

  const serializedListing = serialize(listing) as unknown as ListingWithRelations;
  const serializedRelated = serializeArray(relatedServices) as unknown as ListingWithRelations[];

  return (
    <ServiceDetailClient
      listing={serializedListing}
      relatedListings={serializedRelated}
      isOwner={isOwner}
    />
  );
}
