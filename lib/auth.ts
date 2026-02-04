import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
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
    id?: string;
    role?: Role;
    preferredLang?: string;
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
    // Google OAuth provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // Allow linking to existing accounts
    }),
    // Email/password credentials provider
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
    async signIn({ user, account }) {
      // For OAuth sign-ins, update user profile with OAuth data
      if (account?.provider === 'google' && user.email) {
        const existingUser = await db.user.findUnique({
          where: { email: user.email.toLowerCase() },
        });

        if (existingUser) {
          // Update user with Google profile data if missing
          await db.user.update({
            where: { id: existingUser.id },
            data: {
              lastLogin: new Date(),
              ...(user.name && !existingUser.name ? { name: user.name } : {}),
              ...(user.image && !existingUser.image ? { image: user.image } : {}),
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign-in
      if (user) {
        token.id = user.id as string;
        token.role = user.role || 'USER';
        token.preferredLang = user.preferredLang || 'vn';
      }

      // Fetch user data from database for OAuth users
      if (account?.provider === 'google' && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email.toLowerCase() },
          select: { id: true, role: true, preferredLang: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.preferredLang = dbUser.preferredLang;
        }
      }

      // Refresh user data when session is updated
      if (trigger === 'update' && token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, preferredLang: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.preferredLang = dbUser.preferredLang;
        }
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
  events: {
    // Create user with default role when signing up via OAuth
    async createUser({ user }) {
      if (user.id) {
        await db.user.update({
          where: { id: user.id },
          data: {
            role: 'USER',
            preferredLang: 'vn',
          },
        });
      }
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
