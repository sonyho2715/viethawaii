'use client';

import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  businessId: string;
  variant?: 'default' | 'card' | 'large';
  className?: string;
  initialFavorited?: boolean;
}

export default function FavoriteButton({
  businessId,
  variant = 'default',
  className = '',
  initialFavorited = false
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if business is in user's favorites
    if (session?.user) {
      checkFavoriteStatus();
    }
  }, [session, businessId]);

  const checkFavoriteStatus = async () => {
    try {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const data = await res.json();
        const isSaved = data.favorites?.some((b: any) => b.id === businessId);
        setIsFavorite(isSaved || false);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const res = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId })
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      } else {
        const error = await res.json();
        console.error('Failed to toggle favorite:', error);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = 'transition-all duration-200 flex items-center justify-center';

    switch (variant) {
      case 'card':
        return `${baseStyles} p-2 rounded-full ${
          isFavorite
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
        }`;
      case 'large':
        return `${baseStyles} px-4 py-2 rounded-lg gap-2 ${
          isFavorite
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-50'
        }`;
      default:
        return `${baseStyles} p-2 rounded-full ${
          isFavorite
            ? 'bg-red-500 text-white'
            : 'bg-white/80 text-gray-600 hover:text-red-500'
        }`;
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'large':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading || status === 'loading'}
      className={`${getButtonStyles()} ${className} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`${getIconSize()} ${isFavorite ? 'fill-current' : ''} transition-transform ${
          isLoading ? 'scale-90' : 'scale-100'
        }`}
      />
      {variant === 'large' && (
        <span className="font-semibold">
          {isFavorite ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
