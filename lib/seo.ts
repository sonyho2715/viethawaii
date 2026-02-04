import { Metadata } from 'next';

const baseUrl = process.env.NEXTAUTH_URL || 'https://viethawaii.com';

/**
 * Default SEO metadata for the site
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'VietHawaii - Cộng đồng Việt Nam tại Hawaii',
    template: '%s | VietHawaii',
  },
  description:
    'Trang thông tin cộng đồng người Việt tại Hawaii. Rao vặt, việc làm, nhà ở, sự kiện, và tin tức cho người Việt Hawaii.',
  keywords: [
    'Vietnam Hawaii',
    'Vietnamese community Hawaii',
    'Việt kiều Hawaii',
    'rao vặt Hawaii',
    'việc làm Hawaii',
    'nhà ở Hawaii',
    'cộng đồng Việt Hawaii',
    'Vietnamese restaurant Hawaii',
    'Honolulu Vietnamese',
  ],
  authors: [{ name: 'VietHawaii' }],
  creator: 'VietHawaii',
  publisher: 'VietHawaii',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: 'en_US',
    url: baseUrl,
    siteName: 'VietHawaii',
    title: 'VietHawaii - Cộng đồng Việt Nam tại Hawaii',
    description:
      'Trang thông tin cộng đồng người Việt tại Hawaii. Rao vặt, việc làm, nhà ở, sự kiện, và tin tức.',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'VietHawaii - Vietnamese Community in Hawaii',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VietHawaii - Cộng đồng Việt Nam tại Hawaii',
    description:
      'Trang thông tin cộng đồng người Việt tại Hawaii. Rao vặt, việc làm, nhà ở, sự kiện, và tin tức.',
    images: [`${baseUrl}/og-image.jpg`],
  },
  verification: {
    // Add verification codes when available
    // google: 'google-site-verification-code',
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'vi-VN': baseUrl,
      'en-US': `${baseUrl}/en`,
    },
  },
};

/**
 * Generate metadata for a listing page
 */
export function generateListingMetadata({
  title,
  description,
  imageUrl,
  price,
  location,
  id,
  listingType,
}: {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  price?: string | null;
  location?: string | null;
  id: number;
  listingType: string;
}): Metadata {
  const prefix = listingType === 'JOB' ? 'viec-lam'
    : listingType === 'HOUSING' ? 'nha-o'
    : listingType === 'SERVICE' ? 'dich-vu'
    : 'rao-vat';

  const url = `${baseUrl}/${prefix}/${id}`;
  const desc = description
    ? description.slice(0, 160)
    : `${title}${location ? ` - ${location}` : ''}${price ? ` - ${price}` : ''}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 600, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for an article page
 */
export function generateArticleMetadata({
  title,
  excerpt,
  featuredImage,
  slug,
  publishedAt,
  authorName,
}: {
  title: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  slug: string;
  publishedAt?: Date | null;
  authorName?: string | null;
}): Metadata {
  const url = `${baseUrl}/tin-tuc/${slug}`;
  const desc = excerpt?.slice(0, 160) || title;

  return {
    title,
    description: desc,
    authors: authorName ? [{ name: authorName }] : undefined,
    openGraph: {
      title,
      description: desc,
      url,
      type: 'article',
      publishedTime: publishedAt?.toISOString(),
      authors: authorName ? [authorName] : undefined,
      images: featuredImage
        ? [{ url: featuredImage, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: featuredImage ? [featuredImage] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for an event page
 */
export function generateEventMetadata({
  title,
  description,
  imageUrl,
  id,
  startDate,
  location,
}: {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  id: number;
  startDate: Date;
  location?: string | null;
}): Metadata {
  const url = `${baseUrl}/su-kien/${id}`;
  const desc = description?.slice(0, 160) || `${title}${location ? ` tại ${location}` : ''}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url,
      type: 'article',
      publishedTime: startDate.toISOString(),
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}
