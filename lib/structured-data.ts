/**
 * JSON-LD Structured Data generators for SEO
 */

const baseUrl = process.env.NEXTAUTH_URL || 'https://viethawaii.com';

/**
 * Organization schema for the site
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VietHawaii',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Cộng đồng người Việt tại Hawaii - Vietnamese Community in Hawaii',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Honolulu',
      addressRegion: 'HI',
      addressCountry: 'US',
    },
    sameAs: [
      // Add social media links when available
      // 'https://facebook.com/viethawaii',
      // 'https://instagram.com/viethawaii',
    ],
  };
}

/**
 * WebSite schema for search appearance
 */
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VietHawaii',
    url: baseUrl,
    description: 'Trang thông tin cộng đồng người Việt tại Hawaii',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/rao-vat?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Product schema for listings
 */
export function getListingSchema({
  id,
  title,
  description,
  price,
  imageUrl,
  location,
  sellerName,
  createdAt,
  listingType,
}: {
  id: number;
  title: string;
  description?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  location?: string | null;
  sellerName?: string | null;
  createdAt: Date;
  listingType: string;
}) {
  const prefix = listingType === 'JOB' ? 'viec-lam'
    : listingType === 'HOUSING' ? 'nha-o'
    : listingType === 'SERVICE' ? 'dich-vu'
    : 'rao-vat';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description || title,
    url: `${baseUrl}/${prefix}/${id}`,
    image: imageUrl,
    offers: {
      '@type': 'Offer',
      price: price || 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: sellerName
        ? {
            '@type': 'Person',
            name: sellerName,
          }
        : undefined,
    },
    datePosted: createdAt.toISOString(),
    ...(location && {
      areaServed: {
        '@type': 'Place',
        name: location,
      },
    }),
  };
}

/**
 * JobPosting schema for job listings
 */
export function getJobSchema({
  id,
  title,
  description,
  salary,
  location,
  jobType,
  companyName,
  createdAt,
}: {
  id: number;
  title: string;
  description?: string | null;
  salary?: string | null;
  location?: string | null;
  jobType?: string | null;
  companyName?: string | null;
  createdAt: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description: description || title,
    url: `${baseUrl}/viec-lam/${id}`,
    datePosted: createdAt.toISOString(),
    employmentType: jobType?.toUpperCase() || 'FULL_TIME',
    hiringOrganization: companyName
      ? {
          '@type': 'Organization',
          name: companyName,
        }
      : undefined,
    jobLocation: location
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: location,
            addressRegion: 'HI',
            addressCountry: 'US',
          },
        }
      : undefined,
    ...(salary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          value: salary,
        },
      },
    }),
  };
}

/**
 * Article schema for news/blog posts
 */
export function getArticleSchema({
  slug,
  title,
  excerpt,
  featuredImage,
  authorName,
  publishedAt,
  updatedAt,
}: {
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  authorName?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt || title,
    url: `${baseUrl}/tin-tuc/${slug}`,
    image: featuredImage,
    datePublished: publishedAt?.toISOString(),
    dateModified: updatedAt?.toISOString() || publishedAt?.toISOString(),
    author: authorName
      ? {
          '@type': 'Person',
          name: authorName,
        }
      : {
          '@type': 'Organization',
          name: 'VietHawaii',
        },
    publisher: {
      '@type': 'Organization',
      name: 'VietHawaii',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };
}

/**
 * Event schema for community events
 */
export function getEventSchema({
  id,
  title,
  description,
  imageUrl,
  startDate,
  endDate,
  location,
  address,
  price,
  isFree,
  organizerName,
}: {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  startDate: Date;
  endDate?: Date | null;
  location?: string | null;
  address?: string | null;
  price?: number | null;
  isFree: boolean;
  organizerName?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    description: description || title,
    url: `${baseUrl}/su-kien/${id}`,
    image: imageUrl,
    startDate: startDate.toISOString(),
    endDate: endDate?.toISOString() || startDate.toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: location || 'Hawaii',
      address: address
        ? {
            '@type': 'PostalAddress',
            streetAddress: address,
            addressRegion: 'HI',
            addressCountry: 'US',
          }
        : undefined,
    },
    offers: {
      '@type': 'Offer',
      price: isFree ? 0 : price || 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    organizer: organizerName
      ? {
          '@type': 'Person',
          name: organizerName,
        }
      : {
          '@type': 'Organization',
          name: 'VietHawaii',
        },
  };
}

/**
 * BreadcrumbList schema for navigation
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}
