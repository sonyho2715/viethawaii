// Shared TypeScript types for the application

export interface DayHours {
  open: string;
  close: string;
  closed?: boolean;
}

export interface BusinessHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue } | any;

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
  zipCode?: string | null;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  image?: string | null;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  verified: boolean;
  priceRange?: string | null;
  hours?: BusinessHours | JsonValue | null;
  features: string[];
  lat?: number | null;
  lng?: number | null;
  coordinates?: { lat: number; lng: number };
  status?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleVi?: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image?: string;
  publishedAt?: string;
  publishedDate: string;
  date: string;
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
  description: string;
  type: 'place' | 'event' | 'feature' | 'tradition';
  image?: string | null;
  link?: string;
  slug?: string;
  category?: string;
}

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}
