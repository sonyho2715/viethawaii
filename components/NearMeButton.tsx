'use client';

import { useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';

interface NearMeButtonProps {
  onLocationFound: (latitude: number, longitude: number) => void;
}

export default function NearMeButton({ onLocationFound }: NearMeButtonProps) {
  const { coords, error, loading, requestLocation } = useGeolocation();
  const [showError, setShowError] = useState(false);

  const handleClick = () => {
    setShowError(false);
    requestLocation();
  };

  // When coordinates are found, call the callback
  if (coords && !loading) {
    onLocationFound(coords.latitude, coords.longitude);
  }

  // Show error if present
  if (error && !showError) {
    setShowError(true);
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Finding location...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Near Me
          </>
        )}
      </button>

      {showError && error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
