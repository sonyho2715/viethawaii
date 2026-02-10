import { db } from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import HomeClient from '@/components/public/HomeClient';
import type { ListingWithRelations, SerializedCategory } from '@/components/public/ListingCard';
import type { SerializedArticle } from '@/components/public/NewsCard';

// Revalidate every 60 seconds to show fresh content
export const revalidate = 60;

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

// Fetch latest news articles
async function getLatestArticles() {
  const articles = await db.article.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      category: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 4,
  });
  return articles;
}

// Count total active listings for hero stats
async function getTotalListings() {
  const count = await db.listing.count({
    where: { status: 'ACTIVE' },
  });
  return count;
}

export default async function HomePage() {
  const [categories, featuredListings, latestListings, latestArticles, totalListings] = await Promise.all([
    getCategories(),
    getFeaturedListings(),
    getLatestListings(),
    getLatestArticles(),
    getTotalListings(),
  ]);

  // Serialize data to convert Prisma Decimal/Date types to JSON-safe values
  const serializedCategories = serializeArray(categories) as unknown as SerializedCategory[];
  const serializedFeatured = serializeArray(featuredListings) as unknown as ListingWithRelations[];
  const serializedLatest = serializeArray(latestListings) as unknown as ListingWithRelations[];
  const serializedArticles = serializeArray(latestArticles) as unknown as SerializedArticle[];

  return (
    <HomeClient
      categories={serializedCategories}
      featuredListings={serializedFeatured}
      latestListings={serializedLatest}
      latestArticles={serializedArticles}
      totalListings={totalListings}
    />
  );
}
