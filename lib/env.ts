/**
 * Environment variable validation
 * Validates required environment variables at build/runtime
 */

import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // NextAuth
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters').optional(),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters').optional(),

  // Google OAuth (optional - for Google sign-in)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Cloudinary (required for image uploads)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1, 'Cloudinary cloud name is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'Cloudinary API key is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'Cloudinary API secret is required'),

  // Vercel Blob (required for file uploads)
  BLOB_READ_WRITE_TOKEN: z.string().min(1, 'Vercel Blob token is required'),

  // Email (Resend)
  RESEND_API_KEY: z.string().min(1, 'Resend API key is required'),
  FROM_EMAIL: z.string().email().optional().default('VietHawaii <noreply@viethawaii.com>'),
  REPLY_TO_EMAIL: z.string().email().optional(),

  // Upstash Redis (optional - for rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Cron secret (for scheduled tasks)
  CRON_SECRET: z.string().optional(),

  // External APIs
  EXCHANGE_RATE_API_KEY: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Call this at app startup to catch missing env vars early
 */
export function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

/**
 * Get typed environment variables
 * Use this instead of process.env for type safety
 */
export function getEnv() {
  return {
    // Database
    DATABASE_URL: process.env.DATABASE_URL!,

    // Auth
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
    AUTH_SECRET: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

    // Google OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    hasGoogleOAuth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,

    // Vercel Blob
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN!,

    // Email
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    FROM_EMAIL: process.env.FROM_EMAIL || 'VietHawaii <noreply@viethawaii.com>',
    REPLY_TO_EMAIL: process.env.REPLY_TO_EMAIL,

    // Redis
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    hasRedis: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),

    // Cron
    CRON_SECRET: process.env.CRON_SECRET,

    // External APIs
    EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY,

    // Environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  };
}

/**
 * Required environment variables checklist for deployment
 */
export const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'AUTH_SECRET',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'BLOB_READ_WRITE_TOKEN',
  'RESEND_API_KEY',
] as const;

/**
 * Optional but recommended environment variables
 */
export const RECOMMENDED_ENV_VARS = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'CRON_SECRET',
] as const;
