'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, MapPin, Tag, TrendingUp } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'business' | 'news' | 'blog' | 'discover';
  title: string;
  subtitle?: string;
  slug: string;
  category?: string;
  location?: string;
}

interface GlobalSearchProps {
  businesses?: any[];
}

export default function GlobalSearch({ businesses = [] }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search businesses
    businesses.forEach((business) => {
      const matchScore =
        (business.name?.toLowerCase().includes(query) ? 3 : 0) +
        (business.description?.toLowerCase().includes(query) ? 2 : 0) +
        (business.category?.toLowerCase().includes(query) ? 1 : 0) +
        (business.city?.toLowerCase().includes(query) ? 1 : 0);

      if (matchScore > 0) {
        searchResults.push({
          id: business.id,
          type: 'business',
          title: business.name,
          subtitle: business.description,
          slug: business.slug,
          category: business.category,
          location: `${business.city}, ${business.island}`,
        });
      }
    });

    // Sort by relevance and limit results
    setResults(searchResults.slice(0, 8));
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, businesses]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        // Open search with Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleResultClick = (result: SearchResult) => {
    const path = result.type === 'business'
      ? `/business/${result.slug}`
      : `/${result.type}/${result.slug}`;

    router.push(path);
    setIsOpen(false);
    setQuery('');
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'business':
        return <MapPin className="w-5 h-5 text-rose-500" />;
      case 'news':
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      default:
        return <Tag className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div
            ref={searchRef}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
          >
            {/* Search Input */}
            <div className="relative border-b border-gray-200">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search businesses, articles, and more..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full pl-12 pr-12 py-4 text-lg outline-none"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-2">
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-start gap-3 ${
                        index === selectedIndex
                          ? 'bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="mt-1">{getResultIcon(result.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {result.title}
                        </div>
                        {result.subtitle && (
                          <div className="text-sm text-gray-600 truncate mt-1">
                            {result.subtitle}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          {result.category && (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">
                              {result.category}
                            </span>
                          )}
                          {result.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {result.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 uppercase mt-1">
                        {result.type}
                      </span>
                    </button>
                  ))}
                </div>
              ) : query ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-semibold">No results found</p>
                  <p className="text-sm mt-1">Try different keywords or browse by category</p>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-semibold">Start typing to search</p>
                  <p className="text-sm mt-1">Search businesses, news, blogs, and more</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Enter</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Esc</kbd>
                  Close
                </span>
              </div>
              <span>{results.length} results</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
