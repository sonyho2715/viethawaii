# VietHawaii - Complete Implementation Roadmap

This document provides a comprehensive roadmap for implementing all identified improvements to the VietHawaii application.

## Summary of Progress

### ✅ Completed (Just Now)
1. Created shared TypeScript types (`lib/types.ts`)
2. Created constants file (`lib/constants.ts`)
3. Created Zod validation schemas (`lib/validations.ts`)
4. Created API client service layer (`lib/api-client.ts`)
5. Installed required dependencies (zod, bcryptjs, jose, iron-session)

### 🚧 Ready to Implement
The foundation is now in place. Below are the remaining improvements organized by priority.

---

## Phase 1: Security & Critical Fixes (HIGHEST PRIORITY)

### 1.1 Implement Secure Authentication
**Status:** Foundation complete, needs implementation
**Files to modify:**
- Create: `lib/auth.ts` - Auth utilities with bcrypt
- Create: `app/api/auth/login/route.ts` - Secure login endpoint
- Create: `app/api/auth/logout/route.ts` - Logout endpoint
- Create: `app/api/auth/session/route.ts` - Session validation
- Create: `middleware.ts` - Auth middleware for protected routes
- Modify: `app/admin/login/page.tsx` - Use new auth API

**Implementation:**
```typescript
// lib/auth.ts
import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export async function createToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}
```

**Priority:** CRITICAL
**Effort:** 4-6 hours

### 1.2 Add Input Validation to All API Routes
**Status:** Schemas created, needs integration
**Files to modify:**
- `app/api/businesses/route.ts` - Add validation
- `app/api/admin/businesses/route.ts` - Add validation
- All other API routes

**Example Implementation:**
```typescript
import { createBusinessSchema } from '@/lib/validations';
import { validate } from '@/lib/validations';

export async function POST(request: Request) {
  const body = await request.json();
  const validation = validate(createBusinessSchema, body);

  if (!validation.success) {
    return NextResponse.json({
      error: 'Validation failed',
      errors: validation.errors
    }, { status: 400 });
  }

  // Continue with validated data
  const business = await prisma.business.create({
    data: validation.data
  });

  return NextResponse.json({ success: true, data: business });
}
```

**Priority:** CRITICAL
**Effort:** 3-4 hours

### 1.3 Create Auth Middleware
**Status:** Not started
**File to create:** `middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {

    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```

**Priority:** CRITICAL
**Effort:** 2-3 hours

---

## Phase 2: Backend Quality & Missing Features

### 2.1 Add Missing API Endpoints

#### Review Submission Endpoint
**File to create:** `app/api/reviews/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createReviewSchema, validate } from '@/lib/validations';

export async function POST(request: Request) {
  const body = await request.json();
  const validation = validate(createReviewSchema, body);

  if (!validation.success) {
    return NextResponse.json({
      error: 'Validation failed',
      errors: validation.errors
    }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      ...validation.data,
      status: 'pending',
    }
  });

  return NextResponse.json({ success: true, data: review });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');

  const reviews = await prisma.review.findMany({
    where: {
      ...(businessId ? { businessId } : {}),
      status: 'approved',
    },
    include: {
      business: {
        select: { name: true, slug: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ success: true, data: reviews });
}
```

**Priority:** HIGH
**Effort:** 2-3 hours

#### Search API Endpoint
**File to create:** `app/api/search/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({
      error: 'Search query must be at least 2 characters'
    }, { status: 400 });
  }

  const [businesses, newsArticles, blogPosts] = await Promise.all([
    prisma.business.findMany({
      where: {
        status: 'active',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 10,
    }),
    prisma.newsArticle.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 5,
    }),
    prisma.blogPost.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: { businesses, newsArticles, blogPosts }
  });
}
```

**Priority:** MEDIUM
**Effort:** 2 hours

### 2.2 Add Database Indexes
**File to modify:** `prisma/schema.prisma`

Add these indexes:
```prisma
model Business {
  // ... existing fields

  @@index([status])
  @@index([island])
  @@index([category])
  @@index([featured])
  @@index([slug])
}

model Review {
  // ... existing fields

  @@index([businessId])
  @@index([status])
}

model NewsArticle {
  // ... existing fields

  @@index([published])
  @@index([slug])
}

model BlogPost {
  // ... existing fields

  @@index([published])
  @@index([slug])
}
```

Then run:
```bash
npx prisma migrate dev --name add_indexes
```

**Priority:** HIGH
**Effort:** 1 hour

### 2.3 Add Pagination to Admin APIs
**Files to modify:**
- `app/api/admin/businesses/route.ts`
- `app/api/admin/reviews/route.ts`
- `app/api/admin/users/route.ts`

**Example:**
```typescript
import { DEFAULT_PAGE_SIZE, ADMIN_PAGE_SIZE } from '@/lib/constants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || ADMIN_PAGE_SIZE.toString());

  const skip = (page - 1) * pageSize;

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.business.count()
  ]);

  return NextResponse.json({
    success: true,
    data: businesses,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  });
}
```

**Priority:** MEDIUM
**Effort:** 2-3 hours

---

## Phase 3: Frontend Improvements

### 3.1 Connect Business Submit Form
**File to modify:** `app/submit/page.tsx`

Replace the TODO at line 208 with:
```typescript
import { api } from '@/lib/api-client';
import { useState } from 'react';

const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState('');
const [submitSuccess, setSubmitSuccess] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitError('');

  const result = await api.businesses.create(formData);

  if (result.success) {
    setSubmitSuccess(true);
    setFormData(initialFormData); // Reset form
  } else {
    setSubmitError(result.error || 'Failed to submit business');
  }

  setIsSubmitting(false);
};
```

**Priority:** HIGH
**Effort:** 2-3 hours

### 3.2 Break Down Large Components
**File to refactor:** `components/BusinessesHomepage.tsx` (461 lines)

Create separate components:
- `components/business/BusinessHero.tsx` - Hero section
- `components/business/BusinessSearch.tsx` - Search bar
- `components/business/BusinessFilters.tsx` - Filter controls
- `components/business/BusinessCard.tsx` - Individual business card
- `components/business/BusinessGrid.tsx` - Grid layout
- `components/business/BusinessPagination.tsx` - Pagination controls

**Priority:** MEDIUM
**Effort:** 4-6 hours

### 3.3 Add Error Boundary
**File to create:** `components/ErrorBoundary.tsx`

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Then wrap pages in `app/layout.tsx`:
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

**Priority:** MEDIUM
**Effort:** 2 hours

### 3.4 Optimize Images
**Files to modify:** Throughout the application

Replace `<img>` tags with Next.js `<Image>` component:
```typescript
import Image from 'next/image';

// Before:
<img src={business.image} alt={business.name} />

// After:
<Image
  src={business.image}
  alt={business.name}
  width={400}
  height={300}
  className="object-cover"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..."
/>
```

**Priority:** MEDIUM
**Effort:** 3-4 hours

---

## Phase 4: Testing & Documentation

### 4.1 Setup Testing Framework
**Files to create:**
- `vitest.config.ts`
- `__tests__/lib/validations.test.ts`
- `__tests__/lib/api-client.test.ts`
- `__tests__/components/BusinessCard.test.tsx`

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

**Priority:** LOW
**Effort:** 8-10 hours

---

## Implementation Checklist

### Week 1: Security (16-20 hours)
- [ ] Implement secure authentication with JWT
- [ ] Create auth middleware
- [ ] Update admin login to use new auth
- [ ] Add input validation to all API routes
- [ ] Test authentication flow

### Week 2: Backend (12-16 hours)
- [ ] Add review submission endpoint
- [ ] Add search API endpoint
- [ ] Add database indexes
- [ ] Add pagination to admin APIs
- [ ] Test all API endpoints

### Week 3: Frontend (12-16 hours)
- [ ] Connect business submit form
- [ ] Add error boundaries
- [ ] Optimize images with Next.js Image
- [ ] Add loading states throughout
- [ ] Test user flows

### Week 4: Refactoring (16-20 hours)
- [ ] Break down large components
- [ ] Extract duplicate code
- [ ] Update all components to use API client
- [ ] Update all components to use constants
- [ ] Code review and cleanup

### Week 5: Testing (Optional) (20-30 hours)
- [ ] Setup testing framework
- [ ] Write unit tests for utilities
- [ ] Write integration tests for APIs
- [ ] Write component tests
- [ ] Achieve 70%+ coverage

## Total Estimated Effort
- **Minimum (Core improvements):** 40-52 hours
- **Complete (With testing):** 76-102 hours

## Next Steps
1. Start with Phase 1 (Security) - CRITICAL
2. Deploy after each major phase
3. Test thoroughly in staging before production
4. Monitor for errors after deployment
