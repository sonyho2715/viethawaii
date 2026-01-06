'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

interface CategoryActionsProps {
  categoryId: number;
  isActive: boolean;
  articleCount: number;
}

export function CategoryActions({ categoryId, isActive, articleCount }: CategoryActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleActive = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (articleCount > 0) {
      alert(`Khong the xoa danh muc nay vi con ${articleCount} bai viet. Hay chuyen bai viet sang danh muc khac truoc.`);
      return;
    }

    if (!confirm('Ban co chac muon xoa danh muc nay?')) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Co loi xay ra');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/categories/${categoryId}`}
        className="p-2 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Chinh sua"
      >
        <Pencil className="h-4 w-4" />
      </Link>

      <button
        onClick={handleToggleActive}
        disabled={isLoading}
        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        title={isActive ? 'An danh muc' : 'Hien danh muc'}
      >
        {isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>

      <button
        onClick={handleDelete}
        disabled={isLoading || articleCount > 0}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        title={articleCount > 0 ? 'Khong the xoa (co bai viet)' : 'Xoa'}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
