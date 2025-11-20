# Feature Development Workflow

Standard workflow for adding new features to existing projects.

## Phase 1: Planning

### Step 1: Define Requirements

- [ ] What problem does this feature solve?
- [ ] Who are the users?
- [ ] What are the acceptance criteria?
- [ ] Are there any dependencies?
- [ ] What's the priority?

### Step 2: Design Data Model

If feature requires database changes:

```prisma
// Example: Adding a Booking model
model Booking {
  id          String   @id @default(cuid())
  userId      String
  serviceId   String
  date        DateTime
  status      BookingStatus @default(PENDING)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  service     Service  @relation(fields: [serviceId], references: [id])

  @@index([userId])
  @@index([serviceId])
  @@index([date])
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}
```

### Step 3: Sketch User Flow

1. Entry point (where does user access this?)
2. Actions user can take
3. Success/error states
4. Navigation flow

### Step 4: Identify Files Needed

```
app/
├── [feature]/
│   ├── page.tsx              # Main feature page
│   ├── [id]/page.tsx         # Detail page (if needed)
│   └── components/
│       ├── FeatureList.tsx
│       ├── FeatureForm.tsx
│       └── FeatureCard.tsx
├── api/
│   └── [feature]/
│       ├── route.ts          # List/Create
│       └── [id]/route.ts     # Get/Update/Delete
lib/
└── validations/
    └── [feature].ts          # Zod schemas
```

## Phase 2: Database Changes

### Step 1: Update Prisma Schema

```bash
# Edit prisma/schema.prisma
# Add new models, fields, or relations
```

### Step 2: Create Migration

```bash
# Development
npx prisma migrate dev --name add_booking_feature

# This will:
# 1. Create migration files
# 2. Apply migration to database
# 3. Regenerate Prisma Client
```

### Step 3: Update Seed Script (if needed)

```typescript
// prisma/seed.ts
// Add sample data for new feature

const services = await Promise.all([
  db.service.create({
    data: {
      name: 'Service 1',
      description: 'Description',
      price: 100,
    },
  }),
  // ...
]);
```

### Step 4: Test Migration

```bash
# Reset and reseed database
npx prisma migrate reset

# Or just seed
npm run db:seed
```

## Phase 3: Backend Implementation

### Step 1: Create Validation Schemas

```typescript
// lib/validations/booking.ts
import { z } from 'zod';

export const createBookingSchema = z.object({
  serviceId: z.string().cuid(),
  date: z.string().datetime(),
  notes: z.string().optional(),
});

export const updateBookingSchema = createBookingSchema.partial();
```

### Step 2: Create API Routes

```typescript
// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { createBookingSchema } from '@/lib/validations/booking';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookings = await db.booking.findMany({
      where: { userId: session.userId },
      include: {
        service: true,
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get bookings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = createBookingSchema.parse(body);

    const booking = await db.booking.create({
      data: {
        ...validated,
        userId: session.userId,
        date: new Date(validated.date),
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create Booking Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/bookings/[id]/route.ts
// Implement GET, PATCH, DELETE
// See .claude/context/api-patterns.md for full pattern
```

### Step 3: Test API Routes

```bash
# Start dev server
npm run dev

# Test with curl or API client
curl http://localhost:3000/api/bookings
```

## Phase 4: Frontend Implementation

### Step 1: Create Type Definitions

```typescript
// app/bookings/types.ts
import { Booking, Service } from '@prisma/client';

export type BookingWithService = Booking & {
  service: Service;
};

export interface BookingFormData {
  serviceId: string;
  date: string;
  notes?: string;
}
```

### Step 2: Create Components

```typescript
// app/bookings/components/BookingForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function BookingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      serviceId: formData.get('serviceId') as string,
      date: formData.get('date') as string,
      notes: formData.get('notes') as string,
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        router.push('/bookings');
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form fields */}
      <div>
        <label htmlFor="serviceId" className="block text-sm font-medium">
          Service
        </label>
        <select
          name="serviceId"
          id="serviceId"
          required
          className="mt-1 block w-full rounded border p-2"
        >
          {/* Map services */}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium">
          Date & Time
        </label>
        <input
          type="datetime-local"
          name="date"
          id="date"
          required
          className="mt-1 block w-full rounded border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Booking'}
      </button>
    </form>
  );
}
```

```typescript
// app/bookings/components/BookingList.tsx
import { BookingWithService } from '../types';

interface Props {
  bookings: BookingWithService[];
}

export function BookingList({ bookings }: Props) {
  if (bookings.length === 0) {
    return <p className="text-gray-500">No bookings yet</p>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="rounded border p-4">
          <h3 className="font-semibold">{booking.service.name}</h3>
          <p className="text-sm text-gray-600">
            {new Date(booking.date).toLocaleString()}
          </p>
          <span className="mt-2 inline-block rounded bg-blue-100 px-2 py-1 text-xs">
            {booking.status}
          </span>
        </div>
      ))}
    </div>
  );
}
```

### Step 3: Create Pages

```typescript
// app/bookings/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { BookingList } from './components/BookingList';

export default async function BookingsPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect('/login');
  }

  const bookings = await db.booking.findMany({
    where: { userId: session.userId },
    include: { service: true },
    orderBy: { date: 'asc' },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <a
          href="/bookings/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          New Booking
        </a>
      </div>

      <BookingList bookings={bookings} />
    </div>
  );
}
```

```typescript
// app/bookings/new/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { BookingForm } from '../components/BookingForm';

export default async function NewBookingPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect('/login');
  }

  const services = await db.service.findMany({
    where: { active: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">New Booking</h1>
      <BookingForm services={services} />
    </div>
  );
}
```

## Phase 5: Integration

### Step 1: Add Navigation

```typescript
// app/dashboard/layout.tsx (or wherever nav is)
<nav>
  <a href="/dashboard">Dashboard</a>
  <a href="/bookings">Bookings</a>  {/* Add this */}
  <a href="/settings">Settings</a>
</nav>
```

### Step 2: Add Dashboard Widget (Optional)

```typescript
// app/dashboard/page.tsx
import { getUpcomingBookings } from './actions';

export default async function DashboardPage() {
  const upcomingBookings = await getUpcomingBookings();

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
        {upcomingBookings.slice(0, 3).map((booking) => (
          <div key={booking.id}>
            {booking.service.name} - {new Date(booking.date).toLocaleDateString()}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Phase 6: Testing

### Step 1: Manual Testing

- [ ] Create new booking
- [ ] View bookings list
- [ ] Update booking
- [ ] Delete booking
- [ ] Test validation (invalid inputs)
- [ ] Test authentication (logged out state)
- [ ] Test error states
- [ ] Test loading states
- [ ] Test edge cases (empty list, etc.)

### Step 2: Build Test

```bash
npm run build
```

Fix any TypeScript or build errors.

### Step 3: Test Database Operations

```bash
# Open Prisma Studio
npm run db:studio

# Verify data is correct
# Check relations work
```

## Phase 7: Polish

### Step 1: Add Loading States

```typescript
// app/bookings/loading.tsx
export default function Loading() {
  return <div>Loading bookings...</div>;
}
```

### Step 2: Add Error Boundaries

```typescript
// app/bookings/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Step 3: Improve UI/UX

- [ ] Add confirmation dialogs for delete
- [ ] Add success notifications
- [ ] Improve form validation feedback
- [ ] Add keyboard shortcuts (if applicable)
- [ ] Ensure mobile responsive
- [ ] Add proper ARIA labels

### Step 4: Optimize Performance

- [ ] Use React Server Components where possible
- [ ] Add proper loading states
- [ ] Optimize database queries
- [ ] Add pagination for long lists
- [ ] Consider caching strategies

## Phase 8: Deployment

### Step 1: Create Feature Branch

```bash
git checkout -b feature/bookings
git add .
git commit -m "Add booking feature"
git push -u origin feature/bookings
```

### Step 2: Test Preview Deployment

Vercel automatically creates preview deployment for feature branches.

- [ ] Test preview deployment
- [ ] Verify environment variables work
- [ ] Check database connections
- [ ] Test all user flows

### Step 3: Merge to Main

```bash
git checkout main
git merge feature/bookings
git push origin main
```

### Step 4: Verify Production

- [ ] Check production deployment succeeds
- [ ] Test feature in production
- [ ] Monitor for errors

## Phase 9: Documentation

### Step 1: Update README (if needed)

Document new feature, especially if it requires:
- New environment variables
- Database migrations
- External services

### Step 2: Add Code Comments

Add comments for:
- Complex business logic
- Non-obvious decisions
- Important security considerations

### Step 3: Create User Documentation (if needed)

If feature is customer-facing, document:
- How to use the feature
- Common questions
- Troubleshooting

## Checklist

### Planning
- [ ] Requirements defined
- [ ] Data model designed
- [ ] User flow sketched
- [ ] Files identified

### Database
- [ ] Schema updated
- [ ] Migration created
- [ ] Seed data added
- [ ] Migration tested

### Backend
- [ ] Validation schemas created
- [ ] API routes implemented
- [ ] Error handling added
- [ ] API tested

### Frontend
- [ ] Types defined
- [ ] Components created
- [ ] Pages created
- [ ] Forms validated

### Integration
- [ ] Navigation added
- [ ] Dashboard integrated
- [ ] User flows connected

### Testing
- [ ] Manual testing complete
- [ ] Build successful
- [ ] Database verified

### Polish
- [ ] Loading states added
- [ ] Error handling improved
- [ ] UI/UX polished
- [ ] Performance optimized

### Deployment
- [ ] Feature branch created
- [ ] Preview tested
- [ ] Merged to main
- [ ] Production verified

### Documentation
- [ ] README updated
- [ ] Code commented
- [ ] User docs created (if needed)

## Common Issues

**Build fails after migration:**
```bash
npm run db:generate
```

**Types not updating:**
```bash
npx prisma generate
# Restart TypeScript server in IDE
```

**Database out of sync:**
```bash
npx prisma migrate reset  # Development only!
npm run db:seed
```

**API routes not working:**
- Check authentication
- Verify environment variables
- Check database connection
- Look at browser Network tab
- Check server console

**Styling not working:**
- Restart dev server
- Check Tailwind class names
- Verify tailwind.config.js includes files
