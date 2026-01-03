'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  variant?: 'default' | 'compact' | 'text';
  className?: string;
}

export default function LanguageToggle({ variant = 'default', className = '' }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className={`flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors ${className}`}
        aria-label={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{language}</span>
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={toggleLanguage}
        className={`text-sm font-medium hover:underline ${className}`}
        aria-label={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
      >
        {language === 'vi' ? 'English' : 'Tiếng Việt'}
      </button>
    );
  }

  // Default variant - toggle switch style
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={toggleLanguage}
        className="relative flex items-center w-20 h-8 bg-gray-200 rounded-full p-1 cursor-pointer transition-colors hover:bg-gray-300"
        aria-label={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
      >
        <span
          className={`absolute flex items-center justify-center w-9 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 text-xs font-bold ${
            language === 'vi' ? 'translate-x-0' : 'translate-x-9'
          }`}
        >
          {language === 'vi' ? 'VI' : 'EN'}
        </span>
        <span className="absolute left-2 text-xs text-gray-600">VI</span>
        <span className="absolute right-2 text-xs text-gray-600">EN</span>
      </button>
    </div>
  );
}
