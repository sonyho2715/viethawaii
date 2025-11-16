// Shared constants used across the application

export const CATEGORIES = [
  'All',
  'Food & Dining',
  'Retail & Shopping',
  'Beauty & Wellness',
  'Health & Medical',
  'Professional Services',
  'Education & Training',
  'Automotive',
  'Home & Garden',
  'Entertainment & Events',
  'Technology',
  'Other Services'
] as const;

export const ISLANDS = [
  'All',
  'Oahu',
  'Maui',
  'Hawaii Island',
  'Kauai',
  'Molokai',
  'Lanai'
] as const;

export const PRICE_RANGES = ['All', '$', '$$', '$$$', '$$$$'] as const;

export const BUSINESS_STATUS = ['pending', 'active', 'inactive', 'rejected'] as const;

export const CONTENT_STATUS = ['draft', 'published', 'archived'] as const;

export const USER_ROLES = ['USER', 'ADMIN'] as const;

// Type exports
export type Category = typeof CATEGORIES[number];
export type Island = typeof ISLANDS[number];
export type PriceRange = typeof PRICE_RANGES[number];
export type BusinessStatus = typeof BUSINESS_STATUS[number];
export type ContentStatus = typeof CONTENT_STATUS[number];
export type UserRole = typeof USER_ROLES[number];

// API Configuration
export const API_ROUTES = {
  businesses: '/api/businesses',
  business: (slug: string) => `/api/businesses/${slug}`,
  news: '/api/news',
  newsArticle: (slug: string) => `/api/news/${slug}`,
  blog: '/api/blog',
  blogPost: (slug: string) => `/api/blog/${slug}`,
  discover: '/api/discover',
  reviews: '/api/reviews',
  admin: {
    businesses: '/api/admin/businesses',
    business: (id: string) => `/api/admin/businesses/${id}`,
    content: '/api/admin/content',
    contentItem: (id: string) => `/api/admin/content/${id}`,
    reviews: '/api/admin/reviews',
    users: '/api/admin/users',
    stats: '/api/admin/stats',
  },
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    session: '/api/auth/session',
  }
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

// Validation limits
export const VALIDATION = {
  business: {
    nameMin: 2,
    nameMax: 100,
    descriptionMax: 2000,
    phoneRegex: /^[\d\s\-\(\)]+$/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    websiteRegex: /^https?:\/\/.+/,
  },
  review: {
    contentMin: 10,
    contentMax: 1000,
    ratingMin: 1,
    ratingMax: 5,
  },
  content: {
    titleMin: 5,
    titleMax: 200,
    excerptMax: 500,
    contentMin: 50,
  }
} as const;
