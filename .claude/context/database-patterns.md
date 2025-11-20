# Database Patterns with Prisma

Standard patterns for database operations using Prisma ORM.

## Prisma Client Singleton

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
```

## Schema Design Patterns

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Base model with common fields
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  posts     Post[]
  profile   Profile?

  @@index([email])
}

enum Role {
  USER
  ADMIN
}

// One-to-One relationship
model Profile {
  id       String  @id @default(cuid())
  bio      String?
  avatar   String?

  userId   String  @unique
  user     User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// One-to-Many relationship
model Post {
  id          String   @id @default(cuid())
  title       String
  content     String
  published   Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  authorId    String
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  categories  Category[]

  @@index([authorId])
  @@index([published])
}

// Many-to-Many relationship
model Category {
  id    String @id @default(cuid())
  name  String @unique

  posts Post[]
}
```

## CRUD Operations

### Create

```typescript
// Simple create
const user = await db.user.create({
  data: {
    email: 'user@example.com',
    password: hashedPassword,
    name: 'John Doe',
  },
});

// Create with relations
const post = await db.post.create({
  data: {
    title: 'Hello World',
    content: 'This is my first post',
    author: {
      connect: { id: userId },
    },
    categories: {
      connectOrCreate: [
        {
          where: { name: 'Technology' },
          create: { name: 'Technology' },
        },
      ],
    },
  },
  include: {
    author: true,
    categories: true,
  },
});

// Bulk create
const users = await db.user.createMany({
  data: [
    { email: 'user1@example.com', password: 'hash1', name: 'User 1' },
    { email: 'user2@example.com', password: 'hash2', name: 'User 2' },
  ],
  skipDuplicates: true, // Skip records with unique constraint violations
});
```

### Read

```typescript
// Find unique
const user = await db.user.findUnique({
  where: { email: 'user@example.com' },
  include: {
    posts: true,
    profile: true,
  },
});

// Find first matching
const post = await db.post.findFirst({
  where: {
    published: true,
    authorId: userId,
  },
  orderBy: {
    createdAt: 'desc',
  },
});

// Find many with filters
const posts = await db.post.findMany({
  where: {
    AND: [
      { published: true },
      { authorId: userId },
      {
        OR: [
          { title: { contains: 'Next.js' } },
          { content: { contains: 'Next.js' } },
        ],
      },
    ],
  },
  include: {
    author: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    categories: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 10,
  skip: 0,
});

// Count records
const count = await db.post.count({
  where: {
    published: true,
    authorId: userId,
  },
});
```

### Update

```typescript
// Update single record
const user = await db.user.update({
  where: { id: userId },
  data: {
    name: 'New Name',
  },
});

// Update with relations
const post = await db.post.update({
  where: { id: postId },
  data: {
    title: 'Updated Title',
    categories: {
      set: [], // Remove all categories
      connect: [
        { id: categoryId1 },
        { id: categoryId2 },
      ],
    },
  },
});

// Update many records
const result = await db.post.updateMany({
  where: {
    authorId: userId,
    published: false,
  },
  data: {
    published: true,
  },
});
// result.count contains number of updated records

// Upsert (update if exists, create if not)
const user = await db.user.upsert({
  where: { email: 'user@example.com' },
  update: {
    name: 'Updated Name',
  },
  create: {
    email: 'user@example.com',
    password: hashedPassword,
    name: 'New User',
  },
});
```

### Delete

```typescript
// Delete single record
const user = await db.user.delete({
  where: { id: userId },
});

// Delete many records
const result = await db.post.deleteMany({
  where: {
    authorId: userId,
    published: false,
  },
});
// result.count contains number of deleted records

// Delete all records (DANGEROUS!)
const result = await db.post.deleteMany({});
```

## Transactions

```typescript
// Interactive transaction
const result = await db.$transaction(async (tx) => {
  // Create user
  const user = await tx.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      name: 'John Doe',
    },
  });

  // Create profile
  const profile = await tx.profile.create({
    data: {
      userId: user.id,
      bio: 'Hello, I am new here!',
    },
  });

  // If any operation fails, entire transaction is rolled back
  return { user, profile };
});

// Sequential operations transaction
const [user, posts] = await db.$transaction([
  db.user.create({
    data: { email: 'user@example.com', password: 'hash', name: 'User' },
  }),
  db.post.findMany({
    where: { published: true },
  }),
]);

// Transaction with timeout
const result = await db.$transaction(
  async (tx) => {
    // Operations here
  },
  {
    maxWait: 5000, // Maximum wait time to get a connection (ms)
    timeout: 10000, // Maximum time transaction can run (ms)
  }
);
```

## Advanced Queries

### Pagination

```typescript
async function getPaginatedPosts(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    db.post.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    }),
    db.post.count(),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
```

### Search and Filtering

```typescript
async function searchPosts(query: string, filters: {
  published?: boolean;
  categoryId?: string;
}) {
  return db.post.findMany({
    where: {
      AND: [
        // Text search
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        // Optional filters
        filters.published !== undefined && {
          published: filters.published,
        },
        filters.categoryId && {
          categories: {
            some: { id: filters.categoryId },
          },
        },
      ].filter(Boolean),
    },
    include: {
      author: true,
      categories: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
```

### Aggregations

```typescript
// Count by group
const postsByAuthor = await db.post.groupBy({
  by: ['authorId'],
  _count: {
    id: true,
  },
  where: {
    published: true,
  },
});

// Average, sum, min, max
const stats = await db.post.aggregate({
  _count: { id: true },
  _avg: { viewCount: true },
  _sum: { viewCount: true },
  _min: { createdAt: true },
  _max: { createdAt: true },
  where: {
    published: true,
  },
});
```

### Raw SQL (when needed)

```typescript
// Raw query
const users = await db.$queryRaw`
  SELECT * FROM "User"
  WHERE email LIKE ${`%${searchTerm}%`}
  LIMIT 10
`;

// Execute raw SQL
await db.$executeRaw`
  UPDATE "Post"
  SET "viewCount" = "viewCount" + 1
  WHERE id = ${postId}
`;
```

## Error Handling

```typescript
import { Prisma } from '@prisma/client';

try {
  const user = await db.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      name: 'John Doe',
    },
  });
} catch (error) {
  // Unique constraint violation
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint failed
      console.error('Email already exists');
    }
    if (error.code === 'P2025') {
      // Record not found
      console.error('Record not found');
    }
  }

  // Connection error
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error('Database connection failed');
  }

  // Validation error
  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error('Invalid query');
  }

  throw error;
}
```

## Performance Optimization

### Indexes

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  authorId  String
  published Boolean  @default(false)

  // Single column index
  @@index([authorId])

  // Composite index
  @@index([authorId, published])

  // Full-text search (PostgreSQL)
  @@index([title], type: Hash)
}
```

### Select Only Needed Fields

```typescript
// ❌ Bad: Fetches all fields
const users = await db.user.findMany();

// ✅ Good: Only fetch needed fields
const users = await db.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});
```

### Avoid N+1 Queries

```typescript
// ❌ Bad: N+1 query problem
const posts = await db.post.findMany();
for (const post of posts) {
  const author = await db.user.findUnique({
    where: { id: post.authorId },
  });
}

// ✅ Good: Use include or select
const posts = await db.post.findMany({
  include: {
    author: true,
  },
});
```

## Migration Best Practices

```bash
# Create migration (development)
npx prisma migrate dev --name add_user_role

# Deploy migration (production)
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Generate Prisma Client after schema changes
npx prisma generate
```

## Seeding Database

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await db.post.deleteMany();
  await db.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    db.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    }),
    db.user.create({
      data: {
        email: 'user@example.com',
        password: hashedPassword,
        name: 'Regular User',
        role: 'USER',
      },
    }),
  ]);

  // Create posts
  await db.post.createMany({
    data: [
      {
        title: 'First Post',
        content: 'This is the first post',
        published: true,
        authorId: users[0].id,
      },
      {
        title: 'Second Post',
        content: 'This is the second post',
        published: false,
        authorId: users[1].id,
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
```

## Database Connection Best Practices

- [ ] Use connection pooling for production
- [ ] Set reasonable connection limits
- [ ] Use `?sslmode=require` for Railway/production
- [ ] Keep Prisma Client singleton pattern
- [ ] Close connections in serverless functions (not needed with Prisma)
- [ ] Use prepared statements (Prisma does this automatically)
- [ ] Monitor slow queries in production
- [ ] Add indexes on frequently queried columns
- [ ] Use transactions for related operations
- [ ] Handle unique constraint violations gracefully
