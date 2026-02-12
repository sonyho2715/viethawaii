import { db } from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import HomeClient from '@/components/public/HomeClient';
import type { ListingWithRelations, SerializedCategory } from '@/components/public/ListingCard';
import type { SerializedArticle } from '@/components/public/NewsCard';
import StructuredData from '@/components/public/StructuredData';

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

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VietHawaii',
    url: 'https://viethawaii.com',
    description: 'Cộng đồng Việt Nam tại Hawaii. Rao vặt, việc làm, nhà thuê, tin tức.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://viethawaii.com/tim-kiem?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <StructuredData data={websiteSchema} />
      <HomeClient
        categories={serializedCategories}
        featuredListings={serializedFeatured}
        latestListings={serializedLatest}
        latestArticles={serializedArticles}
        totalListings={totalListings}
      />
    </>
  );
}
