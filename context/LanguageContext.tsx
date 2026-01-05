'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationKey, Translations } from '@/data/translations';

type Language = 'vn' | 'en';

// Use a mapped type that works for both languages
type TranslationValues = Translations['vn'] | Translations['en'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationValues;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'viethawaii-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vn');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved language preference
    const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null;
    if (saved && (saved === 'vn' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const toggleLanguage = () => {
    const newLang = language === 'vn' ? 'en' : 'vn';
    setLanguage(newLang);
  };

  const t = translations[language];

  // Prevent hydration mismatch by using default language on server
  if (!mounted) {
    return (
      <LanguageContext.Provider
        value={{
          language: 'vn',
          setLanguage,
          t: translations.vn,
          toggleLanguage,
        }}
      >
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Utility hook to get a specific translation
export function useTranslation(key: TranslationKey) {
  const { t } = useLanguage();
  return t[key];
}
