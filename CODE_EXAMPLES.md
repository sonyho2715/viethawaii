# VietHawaii - Code Improvement Examples

This document provides specific code examples for the most important improvements.

## 1. Replace Hardcoded Credentials

### Current (INSECURE)
```typescript
// app/admin/login/page.tsx - Lines 22-25
const validCredentials = {
  email: 'admin@viethawaii.com',
  password: 'admin123'
};

if (email === validCredentials.email && password === validCredentials.password) {
  localStorage.setItem('adminAuth', 'true');
  router.push('/admin');
}
```

### Recommended
```typescript
// app/admin/login/page.tsx - Improved
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Token is set in httpOnly cookie automatically
      router.push('/admin');
    } else {
      const data = await response.json();
      setError(data.error || 'Invalid credentials');
    }
  } catch (error) {
    setError('Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Create Auth API
```typescript
// app/api/auth/login/route.ts - NEW
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await bcryptjs.compare(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set httpOnly cookie
    const response = NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, role: user.role } },
      { status: 200 }
    );

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
```

---

## 2. Add Input Validation

### Current (UNSAFE)
```typescript
// app/api/businesses/route.ts - Lines 57-66
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const business = await prisma.business.create({
      data: {
        ...data,  // No validation!
        status: 'pending',
      },
    });

    return NextResponse.json(business, { status: 201 });
```

### Recommended
```typescript
// lib/validation.ts - NEW
import { z } from 'zod';

export const businessSchema = z.object({
  name: z.string().min(1).max(255),
  nameVi: z.string().max(255).optional(),
  description: z.string().min(10).max(2000),
  descriptionVi: z.string().max(2000).optional(),
  category: z.enum(['Food & Dining', 'Retail & Shopping', ...]), // All valid categories
  subcategory: z.string().max(100).optional(),
  island: z.enum(['Oahu', 'Maui', 'Hawaii Island', 'Kauai', 'Molokai', 'Lanai']),
  city: z.string().min(1).max(100),
  address: z.string().min(1).max(255),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,}$/).optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  features: z.array(z.string()).optional(),
});

export type BusinessInput = z.infer<typeof businessSchema>;

export function validateBusiness(data: unknown) {
  try {
    return { valid: true, data: businessSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.flatten().fieldErrors,
      };
    }
    return { valid: false, errors: { general: ['Validation failed'] } };
  }
}
```

### Use in API
```typescript
// app/api/businesses/route.ts - UPDATED
import { validateBusiness } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate input
    const validation = validateBusiness(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const business = await prisma.business.create({
      data: {
        ...validation.data,
        status: 'pending',
        slug: generateSlug(validation.data.name), // Generate unique slug
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    );
  }
}
```

---

## 3. Add Pagination to API

### Current (LOADS ALL DATA)
```typescript
// app/api/admin/businesses/route.ts - Lines 22-35
const businesses = await prisma.business.findMany({
  where,
  orderBy: [
    { featured: 'desc' },
    { createdAt: 'desc' },
  ],
  include: {
    _count: {
      select: {
        reviews: true,
      },
    },
  },
});

return NextResponse.json(businesses.map(...));
```

### Recommended
```typescript
// app/api/admin/businesses/route.ts - UPDATED
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch data and total in parallel
    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: offset,
        take: limit,
        include: {
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      }),
      prisma.business.count({ where }),
    ]);

    return NextResponse.json({
      data: businesses.map(b => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
        reviewCount: b._count.reviews,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}
```

---

## 4. Create API Client Service

### Current (DUPLICATED ACROSS COMPONENTS)
```typescript
// app/admin/businesses/page.tsx
const response = await fetch(`/api/admin/businesses?${params}`);

// app/admin/content/page.tsx
const response = await fetch(`/api/admin/content?type=${type}`);

// app/admin/users/page.tsx
const response = await fetch(`/api/admin/users`);
```

### Recommended - Create Service Layer
```typescript
// lib/api-client.ts - NEW
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API error: ${response.status}`);
    }

    return response.json();
  }

  // Businesses
  async getBusinesses(status?: string, pagination?: PaginationParams) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    return this.request<PaginatedResponse<Business>>(
      `/api/admin/businesses?${params}`
    );
  }

  async createBusiness(data: BusinessCreateRequest) {
    return this.request<Business>('/api/businesses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBusiness(id: string, data: Partial<Business>) {
    return this.request<Business>(`/api/admin/businesses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBusiness(id: string) {
    return this.request(`/api/admin/businesses/${id}`, {
      method: 'DELETE',
    });
  }

  // Reviews
  async getReviews(status?: string, pagination?: PaginationParams) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    return this.request<PaginatedResponse<Review>>(
      `/api/admin/reviews?${params}`
    );
  }

  async approveReview(id: string) {
    return this.request<Review>(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'approved' }),
    });
  }

  // Content
  async getContent(type: 'news' | 'blog' | 'discover', pagination?: PaginationParams) {
    const params = new URLSearchParams([['type', type]]);
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    return this.request<PaginatedResponse<NewsArticle | BlogPost | DiscoverItem>>(
      `/api/admin/content?${params}`
    );
  }
}

export const apiClient = new ApiClient();
```

### Use in Components
```typescript
// app/admin/businesses/page.tsx - UPDATED
const fetchBusinesses = async () => {
  try {
    setLoading(true);
    const response = await apiClient.getBusinesses(
      selectedStatus !== 'all' ? selectedStatus : undefined,
      { page: currentPage, limit: 20 }
    );
    setBusinesses(response.data);
    setPagination(response.pagination);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Failed to fetch');
  } finally {
    setLoading(false);
  }
};
```

---

## 5. Fix Type Safety - Replace `any`

### Current (LOST TYPE INFO)
```typescript
// app/api/businesses/route.ts - Line 13
const where: any = {
  status: 'active',
};

// app/api/admin/content/route.ts - Line 10
const where: any = {};
```

### Recommended
```typescript
// types/api.ts - NEW
export interface BusinessFilters {
  status?: string;
  island?: string;
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
}

export interface ContentFilters {
  type?: 'news' | 'blog' | 'discover';
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReviewFilters {
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  limit?: number;
}
```

### Use Proper Types
```typescript
// app/api/businesses/route.ts - UPDATED
import type { BusinessFilters } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: BusinessFilters = {
      island: searchParams.get('island') || undefined,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      featured: searchParams.get('featured') === 'true',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    // Build where clause with type safety
    const where: Prisma.BusinessWhereInput = {
      status: 'active',
    };

    if (filters.island && filters.island !== 'All') {
      where.island = filters.island;
    }

    if (filters.category && filters.category !== 'All') {
      where.category = filters.category;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Rest of implementation...
  }
}
```

---

## 6. Add Auth Middleware

### Create Middleware
```typescript
// middleware.ts - NEW (in project root)
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verify JWT
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

### Update Login Page
```typescript
// Remove localStorage.setItem('adminAuth', 'true');
// Authentication is now handled by httpOnly cookies via middleware
```

---

## 7. Fix N+1 Query Problem

### Current (INEFFICIENT)
```typescript
// app/api/admin/reviews/route.ts - Lines 63-79
if (status === 'approved') {
  const reviews = await prisma.review.findMany({
    where: {
      businessId: review.businessId,
      status: 'approved',
    },
  });

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await prisma.business.update({
    where: { id: review.businessId },
    data: {
      rating: avgRating,
      reviewCount: reviews.length,
    },
  });
}
```

### Recommended - Use Transaction
```typescript
// app/api/admin/reviews/route.ts - UPDATED
if (status === 'approved') {
  const result = await prisma.$transaction(async (tx) => {
    // Update review
    const updatedReview = await tx.review.update({
      where: { id },
      data: { status: 'approved' },
    });

    // Get all approved reviews for this business
    const allReviews = await tx.review.findMany({
      where: {
        businessId: updatedReview.businessId,
        status: 'approved',
      },
    });

    // Calculate average rating
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

    // Update business with one operation
    await tx.business.update({
      where: { id: updatedReview.businessId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    });

    return updatedReview;
  });

  return NextResponse.json({
    ...result,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
  });
}
```

---

## 8. Add Missing Database Indexes

```prisma
// prisma/schema.prisma - ADD TO EXISTING MODELS

model Business {
  // ... existing fields ...
  
  @@index([slug])           // NEW - Often queried by slug
  @@index([createdAt])      // NEW - For sorting
  @@index([status])         // Existing
  @@index([island])         // Existing
  @@index([category])       // Existing
  @@index([featured])       // Existing
}

model Review {
  // ... existing fields ...
  
  @@index([businessId])     // Existing
  @@index([status])         // Existing
  @@index([createdAt])      // NEW - For recent reviews
}

model NewsArticle {
  // ... existing fields ...
  
  @@index([published])      // Existing
  @@index([publishedAt])    // NEW - For sorting recent articles
  @@index([category])       // Existing
  @@index([featured])       // Existing
}

model BlogPost {
  // ... existing fields ...
  
  @@index([published])      // Existing
  @@index([publishedAt])    // NEW - For sorting recent posts
  @@index([category])       // Existing
  @@index([featured])       // Existing
}
```

Then run: `npx prisma migrate dev --name add_indexes`

---

## Summary of Changes

| Change | File(s) | Priority | Effort |
|--------|---------|----------|--------|
| Remove hardcoded creds | login page, create auth API | HIGH | 4 hours |
| Add input validation | Create validation lib, update API | HIGH | 6 hours |
| Add pagination | All admin API routes | HIGH | 3 hours |
| Create API client | lib/api-client.ts | HIGH | 3 hours |
| Fix type safety | types/api.ts, all API routes | HIGH | 4 hours |
| Add auth middleware | middleware.ts | HIGH | 2 hours |
| Fix N+1 queries | admin/reviews/route.ts | MEDIUM | 1 hour |
| Add DB indexes | schema.prisma | MEDIUM | 0.5 hours |

Total estimated effort: 23.5 hours for core improvements.
