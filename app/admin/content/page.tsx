'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  MoreVertical,
  FileText,
  Calendar,
  Tag,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ContentItem {
  id: string;
  title: string;
  excerpt?: string;
  description?: string;
  image: string | null;
  category: string;
  author?: string;
  date?: string;
  slug: string;
  type: 'Blog' | 'News' | 'Discover';
  createdAt: string;
}

export default function AdminContent() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth(true, true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContent();
    }
  }, [isAuthenticated]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const [newsResponse, blogResponse, discoverResponse] = await Promise.all([
        fetch('/api/admin/content?type=news'),
        fetch('/api/admin/content?type=blog'),
        fetch('/api/admin/content?type=discover'),
      ]);

      const newsData = newsResponse.ok ? await newsResponse.json() : [];
      const blogData = blogResponse.ok ? await blogResponse.json() : [];
      const discoverData = discoverResponse.ok ? await discoverResponse.json() : [];

      const combined: ContentItem[] = [
        ...newsData.map((item: any) => ({
          ...item,
          type: 'News' as const,
          excerpt: item.content?.substring(0, 150) || '',
          date: new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
        })),
        ...blogData.map((item: any) => ({
          ...item,
          type: 'Blog' as const,
          date: new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
        })),
        ...discoverData.map((item: any) => ({
          ...item,
          type: 'Discover' as const,
          excerpt: item.description || item.content?.substring(0, 150) || '',
          author: 'VietHawaii',
          date: new Date(item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
        })),
      ];

      setAllContent(combined);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = allContent.filter(item => {
    const excerpt = item.excerpt || item.description || '';
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const blogCount = allContent.filter(item => item.type === 'Blog').length;
  const newsCount = allContent.filter(item => item.type === 'News').length;
  const discoverCount = allContent.filter(item => item.type === 'Discover').length;

  if (authLoading || (loading && allContent.length === 0)) {
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
            <div>
              <h1 className="text-3xl font-black text-gray-900">Content Management</h1>
              <p className="text-gray-600 mt-1">Manage blog posts and news articles</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold">
                ← Dashboard
              </Link>
              <Link href="/admin/content/new" className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Content
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Total Content</div>
            <div className="text-3xl font-black text-gray-900">{allContent.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Blog Posts</div>
            <div className="text-3xl font-black text-gray-900">{blogCount}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">News Articles</div>
            <div className="text-3xl font-black text-gray-900">{newsCount}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Discover Items</div>
            <div className="text-3xl font-black text-gray-900">{discoverCount}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
              >
                <option value="All">All Types</option>
                <option value="Blog">Blog Posts</option>
                <option value="News">News Articles</option>
                <option value="Discover">Discover Items</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
              >
                <option value="All">All Categories</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Culture">Culture</option>
                <option value="Business">Business</option>
                <option value="Community">Community</option>
                <option value="Events">Events</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
            <div className="ml-auto text-sm text-gray-600 font-semibold">
              Showing {filteredContent.length} of {allContent.length} items
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={item.image || '/images/placeholder.jpg'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-md">
                          <div className="font-bold text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-600 line-clamp-1">{item.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.type === 'Blog'
                          ? 'bg-blue-100 text-blue-700'
                          : item.type === 'News'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{item.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{item.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={item.type === 'Blog' ? `/blog/${item.slug}` : item.type === 'News' ? `/news/${item.slug}` : `/discover/${item.slug}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/admin/content/edit/${item.id}?type=${item.type.toLowerCase()}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="More"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">1</span> to <span className="font-semibold">{filteredContent.length}</span> of <span className="font-semibold">{allContent.length}</span> results
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
