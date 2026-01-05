import Link from 'next/link';
import { db } from '@/lib/db';
import HomeClient from '@/components/public/HomeClient';

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
        where: { isPrimary: true },
        take: 1,
      },
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
        where: { isPrimary: true },
        take: 1,
      },
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

  return (
    <HomeClient
      categories={categories}
      featuredListings={featuredListings}
      latestListings={latestListings}
    />
  );
}
