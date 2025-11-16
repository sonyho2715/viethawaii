'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ImageUpload from '@/components/ImageUpload';

export default function NewContentPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth(true, true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'news',
    title: '',
    titleVi: '',
    slug: '',
    excerpt: '',
    content: '',
    contentVi: '',
    author: '',
    category: 'Food & Dining',
    tags: '',
    image: '',
    published: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (name === 'title') {
      // Auto-generate slug from title
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, title: value, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const contentType = formData.type === 'news' ? 'news' : formData.type === 'blog' ? 'blog' : 'discover';

      let endpoint = '/api/admin/content';
      let payload: any = {
        type: contentType,
        title: formData.title,
        titleVi: formData.titleVi || null,
        slug: formData.slug,
        content: formData.content,
        description: formData.excerpt,
        category: formData.category,
        image: formData.image || null,
        published: formData.published,
      };

      if (contentType === 'news') {
        payload.author = formData.author || 'Admin';
        payload.tags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
      } else if (contentType === 'blog') {
        payload.author = formData.author || 'Admin';
        payload.excerpt = formData.excerpt;
        payload.tags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
      } else if (contentType === 'discover') {
        payload.type = 'feature';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Content created successfully!');
        router.push('/admin/content');
      } else {
        const error = await response.json();
        alert(`Failed to create content: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Failed to create content');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/content"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">Create New Content</h1>
                <p className="text-gray-600 mt-1">Add news, blog post, or discover item</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/content"
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Creating...' : 'Create Content'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Type */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Content Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.type === 'news' ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="news"
                  checked={formData.type === 'news'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span className="font-bold">News Article</span>
              </label>
              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.type === 'blog' ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="blog"
                  checked={formData.type === 'blog'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span className="font-bold">Blog Post</span>
              </label>
              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.type === 'discover' ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="discover"
                  checked={formData.type === 'discover'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span className="font-bold">Discover Item</span>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title (English) *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title (Vietnamese)
                </label>
                <input
                  type="text"
                  name="titleVi"
                  value={formData.titleVi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                  placeholder="Nhập tiêu đề"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-mono text-sm"
                  placeholder="auto-generated-from-title"
                />
              </div>
              {formData.type !== 'discover' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Excerpt / Description *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                    placeholder="Brief summary or excerpt"
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Content (English) *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={12}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-mono text-sm"
                  placeholder="Enter full content (supports Markdown)"
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🖼️</span>
              Featured Image
            </h2>
            <ImageUpload
              value={formData.image}
              onChange={(dataUrl) => setFormData(prev => ({ ...prev, image: dataUrl }))}
              label="Upload Featured Image"
            />
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.type !== 'discover' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                    placeholder="Author name"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Culture">Culture</option>
                  <option value="Business">Business</option>
                  <option value="Community">Community</option>
                  <option value="Events">Events</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
              {formData.type !== 'discover' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                    placeholder="Comma-separated tags (e.g., Vietnamese Food, Honolulu, Pho)"
                  />
                </div>
              )}
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span className="font-bold text-gray-700">Publish immediately</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/content"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-6 h-6" />
              {saving ? 'Creating...' : 'Create Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
