import { Suspense } from 'react';
import { db } from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import JobsClient, { type JobListing } from './JobsClient';
import type { Metadata } from 'next';
import type { SerializedCategory, SerializedNeighborhood } from '@/components/public/ListingCard';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Việc làm - Tìm việc trong cộng đồng Việt Hawaii',
  description: 'Tìm việc làm từ cộng đồng Việt Nam tại Hawaii. Nhà hàng, nail/spa, văn phòng, xây dựng và nhiều ngành nghề khác.',
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    jobType?: string;
    neighborhood?: string;
    sort?: string;
    page?: string;
  }>;
}

async function getJobCategories() {
  // Get viec-lam parent and its children
  const parent = await db.category.findUnique({
    where: { slug: 'viec-lam' },
  });

  if (!parent) return [];

  const categories = await db.category.findMany({
    where: {
      OR: [
        { id: parent.id },
        { parentId: parent.id },
      ],
      isActive: true,
    },
    orderBy: { sortOrder: 'asc' },
  });

  return categories;
}

async function getNeighborhoods() {
  return db.neighborhood.findMany({
    orderBy: { name: 'asc' },
  });
}

async function getJobs(params: {
  category?: string;
  q?: string;
  jobType?: string;
  neighborhood?: string;
  sort?: string;
  page?: string;
}) {
  const page = parseInt(params.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    status: 'ACTIVE',
    listingType: 'JOB',
  };

  if (params.category) {
    const category = await db.category.findUnique({
      where: { slug: params.category },
    });
    if (category) {
      const categoryIds = [category.id];
      const children = await db.category.findMany({
        where: { parentId: category.id },
        select: { id: true },
      });
      categoryIds.push(...children.map(c => c.id));
      where.categoryId = { in: categoryIds };
    }
  } else {
    // Default to all job categories
    const jobParent = await db.category.findUnique({
      where: { slug: 'viec-lam' },
    });
    if (jobParent) {
      const jobCategories = await db.category.findMany({
        where: {
          OR: [
            { id: jobParent.id },
            { parentId: jobParent.id },
          ],
        },
        select: { id: true },
      });
      where.categoryId = { in: jobCategories.map(c => c.id) };
    }
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { titleEn: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
    ];
  }

  if (params.jobType) {
    where.jobType = params.jobType;
  }

  if (params.neighborhood) {
    const neighborhood = await db.neighborhood.findUnique({
      where: { slug: params.neighborhood },
    });
    if (neighborhood) {
      where.neighborhoodId = neighborhood.id;
    }
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' };
  if (params.sort === 'views') orderBy = { views: 'desc' };

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        neighborhood: true,
      },
      orderBy: [{ isFeatured: 'desc' }, orderBy],
      skip,
      take: limit,
    }),
    db.listing.count({ where }),
  ]);

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [categories, neighborhoods, { listings, pagination }] = await Promise.all([
    getJobCategories(),
    getNeighborhoods(),
    getJobs(params),
  ]);

  const serializedCategories = serializeArray(categories) as unknown as SerializedCategory[];
  const serializedNeighborhoods = serializeArray(neighborhoods) as unknown as SerializedNeighborhood[];
  const serializedListings = serializeArray(listings) as unknown as JobListing[];

  return (
    <Suspense fallback={<JobsLoadingSkeleton />}>
      <JobsClient
        categories={serializedCategories}
        neighborhoods={serializedNeighborhoods}
        initialListings={serializedListings}
        pagination={pagination}
        searchParams={params}
      />
    </Suspense>
  );
}

function JobsLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-48" />
          ))}
        </div>
      </div>
    </div>
  );
}
