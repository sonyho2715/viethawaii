import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from './db';
import type { Role } from '@prisma/client';
import type { Adapter } from 'next-auth/adapters';

declare module 'next-auth' {
  interface User {
    role: Role;
    preferredLang: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      role: Role;
      preferredLang: string;
    };
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: Role;
    preferredLang: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: {
    signIn: '/dang-nhap',
    newUser: '/tai-khoan',
    error: '/dang-nhap',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        // Update last login
        await db.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          preferredLang: user.preferredLang,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.preferredLang = user.preferredLang;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.preferredLang = token.preferredLang as string;
      }
      return session;
    },
  },
});

// Helper to get session on server
export async function getSession() {
  return await auth();
}

// Helper to require auth
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

// Helper to require admin
export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
    throw new Error('Forbidden');
  }
  return session;
}

// Hash password helper
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password helper
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
