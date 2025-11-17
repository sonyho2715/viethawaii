/**
 * Caching Module
 * Provides server-side caching utilities using Next.js caching features
 */

import { unstable_cache } from 'next/cache';

/**
 * Cache tags for invalidation
 */
export const CacheTags = {
  businesses: 'businesses',
  business: (slug: string) => `business-${slug}`,
  reviews: (businessId: string) => `reviews-${businessId}`,
  submissions: 'submissions',
  users: 'users',
  stats: 'stats',
} as const;

/**
 * Cache durations in seconds
 */
export const CacheDurations = {
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 3600, // 1 hour
  day: 86400, // 24 hours
} as const;

/**
 * Create a cached function with Next.js unstable_cache
 * @param fn - The function to cache
 * @param keyParts - Array of string parts to create cache key
 * @param options - Cache options (tags, revalidate time)
 */
export function createCachedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  options: {
    tags?: string[];
    revalidate?: number;
  } = {}
): T {
  return unstable_cache(fn, keyParts, {
    tags: options.tags,
    revalidate: options.revalidate || CacheDurations.medium,
  }) as T;
}

/**
 * Helper to create cache key from parameters
 */
export function createCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedKeys = Object.keys(params).sort();
  const keyParts = sortedKeys.map(key => `${key}:${params[key]}`);
  return `${prefix}-${keyParts.join('-')}`;
}
