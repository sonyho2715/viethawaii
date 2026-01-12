import { Suspense } from 'react';
import { db } from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import ServicesClient from './ServicesClient';
import type { Metadata } from 'next';
import type { SerializedCategory, SerializedNeighborhood, ListingWithRelations } from '@/components/public/ListingCard';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dịch vụ - Tìm dịch vụ trong cộng đồng Việt Hawaii',
  description: 'Tìm dịch vụ luật sư, kế toán, phiên dịch, sửa chữa và nhiều dịch vụ khác từ cộng đồng Việt Hawaii.',
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    neighborhood?: string;
    sort?: string;
    page?: string;
  }>;
}

async function getServiceCategories() {
  const parent = await db.category.findUnique({
    where: { slug: 'dich-vu' },
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

async function getServices(params: {
  category?: string;
  q?: string;
  neighborhood?: string;
  sort?: string;
  page?: string;
}) {
  const page = parseInt(params.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    status: 'ACTIVE',
    listingType: 'SERVICE',
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
    const serviceParent = await db.category.findUnique({
      where: { slug: 'dich-vu' },
    });
    if (serviceParent) {
      const serviceCategories = await db.category.findMany({
        where: {
          OR: [
            { id: serviceParent.id },
            { parentId: serviceParent.id },
          ],
        },
        select: { id: true },
      });
      where.categoryId = { in: serviceCategories.map(c => c.id) };
    }
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { titleEn: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
    ];
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

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [categories, neighborhoods, { listings, pagination }] = await Promise.all([
    getServiceCategories(),
    getNeighborhoods(),
    getServices(params),
  ]);

  const serializedCategories = serializeArray(categories) as unknown as SerializedCategory[];
  const serializedNeighborhoods = serializeArray(neighborhoods) as unknown as SerializedNeighborhood[];
  const serializedListings = serializeArray(listings) as unknown as ListingWithRelations[];

  return (
    <Suspense fallback={<ServicesLoadingSkeleton />}>
      <ServicesClient
        categories={serializedCategories}
        neighborhoods={serializedNeighborhoods}
        initialListings={serializedListings}
        pagination={pagination}
        searchParams={params}
      />
    </Suspense>
  );
}

function ServicesLoadingSkeleton() {
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
