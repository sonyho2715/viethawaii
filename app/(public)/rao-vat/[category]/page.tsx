import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ListingsClient from '../ListingsClient';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    neighborhood?: string;
    sort?: string;
    page?: string;
    featured?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await db.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    return { title: 'Danh mục không tồn tại' };
  }

  return {
    title: `${category.nameVn} - Rao vặt Hawaii`,
    description: `Xem tất cả tin đăng trong danh mục ${category.nameVn}. Tìm kiếm việc làm, nhà thuê, mua bán và nhiều hơn nữa.`,
  };
}

async function getCategory(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
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

async function getListings(categorySlug: string, params: {
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  neighborhood?: string;
  sort?: string;
  page?: string;
  featured?: string;
}) {
  const page = parseInt(params.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  const category = await db.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    return { listings: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }

  // Include this category and all its children
  const categoryIds = [category.id];
  const children = await db.category.findMany({
    where: { parentId: category.id },
    select: { id: true },
  });
  categoryIds.push(...children.map(c => c.id));

  const where: Record<string, unknown> = {
    status: 'ACTIVE',
    categoryId: { in: categoryIds },
  };

  if (params.featured === 'true') {
    where.isFeatured = true;
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { titleEn: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
    ];
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

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params;
  const searchParamsResolved = await searchParams;

  const category = await getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const [categories, neighborhoods, { listings, pagination }] = await Promise.all([
    getCategories(),
    getNeighborhoods(),
    getListings(categorySlug, searchParamsResolved),
  ]);

  return (
    <Suspense fallback={<CategoryLoadingSkeleton />}>
      <ListingsClient
        categories={categories}
        neighborhoods={neighborhoods}
        initialListings={listings}
        pagination={pagination}
        searchParams={{ ...searchParamsResolved, category: categorySlug }}
        currentCategory={category}
      />
    </Suspense>
  );
}

function CategoryLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-72" />
          ))}
        </div>
      </div>
    </div>
  );
}
