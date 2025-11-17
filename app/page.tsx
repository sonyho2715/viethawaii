import BusinessesHomepage from '@/components/BusinessesHomepage';
import type { Business } from '@/types';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { createCachedFunction, CacheTags, CacheDurations } from '@/lib/cache';

export const metadata: Metadata = {
  title: 'Vietnamese Businesses Across Hawaii | VietHawaii',
  description: 'Discover authentic Vietnamese restaurants, shops, and services across Oahu, Maui, Big Island, Kauai, Molokai, and Lanai. Your complete Hawaiian Vietnamese community directory.',
  openGraph: {
    title: 'Vietnamese Businesses Across Hawaii | VietHawaii',
    description: 'Discover authentic Vietnamese restaurants, shops, and services across all Hawaiian islands.',
    images: ['/og-home.jpg'],
  },
};

const getCachedBusinesses = createCachedFunction(
  async (): Promise<Business[]> => {
    const businesses = await prisma.business.findMany({
      where: { status: 'active' },
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' }
      ]
    });
    return businesses.map(b => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));
  },
  ['homepage-businesses'],
  {
    tags: [CacheTags.businesses],
    revalidate: CacheDurations.medium, // 5 minutes
  }
);

async function getBusinesses(): Promise<Business[]> {
  return getCachedBusinesses();
}

export default async function Home() {
  const businesses = await getBusinesses();

  return <BusinessesHomepage businesses={businesses} />;
}
