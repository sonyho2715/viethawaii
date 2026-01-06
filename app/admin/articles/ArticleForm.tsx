'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';

interface Category {
  id: number;
  slug: string;
  nameVn: string;
  nameEn: string | null;
  type: string;
  color: string | null;
}

interface Article {
  id: number;
  slug: string;
  titleVn: string;
  titleEn: string | null;
  excerptVn: string | null;
  excerptEn: string | null;
  contentVn: string;
  contentEn: string | null;
  categoryId: number;
  featuredImage: string | null;
  status: string;
}

interface ArticleFormProps {
  categories: Category[];
  article?: Article;
}

export function ArticleForm({ categories, article }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = !!article;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titleVn: article?.titleVn || '',
    titleEn: article?.titleEn || '',
    slug: article?.slug || '',
    excerptVn: article?.excerptVn || '',
    excerptEn: article?.excerptEn || '',
    contentVn: article?.contentVn || '',
    contentEn: article?.contentEn || '',
    categoryId: article?.categoryId || categories[0]?.id || 0,
    featuredImage: article?.featuredImage || '',
    status: article?.status || 'DRAFT',
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      titleVn: value,
      slug: !isEditing || !prev.slug ? generateSlug(value) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        status: saveAsDraft ? 'DRAFT' : formData.status,
      };

      const url = isEditing
        ? `/api/admin/articles/${article.id}`
        : '/api/admin/articles';

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      router.push('/admin/articles');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <Link
            href="/admin/articles"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Lưu nháp
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {isEditing ? 'Cập nhật' : 'Đăng bài'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Title Vietnamese */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề (Tiếng Việt) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titleVn}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Nhập tiêu đề bài viết..."
              required
            />
          </div>

          {/* Title English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (English)
            </label>
            <input
              type="text"
              value={formData.titleEn}
              onChange={(e) => setFormData((prev) => ({ ...prev, titleEn: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter article title in English..."
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL)
            </label>
            <div className="flex items-center">
              <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
                /tin-tuc/
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="url-bai-viet"
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameVn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="DRAFT">Nháp</option>
                <option value="PUBLISHED">Đăng ngay</option>
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh đại diện (URL)
            </label>
            <input
              type="url"
              value={formData.featuredImage}
              onChange={(e) => setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {formData.featuredImage && (
              <div className="mt-2">
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="h-32 w-auto object-cover rounded-lg"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}
          </div>

          {/* Excerpt Vietnamese */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tóm tắt (Tiếng Việt)
            </label>
            <textarea
              value={formData.excerptVn}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerptVn: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Mô tả ngắn về bài viết..."
            />
          </div>

          {/* Content Vietnamese */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung (Tiếng Việt) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.contentVn}
              onChange={(e) => setFormData((prev) => ({ ...prev, contentVn: e.target.value }))}
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
              placeholder="Nhập nội dung bài viết... (Hỗ trợ HTML)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Hỗ trợ HTML cơ bản: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;
            </p>
          </div>

          {/* Content English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (English)
            </label>
            <textarea
              value={formData.contentEn}
              onChange={(e) => setFormData((prev) => ({ ...prev, contentEn: e.target.value }))}
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
              placeholder="Enter content in English... (HTML supported)"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
