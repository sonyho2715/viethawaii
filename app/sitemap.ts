import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://viethawaii.com';

  // Static routes
  const routes = [
    '',
    '/rao-vat',
    '/tin-tuc',
    '/viec-lam',
    '/nha-o',
    '/dich-vu',
    '/cong-cu',
    '/gioi-thieu',
    '/lien-he',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Fetch all active listings
  const listings = await db.listing.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, updatedAt: true },
  });

  const listingUrls = listings.map((listing) => ({
    url: `${baseUrl}/rao-vat/chi-tiet/${listing.id}`,
    lastModified: listing.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fetch all published articles
  const articles = await db.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/tin-tuc/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...listingUrls, ...articleUrls];
}
