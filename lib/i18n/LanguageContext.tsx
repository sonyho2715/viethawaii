'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, Translations, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  // Helper function for bilingual content from database
  getText: (vi: string | null | undefined, en: string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'viethawaii-language';

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'vi' }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (stored && (stored === 'vi' || stored === 'en')) {
      setLanguageState(stored);
    }
    setIsHydrated(true);
  }, []);

  // Save language to localStorage when changed
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  }, []);

  // Toggle between Vietnamese and English
  const toggleLanguage = useCallback(() => {
    const newLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(newLang);
  }, [language, setLanguage]);

  // Get current translations
  const t = translations[language];

  // Helper to get bilingual text from database fields
  // Returns Vietnamese primary, falls back to English if Vietnamese is empty
  const getText = useCallback((vi: string | null | undefined, en: string | null | undefined): string => {
    if (language === 'vi') {
      return vi || en || '';
    }
    return en || vi || '';
  }, [language]);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isHydrated) {
    return (
      <LanguageContext.Provider value={{
        language: defaultLanguage,
        setLanguage,
        toggleLanguage,
        t: translations[defaultLanguage],
        getText: (vi, en) => vi || en || '',
      }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, getText }}>
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

// Hook for just getting translations without the full context
export function useTranslations() {
  const { t, language } = useLanguage();
  return { t, language };
}
