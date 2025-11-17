import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: string;
  isLoggedIn: boolean;
  csrfToken?: string;
}

// Validate session secret
const SESSION_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET;

if (!SESSION_SECRET) {
  throw new Error(
    'SESSION_SECRET or JWT_SECRET environment variable must be set. ' +
    'Generate one using: openssl rand -base64 32'
  );
}

if (SESSION_SECRET.length < 32) {
  console.warn(
    'WARNING: SESSION_SECRET is too short. Use at least 32 characters for security. ' +
    'Generate one using: openssl rand -base64 32'
  );
}

const sessionOptions = {
  password: SESSION_SECRET,
  cookieName: 'viethawaii-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return null;
  }
  return {
    userId: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return user;
}
