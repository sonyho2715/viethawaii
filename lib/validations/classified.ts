import { z } from 'zod';

// Base listing schema
export const classifiedListingSchema = z.object({
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự').max(100, 'Tiêu đề không quá 100 ký tự'),
  titleEn: z.string().max(100).optional(),
  description: z.string().min(20, 'Mô tả phải có ít nhất 20 ký tự').max(5000, 'Mô tả không quá 5000 ký tự'),
  descriptionEn: z.string().max(5000).optional(),

  // Pricing
  price: z.coerce.number().min(0).optional(),
  priceType: z.enum(['fixed', 'negotiable', 'free', 'contact']).default('fixed'),

  // Location
  island: z.enum(['oahu', 'maui', 'big-island', 'kauai', 'molokai', 'lanai']),
  city: z.string().max(100).optional(),
  zipCode: z.string().max(10).optional(),
  neighborhood: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
  hideExactLocation: z.boolean().default(true),

  // Contact
  contactEmail: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  contactPhone: z.string().max(20).optional(),
  contactMethod: z.enum(['email', 'phone', 'both', 'message']).default('email'),

  // Images (URLs)
  images: z.array(z.string().url()).max(10, 'Tối đa 10 hình ảnh').default([]),

  // Type-specific details
  jobDetails: z.object({
    salaryMin: z.coerce.number().optional(),
    salaryMax: z.coerce.number().optional(),
    salaryType: z.enum(['hourly', 'monthly', 'yearly', 'project']).optional(),
    employmentType: z.enum(['full-time', 'part-time', 'contract', 'temporary', 'internship']).optional(),
    remote: z.boolean().optional(),
    experienceRequired: z.string().optional(),
    benefits: z.array(z.string()).optional(),
    schedule: z.string().optional(),
  }).optional(),

  housingDetails: z.object({
    bedrooms: z.coerce.number().min(0).max(20).optional(),
    bathrooms: z.coerce.number().min(0).max(10).optional(),
    sqft: z.coerce.number().min(0).optional(),
    parking: z.coerce.number().min(0).max(10).optional(),
    furnished: z.boolean().optional(),
    petsAllowed: z.boolean().optional(),
    utilitiesIncluded: z.boolean().optional(),
    availableDate: z.string().optional(),
    leaseTerms: z.string().optional(),
  }).optional(),

  vehicleDetails: z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1).optional(),
    mileage: z.coerce.number().min(0).optional(),
    condition: z.enum(['new', 'like-new', 'excellent', 'good', 'fair', 'salvage']).optional(),
    transmission: z.enum(['automatic', 'manual']).optional(),
    fuelType: z.enum(['gasoline', 'diesel', 'electric', 'hybrid']).optional(),
    color: z.string().optional(),
    vin: z.string().optional(),
  }).optional(),

  // Options
  urgent: z.boolean().default(false),
});

export type ClassifiedListingInput = z.infer<typeof classifiedListingSchema>;

// Inquiry schema
export const classifiedInquirySchema = z.object({
  listingId: z.string().min(1),
  senderName: z.string().min(2, 'Vui lòng nhập tên').max(100),
  senderEmail: z.string().email('Email không hợp lệ'),
  senderPhone: z.string().max(20).optional(),
  message: z.string().min(10, 'Tin nhắn phải có ít nhất 10 ký tự').max(2000),
});

export type ClassifiedInquiryInput = z.infer<typeof classifiedInquirySchema>;

// Report schema
export const classifiedReportSchema = z.object({
  listingId: z.string().min(1),
  reason: z.enum(['spam', 'scam', 'prohibited', 'offensive', 'misleading', 'duplicate', 'other']),
  description: z.string().max(1000).optional(),
});

export type ClassifiedReportInput = z.infer<typeof classifiedReportSchema>;

// Search/filter schema
export const classifiedSearchSchema = z.object({
  q: z.string().optional(),
  categoryId: z.string().optional(),
  island: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  sort: z.enum(['newest', 'oldest', 'price-low', 'price-high']).default('newest'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export type ClassifiedSearchInput = z.infer<typeof classifiedSearchSchema>;

// Hawaii islands for dropdown
export const hawaiiIslands = [
  { value: 'oahu', label: "O'ahu", labelVi: "O'ahu" },
  { value: 'maui', label: 'Maui', labelVi: 'Maui' },
  { value: 'big-island', label: 'Big Island', labelVi: 'Big Island (Hawaii)' },
  { value: 'kauai', label: "Kaua'i", labelVi: "Kaua'i" },
  { value: 'molokai', label: "Moloka'i", labelVi: "Moloka'i" },
  { value: 'lanai', label: "Lana'i", labelVi: "Lana'i" },
];

// Price types for dropdown
export const priceTypes = [
  { value: 'fixed', label: 'Fixed Price', labelVi: 'Giá cố định' },
  { value: 'negotiable', label: 'Negotiable', labelVi: 'Thương lượng' },
  { value: 'free', label: 'Free', labelVi: 'Miễn phí' },
  { value: 'contact', label: 'Contact for Price', labelVi: 'Liên hệ giá' },
];

// Contact methods for dropdown
export const contactMethods = [
  { value: 'email', label: 'Email Only', labelVi: 'Chỉ Email' },
  { value: 'phone', label: 'Phone Only', labelVi: 'Chỉ Điện thoại' },
  { value: 'both', label: 'Email & Phone', labelVi: 'Email & Điện thoại' },
  { value: 'message', label: 'In-app Message', labelVi: 'Nhắn tin qua app' },
];
