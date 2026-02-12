import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { serialize, serializeArray } from '@/lib/serialize';
import HousingDetailClient from './HousingDetailClient';
import type { ListingWithRelations } from '@/components/public/ListingCard';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) return { title: 'Nhà ở không tồn tại' };

  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { category: true },
  });

  if (!listing) {
    return { title: 'Nhà ở không tồn tại' };
  }

  const priceText = listing.price ? `$${listing.price}/tháng` : '';
  const bedroomText = listing.bedrooms !== null
    ? (listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} phòng ngủ`)
    : '';

  return {
    title: `${listing.title} - Nhà Ở Hawaii`,
    description: `${bedroomText} ${priceText}. ${listing.description?.slice(0, 120) || listing.title}`,
    openGraph: {
      title: listing.title,
      description: listing.description?.slice(0, 160),
    },
  };
}

async function getHousing(id: number) {
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

async function getRelatedHousing(listing: NonNullable<Awaited<ReturnType<typeof getHousing>>>) {
  return db.listing.findMany({
    where: {
      id: { not: listing.id },
      status: 'ACTIVE',
      listingType: 'HOUSING',
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

export default async function HousingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) notFound();

  const [listing, session] = await Promise.all([
    getHousing(listingId),
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

  const relatedHousing = await getRelatedHousing(listing);

  const serializedListing = serialize(listing) as unknown as ListingWithRelations;
  const serializedRelated = serializeArray(relatedHousing) as unknown as ListingWithRelations[];

  return (
    <HousingDetailClient
      listing={serializedListing}
      relatedListings={serializedRelated}
      isOwner={isOwner}
      currentUserId={session?.user?.id}
    />
  );
}
