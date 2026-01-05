import type {
  User,
  Listing,
  ListingImage,
  Category,
  Neighborhood,
  Article,
  ContentCategory,
  Business,
  Review,
  ListingStatus,
  PriceType,
  Role,
  ArticleStatus,
  ArticleType,
} from '@prisma/client';

// Re-export Prisma types
export type {
  User,
  Listing,
  ListingImage,
  Category,
  Neighborhood,
  Article,
  ContentCategory,
  Business,
  Review,
  ListingStatus,
  PriceType,
  Role,
  ArticleStatus,
  ArticleType,
};

// Listing with relations
export type ListingWithRelations = Listing & {
  user: Pick<User, 'id' | 'name' | 'image' | 'trustScore'>;
  category: Pick<Category, 'id' | 'slug' | 'nameVn' | 'nameEn'>;
  neighborhood?: Pick<Neighborhood, 'id' | 'slug' | 'name'> | null;
  images: ListingImage[];
  _count?: {
    savedBy: number;
    reviews: number;
  };
};

// Category with children
export type CategoryWithChildren = Category & {
  children: Category[];
  parent?: Category | null;
  _count?: {
    listings: number;
  };
};

// Article with relations
export type ArticleWithRelations = Article & {
  author: Pick<User, 'id' | 'name' | 'image'>;
  category: Pick<ContentCategory, 'id' | 'slug' | 'nameVn' | 'nameEn' | 'color'>;
};

// User profile (safe to expose)
export type UserProfile = Pick<
  User,
  'id' | 'name' | 'image' | 'trustScore' | 'createdAt'
> & {
  _count?: {
    listings: number;
    reviews: number;
  };
};

// API Response types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Pagination
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Search params
export type ListingSearchParams = {
  q?: string;
  category?: string;
  subcategory?: string;
  neighborhood?: string;
  priceMin?: number;
  priceMax?: number;
  priceType?: PriceType;
  status?: ListingStatus;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
};

// Language type
export type Language = 'vn' | 'en';

// Translation keys
export type TranslationKey = keyof typeof import('@/data/translations').translations.vn;
