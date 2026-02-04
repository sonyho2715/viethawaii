'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        <Sun className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      title={`Theme: ${theme}`}
    >
      {theme === 'light' && <Sun className="w-5 h-5 text-orange-500" />}
      {theme === 'dark' && <Moon className="w-5 h-5 text-blue-400" />}
      {theme === 'system' && <Monitor className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
    </button>
  );
}

/**
 * Theme selector dropdown
 */
export function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const options = [
    { value: 'light', label: 'Sáng', labelEn: 'Light', icon: Sun },
    { value: 'dark', label: 'Tối', labelEn: 'Dark', icon: Moon },
    { value: 'system', label: 'Hệ thống', labelEn: 'System', icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
            theme === option.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          title={option.labelEn}
        >
          <option.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
