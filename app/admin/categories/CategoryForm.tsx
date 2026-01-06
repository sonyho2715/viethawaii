'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Category {
  id: number;
  slug: string;
  nameVn: string;
  nameEn: string | null;
  type: string;
  color: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface CategoryFormProps {
  category?: Category;
}

const CONTENT_TYPES = [
  { value: 'NEWS', label: 'Tin tuc' },
  { value: 'BLOG', label: 'Blog' },
  { value: 'VLOG', label: 'Vlog' },
  { value: 'GUIDE', label: 'Huong dan' },
];

const COLORS = [
  { value: '#10B981', label: 'Xanh la' },
  { value: '#3B82F6', label: 'Xanh duong' },
  { value: '#EF4444', label: 'Do' },
  { value: '#F59E0B', label: 'Vang' },
  { value: '#8B5CF6', label: 'Tim' },
  { value: '#EC4899', label: 'Hong' },
  { value: '#6B7280', label: 'Xam' },
];

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!category;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nameVn: category?.nameVn || '',
    nameEn: category?.nameEn || '',
    slug: category?.slug || '',
    type: category?.type || 'NEWS',
    color: category?.color || '#10B981',
    sortOrder: category?.sortOrder ?? 0,
    isActive: category?.isActive ?? true,
  });

  // Auto-generate slug from Vietnamese name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/d/g, 'd')
      .replace(/D/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      nameVn: value,
      slug: !isEditing || !prev.slug ? generateSlug(value) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/admin/categories/${category.id}`
        : '/api/admin/categories';

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Co loi xay ra');
      }

      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Co loi xay ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <Link
            href="/admin/categories"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lai
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? 'Cap nhat' : 'Tao danh muc'}
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Name Vietnamese */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ten danh muc (Tieng Viet) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nameVn}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Nhap ten danh muc..."
              required
            />
          </div>

          {/* Name English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name (English)
            </label>
            <input
              type="text"
              value={formData.nameEn}
              onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter category name in English..."
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
              placeholder="ten-danh-muc"
              required
            />
          </div>

          {/* Type and Sort Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loai noi dung <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thu tu sap xep
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mau sac
            </label>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color.value
                        ? 'border-gray-900 scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
              <input
                type="text"
                value={formData.color || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Danh muc dang hoat dong
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
