# API Design Patterns

Standard patterns for API routes in Next.js 15 App Router.

## Standard API Route Structure

```typescript
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

// Define validation schema
const createResourceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  // ... other fields
});

// POST - Create resource
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse and validate input
    const body = await req.json();
    const validated = createResourceSchema.parse(body);

    // 3. Execute business logic
    const resource = await db.resource.create({
      data: {
        ...validated,
        userId: session.userId,
      },
    });

    // 4. Return success response
    return NextResponse.json({
      success: true,
      data: resource,
    });

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle Prisma unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { success: false, error: 'Resource already exists' },
        { status: 409 }
      );
    }

    // Log unexpected errors
    console.error('API Error:', error);

    // Return generic error to client
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - List resources with pagination
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Fetch data with pagination
    const [resources, total] = await Promise.all([
      db.resource.findMany({
        where: { userId: session.userId },
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      db.resource.count({
        where: { userId: session.userId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: resources,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Dynamic Route Pattern

```typescript
// app/api/[resource]/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Get single resource
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resource = await db.resource.findFirst({
      where: {
        id: params.id,
        userId: session.userId, // Ensure user owns resource
      },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resource,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update resource
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = updateResourceSchema.parse(body);

    // Check ownership before updating
    const existing = await db.resource.findFirst({
      where: {
        id: params.id,
        userId: session.userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    const updated = await db.resource.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete resource
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check ownership before deleting
    const existing = await db.resource.findFirst({
      where: {
        id: params.id,
        userId: session.userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    await db.resource.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Response Format Standards

**Success Response:**
```typescript
{
  success: true,
  data: T,
  pagination?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

**Error Response:**
```typescript
{
  success: false,
  error: string,
  details?: any  // Only for validation errors
}
```

## Status Codes

- `200` - Success (GET, PATCH, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (logged in but not allowed)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Server Actions Alternative

For mutations, prefer Server Actions over API routes when possible:

```typescript
// app/actions/resource.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

const createResourceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function createResource(formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = createResourceSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
    });

    const resource = await db.resource.create({
      data: {
        ...validated,
        userId: session.userId,
      },
    });

    revalidatePath('/dashboard/resources');

    return { success: true, data: resource };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input', details: error.errors };
    }

    console.error('Server Action Error:', error);
    return { success: false, error: 'Failed to create resource' };
  }
}
```

## When to Use What

**Use API Routes when:**
- Building a public API
- Need RESTful endpoints
- External services will call it
- Need explicit HTTP methods

**Use Server Actions when:**
- Form submissions
- Internal mutations
- Better DX with forms
- Automatic progressive enhancement

## Security Checklist

- [ ] Always authenticate requests
- [ ] Check resource ownership before operations
- [ ] Validate all input with Zod
- [ ] Use Prisma parameterized queries (never string concatenation)
- [ ] Sanitize output (React does this automatically for JSX)
- [ ] Rate limit sensitive endpoints
- [ ] Log errors but don't expose details to client
- [ ] Use HTTPS in production (Vercel does this automatically)
