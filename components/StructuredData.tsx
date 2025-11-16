import { Business } from '@/types';

interface StructuredDataProps {
  business?: Business;
  type?: 'organization' | 'business' | 'breadcrumb';
}

export default function StructuredData({ business, type = 'organization' }: StructuredDataProps) {
  const getOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VietHawaii',
    description: 'Vietnamese Businesses Directory across Hawaii',
    url: 'https://viethawaii.com',
    logo: 'https://viethawaii.com/logo.png',
    sameAs: [
      'https://www.facebook.com/viethawaii',
      'https://www.instagram.com/viethawaii',
      'https://twitter.com/viethawaii'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@viethawaii.com'
    }
  });

  const getBusinessSchema = () => {
    if (!business) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: business.name,
      image: business.image || 'https://viethawaii.com/default-business.jpg',
      description: business.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address,
        addressLocality: business.city,
        addressRegion: 'HI',
        postalCode: business.zipCode,
        addressCountry: 'US'
      },
      geo: business.lat && business.lng ? {
        '@type': 'GeoCoordinates',
        latitude: business.lat,
        longitude: business.lng
      } : undefined,
      telephone: business.phone,
      url: business.website || `https://viethawaii.com/business/${business.slug}`,
      priceRange: business.priceRange,
      aggregateRating: business.rating && business.reviewCount ? {
        '@type': 'AggregateRating',
        ratingValue: business.rating,
        reviewCount: business.reviewCount
      } : undefined,
      openingHoursSpecification: business.hours ? Object.entries(business.hours).map(([day, hours]: [string, any]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day,
        opens: hours.closed ? undefined : hours.open,
        closes: hours.closed ? undefined : hours.close
      })).filter(spec => spec.opens) : undefined
    };
  };

  const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://viethawaii.com${item.url}`
    }))
  });

  let schema;
  switch (type) {
    case 'business':
      schema = getBusinessSchema();
      break;
    case 'breadcrumb':
      schema = getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Businesses', url: '/businesses' }
      ]);
      break;
    case 'organization':
    default:
      schema = getOrganizationSchema();
      break;
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
