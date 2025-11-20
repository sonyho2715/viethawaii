# Authentication Patterns

Standard authentication patterns using iron-session, bcryptjs, and Zod.

## Session Configuration

```typescript
// lib/auth.ts
import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  organizationId?: string;
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

// Helper to check if user is authenticated
export async function requireAuth() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    throw new Error('Unauthorized');
  }

  return session;
}

// Helper to check if user is admin
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }

  return session;
}
```

## User Registration

```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate input
    const body = await req.json();
    const validated = registerSchema.parse(body);

    // Check if user already exists
    const existing = await db.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        email: validated.email.toLowerCase(),
        password: hashedPassword,
        name: validated.name,
      },
    });

    // Create session
    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.role = user.role;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration Error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
```

## User Login

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate input
    const body = await req.json();
    const validated = loginSchema.parse(body);

    // Find user
    const user = await db.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(validated.password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.role = user.role;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
```

## User Logout

```typescript
// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();

    return NextResponse.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });

  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
```

## Get Current User

```typescript
// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      session.destroy();
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error('Get User Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
```

## Protected Page Example

```typescript
// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.email}</p>
    </div>
  );
}
```

## Middleware for Route Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData } from './lib/auth';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get session from cookies
  const session = await getIronSession<SessionData>(
    request.cookies,
    response.cookies,
    {
      password: process.env.SESSION_SECRET!,
      cookieName: 'app_session',
    }
  );

  // Protected routes
  const protectedRoutes = ['/dashboard', '/settings', '/admin'];
  const adminRoutes = ['/admin'];

  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtected && !session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check admin routes
  const isAdminRoute = adminRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isAdminRoute && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
};
```

## Password Reset Flow

```typescript
// lib/auth-utils.ts
import crypto from 'crypto';
import { db } from './db';

export async function createPasswordResetToken(email: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour

  await db.passwordResetToken.create({
    data: {
      email: email.toLowerCase(),
      token,
      expires,
    },
  });

  return token;
}

export async function validatePasswordResetToken(token: string) {
  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return null;
  }

  if (resetToken.expires < new Date()) {
    await db.passwordResetToken.delete({
      where: { token },
    });
    return null;
  }

  return resetToken;
}
```

## Client-Side Auth Hook

```typescript
// hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (data.success) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      setUser(data.data);
      router.push('/dashboard');
      return { success: true };
    }

    return { success: false, error: data.error };
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
```

## Security Best Practices

- [ ] Always hash passwords with bcrypt (salt rounds >= 10)
- [ ] Store SESSION_SECRET in environment variables (32+ characters)
- [ ] Use httpOnly cookies for sessions
- [ ] Set secure: true in production
- [ ] Never expose password hashes in API responses
- [ ] Always lowercase emails for consistent lookups
- [ ] Use generic error messages for login (don't reveal if email exists)
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF protection for state-changing operations
- [ ] Expire sessions after inactivity
- [ ] Log authentication attempts (success and failure)
- [ ] Consider 2FA for sensitive operations
