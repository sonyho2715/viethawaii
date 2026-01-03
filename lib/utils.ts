/**
 * Utility functions for the VietHawaii platform
 */

/**
 * Format a date relative to now (e.g., "2 hours ago")
 * Supports Vietnamese and English
 */
export function formatDistanceToNow(date: Date, language: 'vi' | 'en' = 'vi'): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return language === 'vi' ? 'Vừa xong' : 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return language === 'vi'
      ? `${diffInMinutes} phút trước`
      : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return language === 'vi'
      ? `${diffInHours} giờ trước`
      : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return language === 'vi'
      ? `${diffInDays} ngày trước`
      : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return language === 'vi'
      ? `${diffInWeeks} tuần trước`
      : `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return language === 'vi'
      ? `${diffInMonths} tháng trước`
      : `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return language === 'vi'
    ? `${diffInYears} năm trước`
    : `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Format a date in a locale-appropriate format
 */
export function formatDate(date: Date, language: 'vi' | 'en' = 'vi'): string {
  return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format currency in USD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '...';
}

/**
 * Generate a slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Get island display name
 */
export function getIslandName(island: string, language: 'vi' | 'en' = 'vi'): string {
  const islands: Record<string, { vi: string; en: string }> = {
    oahu: { vi: "O'ahu", en: "O'ahu" },
    maui: { vi: 'Maui', en: 'Maui' },
    'big-island': { vi: 'Big Island (Hawaii)', en: 'Big Island' },
    kauai: { vi: "Kaua'i", en: "Kaua'i" },
    molokai: { vi: "Moloka'i", en: "Moloka'i" },
    lanai: { vi: "Lana'i", en: "Lana'i" },
  };
  return islands[island]?.[language] || capitalize(island);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Class names utility (simplified cn function)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
