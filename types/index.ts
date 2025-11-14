// Shared TypeScript types for the application

export interface Business {
  id: string;
  name: string;
  nameVi?: string | null;
  slug: string;
  description: string;
  descriptionVi?: string | null;
  category: string;
  subcategory: string | null;
  island: string;
  city: string;
  address: string;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  image: string | null;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  verified: boolean;
  priceRange?: string | null;
  hours: any;
  features: string[];
  lat?: number | null;
  lng?: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleVi?: string | null;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string | null;
  publishedAt: string;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  titleVi?: string | null;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string | null;
  publishedAt: string;
  readTime: number;
}

export interface DiscoverItem {
  id: string;
  title: string;
  titleVi?: string | null;
  slug: string;
  description: string;
  category: string;
  image: string | null;
}
