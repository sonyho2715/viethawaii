import { db } from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import HomeClient from '@/components/public/HomeClient';
import type { ListingWithRelations, SerializedCategory } from '@/components/public/ListingCard';

// Fetch categories from database
async function getCategories() {
  const categories = await db.category.findMany({
    where: {
      parentId: null,
      isActive: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });
  return categories;
}

// Fetch featured listings
async function getFeaturedListings() {
  const listings = await db.listing.findMany({
    where: {
      status: 'ACTIVE',
      isFeatured: true,
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      neighborhood: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
  });
  return listings;
}

// Fetch latest listings
async function getLatestListings() {
  const listings = await db.listing.findMany({
    where: {
      status: 'ACTIVE',
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      neighborhood: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 8,
  });
  return listings;
}

export default async function HomePage() {
  const [categories, featuredListings, latestListings] = await Promise.all([
    getCategories(),
    getFeaturedListings(),
    getLatestListings(),
  ]);

  // Serialize data to convert Prisma Decimal/Date types to JSON-safe values
  const serializedCategories = serializeArray(categories) as unknown as SerializedCategory[];
  const serializedFeatured = serializeArray(featuredListings) as unknown as ListingWithRelations[];
  const serializedLatest = serializeArray(latestListings) as unknown as ListingWithRelations[];

  return (
    <HomeClient
      categories={serializedCategories}
      featuredListings={serializedFeatured}
      latestListings={serializedLatest}
    />
  );
}
