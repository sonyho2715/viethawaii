'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'vn' ? 'en' : 'vn')}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      title={language === 'vn' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">{language === 'vn' ? 'VI' : 'EN'}</span>
    </button>
  );
}

/**
 * Compact version for mobile/header
 */
export function LanguageToggleCompact() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'vn' ? 'en' : 'vn')}
      className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      title={language === 'vn' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
    >
      {language === 'vn' ? '🇻🇳' : '🇺🇸'}
    </button>
  );
}

/**
 * Dropdown version with full language names
 */
export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-block">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'vn' | 'en')}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
      >
        <option value="vn">🇻🇳 Tiếng Việt</option>
        <option value="en">🇺🇸 English</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
