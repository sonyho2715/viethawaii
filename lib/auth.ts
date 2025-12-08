/**
 * Unified Authentication Module
 * Uses iron-session for secure, encrypted session management
 */

import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth/session';

// Re-export session functions for convenience
export { getCurrentUser, requireAuth, requireAdmin, getSession } from '@/lib/auth/session';
export type { SessionData } from '@/lib/auth/session';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Set user session (login)
 */
export async function setUserSession(user: {
  userId: string;
  email: string;
  name: string;
  role: string;
}): Promise<void> {
  const session = await getSession();
  session.userId = user.userId;
  session.email = user.email;
  session.name = user.name;
  session.role = user.role;
  session.isLoggedIn = true;
  await session.save();
}

/**
 * Clear user session (logout)
 */
export async function clearUserSession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { getCurrentUser } = await import('@/lib/auth/session');
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const { getCurrentUser } = await import('@/lib/auth/session');
  const user = await getCurrentUser();
  return user?.role === 'admin';
}
