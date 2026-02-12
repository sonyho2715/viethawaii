import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { serialize, serializeArray } from '@/lib/serialize';
import JobDetailClient, { type JobListing } from './JobDetailClient';
import type { ListingWithRelations } from '@/components/public/ListingCard';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) return { title: 'Việc làm không tồn tại' };

  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { category: true },
  });

  if (!listing) {
    return { title: 'Việc làm không tồn tại' };
  }

  return {
    title: `${listing.title} - Việc Làm Hawaii`,
    description: listing.description?.slice(0, 160) || `${listing.title} - Xem chi tiết việc làm trên VietHawaii`,
    openGraph: {
      title: listing.title,
      description: listing.description?.slice(0, 160),
    },
  };
}

async function getJob(id: number) {
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

async function getRelatedJobs(listing: NonNullable<Awaited<ReturnType<typeof getJob>>>) {
  return db.listing.findMany({
    where: {
      id: { not: listing.id },
      status: 'ACTIVE',
      listingType: 'JOB',
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

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) notFound();

  const [listing, session] = await Promise.all([
    getJob(listingId),
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

  const relatedJobs = await getRelatedJobs(listing);

  const serializedListing = serialize(listing) as unknown as JobListing;
  const serializedRelated = serializeArray(relatedJobs) as unknown as ListingWithRelations[];

  return (
    <JobDetailClient
      listing={serializedListing}
      relatedJobs={serializedRelated}
      isOwner={isOwner}
      currentUserId={session?.user?.id}
    />
  );
}
