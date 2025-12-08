import { z } from 'zod';
import { VALIDATION, CATEGORIES, ISLANDS, PRICE_RANGES } from './constants';

// Business Validation Schemas
export const businessHoursSchema = z.object({
  open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  closed: z.boolean().optional(),
}).optional();

export const createBusinessSchema = z.object({
  name: z.string()
    .min(VALIDATION.business.nameMin, `Name must be at least ${VALIDATION.business.nameMin} characters`)
    .max(VALIDATION.business.nameMax, `Name must be less than ${VALIDATION.business.nameMax} characters`),
  nameVi: z.string().optional(),
  description: z.string()
    .max(VALIDATION.business.descriptionMax, `Description must be less than ${VALIDATION.business.descriptionMax} characters`),
  descriptionVi: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  island: z.enum(['Oahu', 'Maui', 'Hawaii Island', 'Kauai', 'Molokai', 'Lanai'], {
    message: 'Invalid island selected',
  }),
  phone: z.string()
    .regex(VALIDATION.business.phoneRegex, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  website: z.string()
    .regex(VALIDATION.business.websiteRegex, 'Website must start with http:// or https://')
    .optional()
    .or(z.literal('')),
  image: z.string().url('Invalid image URL').optional(),
  images: z.array(z.string().url()).optional(),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  features: z.array(z.string()).optional(),
  hours: z.object({
    monday: businessHoursSchema,
    tuesday: businessHoursSchema,
    wednesday: businessHoursSchema,
    thursday: businessHoursSchema,
    friday: businessHoursSchema,
    saturday: businessHoursSchema,
    sunday: businessHoursSchema,
  }).optional(),
});

export const updateBusinessSchema = createBusinessSchema.partial().extend({
  id: z.string().uuid('Invalid business ID'),
});

export const updateBusinessStatusSchema = z.object({
  status: z.enum(['pending', 'active', 'inactive', 'rejected']),
  rejectionReason: z.string().optional(),
});

// Review Validation Schemas
export const createReviewSchema = z.object({
  businessId: z.string().uuid('Invalid business ID'),
  userId: z.string().uuid().optional(),
  userName: z.string().min(2, 'Name must be at least 2 characters'),
  userEmail: z.string().email('Invalid email').optional(),
  rating: z.number()
    .min(VALIDATION.review.ratingMin, `Rating must be at least ${VALIDATION.review.ratingMin}`)
    .max(VALIDATION.review.ratingMax, `Rating must be at most ${VALIDATION.review.ratingMax}`),
  content: z.string()
    .min(VALIDATION.review.contentMin, `Review must be at least ${VALIDATION.review.contentMin} characters`)
    .max(VALIDATION.review.contentMax, `Review must be less than ${VALIDATION.review.contentMax} characters`),
  title: z.string().max(100).optional(),
});

export const updateReviewSchema = z.object({
  id: z.string().uuid('Invalid review ID'),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  content: z.string().min(VALIDATION.review.contentMin).max(VALIDATION.review.contentMax).optional(),
  rating: z.number().min(VALIDATION.review.ratingMin).max(VALIDATION.review.ratingMax).optional(),
});

// Content Validation Schemas
export const createNewsArticleSchema = z.object({
  title: z.string()
    .min(VALIDATION.content.titleMin, `Title must be at least ${VALIDATION.content.titleMin} characters`)
    .max(VALIDATION.content.titleMax, `Title must be less than ${VALIDATION.content.titleMax} characters`),
  titleVi: z.string().optional(),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: z.string().max(VALIDATION.content.excerptMax, `Excerpt must be less than ${VALIDATION.content.excerptMax} characters`),
  content: z.string().min(VALIDATION.content.contentMin, `Content must be at least ${VALIDATION.content.contentMin} characters`),
  author: z.string().min(2, 'Author name is required'),
  image: z.string().url('Invalid image URL').optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().or(z.date()).optional(),
});

export const createBlogPostSchema = createNewsArticleSchema.extend({
  readTime: z.number().min(1).max(120).optional(),
});

export const createDiscoverItemSchema = z.object({
  title: z.string().min(VALIDATION.content.titleMin).max(VALIDATION.content.titleMax),
  titleVi: z.string().optional(),
  slug: z.string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(VALIDATION.content.excerptMax),
  descriptionVi: z.string().optional(),
  content: z.string().min(VALIDATION.content.contentMin),
  contentVi: z.string().optional(),
  image: z.string().url().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

// Auth Validation Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// Query Parameter Validation
export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().max(100).optional().default(12),
});

export const businessFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  island: z.string().optional(),
  priceRange: z.string().optional(),
  featured: z.boolean().optional(),
}).merge(paginationSchema);

export const contentFiltersSchema = z.object({
  category: z.string().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
}).merge(paginationSchema);

// Helper function to validate and parse data
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`),
      };
    }
    return {
      success: false,
      errors: ['Validation failed'],
    };
  }
}
