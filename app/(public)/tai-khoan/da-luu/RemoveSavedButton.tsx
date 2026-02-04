'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RemoveSavedButtonProps {
  itemType: 'LISTING' | 'ARTICLE';
  itemId: number;
}

export function RemoveSavedButton({ itemType, itemId }: RemoveSavedButtonProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    if (isRemoving) return;

    setIsRemoving(true);

    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType,
          itemId,
          action: 'unsave',
        }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to remove saved item:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRemove}
      disabled={isRemoving}
      className="flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
      title="Bỏ lưu"
    >
      {isRemoving ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart className="h-5 w-5 fill-current" />
      )}
    </Button>
  );
}
