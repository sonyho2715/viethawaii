# New SaaS Project Playbook

Complete step-by-step guide for setting up a new SaaS project with our standard stack.

## Prerequisites

- [ ] Node.js v24.5.0 installed (via NVM)
- [ ] Git configured
- [ ] GitHub CLI (`gh`) installed and authenticated
- [ ] Vercel CLI installed and authenticated
- [ ] Railway CLI installed and authenticated
- [ ] Project requirements documented

## Phase 1: Project Setup

### Step 1: Create Next.js Project

```bash
npx create-next-js@latest project-name \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --skip-git
```

Configuration choices:
- TypeScript: Yes
- Tailwind CSS: Yes
- App Router: Yes
- src directory: No
- Import alias: @/*
- Skip Git: Yes (we'll initialize it ourselves)

### Step 2: Navigate and Initialize Git

```bash
cd project-name
git init
```

### Step 3: Initial Dependencies

```bash
# Install core dependencies
npm install prisma @prisma/client zod bcryptjs iron-session lucide-react

# Install dev dependencies
npm install -D @types/bcryptjs tsx
```

### Step 4: Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma`
- `.env` file

## Phase 2: Database Setup

### Step 1: Create Railway Database

```bash
# Login to Railway
railway login

# Create new project
railway init

# Add PostgreSQL
railway add postgresql
```

### Step 2: Get Database URL

```bash
# Get the DATABASE_URL
railway variables

# Copy the DATABASE_URL value
```

### Step 3: Configure Environment Variables

Create `.env.local`:
```bash
DATABASE_URL="postgresql://..."

# Generate session secret
SESSION_SECRET="$(openssl rand -base64 32)"

NEXTAUTH_URL="http://localhost:3000"
```

Add to `.env`:
```bash
DATABASE_URL="postgresql://..."
```

Update `.gitignore`:
```
# Environment variables
.env
.env*.local
```

### Step 4: Design Database Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sessions  Session[]

  @@index([email])
}

enum Role {
  USER
  ADMIN
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
}

// Add your domain-specific models here
```

### Step 5: Run First Migration

```bash
npx prisma migrate dev --name init
```

## Phase 3: Core Infrastructure

### Step 1: Create Database Client

Create `lib/db.ts`:
```typescript
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

### Step 2: Create Auth Utilities

Create `lib/auth.ts`:
```typescript
import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'app_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
```

### Step 3: Create Validation Schemas

Create `lib/validations/auth.ts`:
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
```

## Phase 4: Authentication

### Step 1: Create Auth API Routes

Refer to `.claude/context/auth-patterns.md` for complete implementations.

Create these routes:
- `app/api/auth/register/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/me/route.ts`

### Step 2: Create Auth Pages

Create `app/(auth)/login/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <h1 className="text-2xl font-bold">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded border p-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded border p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

Create similar pages for:
- `app/(auth)/register/page.tsx`
- `app/(auth)/layout.tsx` (simple centered layout)

## Phase 5: Protected Dashboard

### Step 1: Create Dashboard Layout

Create `app/dashboard/layout.tsx`:
```typescript
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 p-4">
        <nav className="space-y-2">
          <a href="/dashboard" className="block rounded p-2 hover:bg-gray-100">
            Dashboard
          </a>
          <a href="/dashboard/settings" className="block rounded p-2 hover:bg-gray-100">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
```

### Step 2: Create Dashboard Page

Create `app/dashboard/page.tsx`:
```typescript
import { getSession } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome, {session.email}!</p>
    </div>
  );
}
```

## Phase 6: Configuration Files

### Step 1: Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  }
}
```

### Step 2: Create Seed Script

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await db.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log({ admin });
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

Run seed:
```bash
npm run db:seed
```

## Phase 7: Deployment

### Step 1: Create GitHub Repository

```bash
git add .
git commit -m "Initial commit: Next.js SaaS boilerplate"
gh repo create project-name --public --source=. --remote=origin
git push -u origin main
```

### Step 2: Deploy to Vercel

```bash
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: project-name
# - Directory: ./
# - Override settings? No
```

### Step 3: Configure Vercel Environment Variables

```bash
# Open Vercel dashboard
vercel env add DATABASE_URL
# Paste Railway DATABASE_URL

vercel env add SESSION_SECRET
# Paste SESSION_SECRET from .env.local
```

Or via dashboard:
```bash
open https://vercel.com/dashboard
```

Go to Settings > Environment Variables and add:
- `DATABASE_URL`
- `SESSION_SECRET`

### Step 4: Deploy to Production

```bash
git push origin main
```

Vercel automatically deploys on push to main.

## Phase 8: Documentation

### Step 1: Create README.md

```markdown
# Project Name

Description of your SaaS application.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma (PostgreSQL)
- iron-session Authentication

## Setup

1. Clone repository:
   \`\`\`bash
   git clone https://github.com/username/project-name.git
   cd project-name
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create `.env.local`:
   \`\`\`
   DATABASE_URL="postgresql://..."
   SESSION_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   \`\`\`

4. Set up database:
   \`\`\`bash
   npm run db:push
   npm run db:seed
   \`\`\`

5. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deployed on Vercel with Railway PostgreSQL database.

## License

MIT
```

### Step 2: Create .env.example

```bash
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
SESSION_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

## Checklist

### Setup
- [ ] Next.js project created
- [ ] Git initialized
- [ ] Dependencies installed
- [ ] Prisma initialized

### Database
- [ ] Railway database created
- [ ] Environment variables configured
- [ ] Database schema designed
- [ ] Migrations created
- [ ] Seed script created and run

### Authentication
- [ ] Auth utilities created
- [ ] API routes implemented
- [ ] Login page created
- [ ] Register page created
- [ ] Protected routes configured

### Infrastructure
- [ ] Database client singleton
- [ ] Validation schemas
- [ ] Error handling patterns
- [ ] TypeScript strict mode

### Deployment
- [ ] GitHub repository created
- [ ] Vercel project created
- [ ] Environment variables set in Vercel
- [ ] Production deployment successful
- [ ] Database accessible from production

### Documentation
- [ ] README.md created
- [ ] .env.example created
- [ ] Setup instructions documented
- [ ] Deployment guide documented

## Post-Setup Tasks

1. Test login/register flows
2. Verify database operations
3. Check production deployment
4. Set up error monitoring (optional)
5. Configure custom domain (optional)
6. Set up CI/CD (optional)
7. Add more features!

## Reference

- API Patterns: `.claude/context/api-patterns.md`
- Auth Patterns: `.claude/context/auth-patterns.md`
- Database Patterns: `.claude/context/database-patterns.md`
