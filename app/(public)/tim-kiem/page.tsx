import { Suspense } from 'react';
import { db } from '@/lib/db';
import SearchClient from './SearchClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tìm kiếm - VietHawaii',
  description: 'Tìm kiếm tin rao vặt, việc làm, nhà thuê và nhiều hơn nữa',
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    neighborhood?: string;
    sort?: string;
    page?: string;
  }>;
}

async function getCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
  });
}

async function getNeighborhoods() {
  return db.neighborhood.findMany({
    orderBy: { name: 'asc' },
  });
}

async function searchListings(params: {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  neighborhood?: string;
  sort?: string;
  page?: string;
}) {
  const page = parseInt(params.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    status: 'ACTIVE',
  };

  // Search query (required for this page)
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { titleEn: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
    ];
  }

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
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) {
      (where.price as Record<string, unknown>).gte = parseFloat(params.minPrice);
    }
    if (params.maxPrice) {
      (where.price as Record<string, unknown>).lte = parseFloat(params.maxPrice);
    }
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
  if (params.sort === 'price_asc') orderBy = { price: 'asc' };
  if (params.sort === 'price_desc') orderBy = { price: 'desc' };
  if (params.sort === 'views') orderBy = { views: 'desc' };
  if (params.sort === 'relevance' && params.q) {
    // For relevance, we prioritize title matches
    orderBy = { createdAt: 'desc' };
  }

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

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [categories, neighborhoods, { listings, pagination }] = await Promise.all([
    getCategories(),
    getNeighborhoods(),
    searchListings(params),
  ]);

  return (
    <Suspense fallback={<SearchLoadingSkeleton />}>
      <SearchClient
        categories={categories}
        neighborhoods={neighborhoods}
        listings={listings}
        pagination={pagination}
        searchParams={params}
      />
    </Suspense>
  );
}

function SearchLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-full mb-6" />
        <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-72" />
          ))}
        </div>
      </div>
    </div>
  );
}
