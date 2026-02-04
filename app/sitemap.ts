import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://viethawaii.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/rao-vat`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/viec-lam`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nha-o`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dich-vu`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/su-kien`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/khuyen-mai`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cong-cu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Fetch active listings
  const listings = await db.listing.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, updatedAt: true, listingType: true },
    orderBy: { updatedAt: 'desc' },
    take: 1000, // Limit to prevent huge sitemaps
  });

  const listingPages: MetadataRoute.Sitemap = listings.map((listing) => {
    const prefix = listing.listingType === 'JOB' ? 'viec-lam'
      : listing.listingType === 'HOUSING' ? 'nha-o'
      : listing.listingType === 'SERVICE' ? 'dich-vu'
      : 'rao-vat';

    return {
      url: `${baseUrl}/${prefix}/${listing.id}`,
      lastModified: listing.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });

  // Fetch published articles
  const articles = await db.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
    take: 500,
  });

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/tin-tuc/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Fetch approved events
  const events = await db.event.findMany({
    where: { status: 'APPROVED' },
    select: { id: true, updatedAt: true },
    orderBy: { startDate: 'desc' },
    take: 500,
  });

  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/su-kien/${event.id}`,
    lastModified: event.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Fetch categories
  const categories = await db.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/rao-vat/danh-muc/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...listingPages,
    ...articlePages,
    ...eventPages,
  ];
}
