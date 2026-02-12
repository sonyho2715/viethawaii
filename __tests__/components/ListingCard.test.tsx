import React from 'react';
import { render, screen } from '@testing-library/react';
import ListingCard, { ListingWithRelations } from '@/components/public/ListingCard';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock Language Context
jest.mock('@/context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'vn',
    t: {
      location: 'Vị trí',
    },
  }),
  LanguageProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockListing: ListingWithRelations = {
  id: 1,
  userId: 'user-1',
  categoryId: 1,
  neighborhoodId: 1,
  title: 'Test Listing',
  titleEn: 'Test Listing EN',
  description: 'Test Description',
  descriptionEn: 'Test Description EN',
  price: 100,
  priceType: 'FIXED',
  location: 'Honolulu',
  lat: null,
  lng: null,
  contactPhone: '123456789',
  contactEmail: 'test@example.com',
  zaloNumber: null,
  hidePhone: false,
  preferredContact: 'phone',
  status: 'ACTIVE',
  rejectionReason: null,
  isFeatured: false,
  featuredUntil: null,
  featuredTier: null,
  views: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  approvedAt: new Date().toISOString(),
  expiresAt: null,
  category: {
    id: 1,
    parentId: null,
    slug: 'nha-o',
    nameVn: 'Nhà ở',
    nameEn: 'Housing',
    icon: null,
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  images: [
    {
      id: 1,
      listingId: 1,
      imageUrl: 'https://example.com/image.jpg',
      thumbnailUrl: null,
      cloudinaryId: null,
      isPrimary: true,
      sortOrder: 1,
      createdAt: new Date().toISOString(),
    },
  ],
  neighborhood: {
    id: 1,
    nameVn: 'Ala Moana',
    nameEn: 'Ala Moana',
    slug: 'ala-moana',
  },
};

describe('ListingCard Component', () => {
  it('renders the listing title', () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText('Test Listing')).toBeInTheDocument();
  });

  it('renders the formatted price', () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('renders the location', () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText('Honolulu')).toBeInTheDocument();
  });

  it('renders "MỚI" badge for new listings', () => {
    render(<ListingCard listing={mockListing} />);
    expect(screen.getByText('MỚI')).toBeInTheDocument();
  });
});
