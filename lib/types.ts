import { Business, Review, NewsArticle, BlogPost, DiscoverItem, User } from '@prisma/client';
import { Category, Island, PriceRange, BusinessStatus, ContentStatus, UserRole } from './constants';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Business Types
export interface BusinessFormData {
  name: string;
  nameVi?: string;
  description: string;
  descriptionVi?: string;
  category: string;
  subcategory?: string;
  address?: string;
  city: string;
  island: string;
  phone?: string;
  email?: string;
  website?: string;
  image?: string;
  images?: string[];
  priceRange?: string;
  features?: string[];
  hours?: BusinessHours;
}

export interface BusinessHours {
  monday?: { open: string; close: string; closed?: boolean };
  tuesday?: { open: string; close: string; closed?: boolean };
  wednesday?: { open: string; close: string; closed?: boolean };
  thursday?: { open: string; close: string; closed?: boolean };
  friday?: { open: string; close: string; closed?: boolean };
  saturday?: { open: string; close: string; closed?: boolean };
  sunday?: { open: string; close: string; closed?: boolean };
}

export interface BusinessWithReviews extends Business {
  reviews?: Review[];
}

// Review Types
export interface ReviewFormData {
  businessId: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  rating: number;
  content: string;
  title?: string;
}

export interface ReviewWithBusiness extends Review {
  business?: Business;
}

// Content Types
export interface NewsArticleFormData {
  title: string;
  titleVi?: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image?: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  publishedAt?: Date;
}

export interface BlogPostFormData {
  title: string;
  titleVi?: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image?: string;
  category: string;
  tags?: string[];
  readTime?: number;
  featured?: boolean;
  published?: boolean;
  publishedAt?: Date;
}

export interface DiscoverItemFormData {
  title: string;
  titleVi?: string;
  slug: string;
  description: string;
  descriptionVi?: string;
  content: string;
  contentVi?: string;
  image?: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthSession {
  user: SessionUser;
  expires: string;
}

// Filter Types
export interface BusinessFilters {
  search?: string;
  category?: Category;
  island?: Island;
  priceRange?: PriceRange;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ContentFilters {
  category?: string;
  featured?: boolean;
  published?: boolean;
  page?: number;
  pageSize?: number;
}

// Admin Types
export interface AdminStats {
  totalBusinesses: number;
  activeBusinesses: number;
  pendingBusinesses: number;
  totalReviews: number;
  totalUsers: number;
  recentBusinesses: Business[];
  recentReviews: Review[];
}

export interface UpdateBusinessStatusPayload {
  status: BusinessStatus;
  rejectionReason?: string;
}

// Validation Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrors {
  errors: ValidationError[];
}

// Search Types
export interface SearchParams {
  query: string;
  type?: 'businesses' | 'content' | 'all';
  filters?: BusinessFilters;
}

export interface SearchResult {
  businesses: Business[];
  newsArticles: NewsArticle[];
  blogPosts: BlogPost[];
  discoverItems: DiscoverItem[];
}

// Image Upload Types
export interface ImageUploadResult {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
}
