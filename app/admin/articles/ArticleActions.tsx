'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye, EyeOff, ExternalLink, MoreHorizontal } from 'lucide-react';

interface ArticleActionsProps {
  articleId: number;
  status: string;
  slug: string;
}

export function ArticleActions({ articleId, status, slug }: ArticleActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      const newStatus = status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      const res = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating article:', error);
    } finally {
      setIsLoading(false);
      setShowMenu(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    } finally {
      setIsLoading(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative flex items-center justify-end gap-2">
      <Link
        href={`/admin/articles/${articleId}`}
        className="p-2 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Chỉnh sửa"
      >
        <Pencil className="h-4 w-4" />
      </Link>

      <Link
        href={`/tin-tuc/${slug}`}
        target="_blank"
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Xem bài viết"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>

      <button
        onClick={handleToggleStatus}
        disabled={isLoading}
        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        title={status === 'PUBLISHED' ? 'Ẩn bài viết' : 'Đăng bài viết'}
      >
        {status === 'PUBLISHED' ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>

      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        title="Xóa"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
