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
  MapPin,
  Phone,
  Star,
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Business {
  id: string;
  name: string;
  nameVi?: string | null;
  slug: string;
  description: string;
  category: string;
  island: string;
  city: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  rating: number;
  reviewCount: number;
  featured: boolean;
  verified: boolean;
  status: string;
  createdAt: string;
}

export default function AdminBusinesses() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth(true, true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIsland, setSelectedIsland] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBusinesses();
    }
  }, [isAuthenticated, selectedStatus]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }
      const response = await fetch(`/api/admin/businesses?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;

    try {
      const response = await fetch('/api/admin/businesses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setBusinesses(businesses.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business');
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch('/api/admin/businesses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, featured: !featured }),
      });

      if (response.ok) {
        setBusinesses(businesses.map(b =>
          b.id === id ? { ...b, featured: !featured } : b
        ));
      }
    } catch (error) {
      console.error('Error updating business:', error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch('/api/admin/businesses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        setBusinesses(businesses.map(b =>
          b.id === id ? { ...b, status: newStatus } : b
        ));
      }
    } catch (error) {
      console.error('Error updating business:', error);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIsland = selectedIsland === 'All' || business.island === selectedIsland;
    const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
    return matchesSearch && matchesIsland && matchesCategory;
  });

  const islands = ['All', 'Oahu', 'Maui', 'Hawaii', 'Kauai', 'Molokai', 'Lanai'];
  const categories = ['All', 'Food & Dining', 'Retail & Shopping', 'Beauty & Wellness', 'Health & Medical', 'Professional Services', 'Other Services'];

  if (authLoading || (loading && businesses.length === 0)) {
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
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-red-600 to-orange-600 text-white shadow-xl z-50">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-3 mb-8">
            <div className="bg-white rounded-full p-2">
              <span className="text-2xl">🌺</span>
            </div>
            <div>
              <h1 className="text-xl font-black">VietHawaii</h1>
              <p className="text-xs text-yellow-200">Admin Dashboard</p>
            </div>
          </Link>
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/businesses" className="flex items-center gap-3 px-4 py-3 bg-white/20 rounded-lg font-semibold">
              <MapPin className="w-5 h-5" />
              Businesses
            </Link>
            <Link href="/admin/pending-businesses" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
              Pending
            </Link>
            <Link href="/admin/reviews" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
              Reviews
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
              Users
            </Link>
            <Link href="/admin/content" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
              Content
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Businesses</h1>
          <p className="text-gray-600">Manage all Vietnamese businesses across Hawaii</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Island</label>
              <select
                value={selectedIsland}
                onChange={(e) => setSelectedIsland(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                {islands.map(island => (
                  <option key={island} value={island}>{island}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{filteredBusinesses.length}</span> of{' '}
              <span className="font-bold">{businesses.length}</span> businesses
            </p>
          </div>
        </div>

        {/* Businesses Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Business</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBusinesses.length > 0 ? (
                  filteredBusinesses.map((business) => (
                    <tr key={business.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-900">{business.name}</p>
                          {business.nameVi && (
                            <p className="text-sm text-gray-500">{business.nameVi}</p>
                          )}
                          <div className="flex gap-2 mt-1">
                            {business.featured && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
                                Featured
                              </span>
                            )}
                            {business.verified && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-700">
                          <MapPin className="w-4 h-4" />
                          <span>{business.city}, {business.island}</span>
                        </div>
                        {business.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <Phone className="w-3 h-3" />
                            <span>{business.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{business.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{business.rating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({business.reviewCount})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(business.id, business.status)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            business.status === 'active'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : business.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {business.status === 'active' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : business.status === 'pending' ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {business.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/business/${business.slug}`}
                            target="_blank"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/businesses/edit/${business.id}`}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleFeatured(business.id, business.featured)}
                            className={`p-2 rounded-lg transition-colors ${
                              business.featured
                                ? 'text-yellow-600 hover:bg-yellow-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={business.featured ? 'Remove Featured' : 'Make Featured'}
                          >
                            <Star className={business.featured ? 'w-4 h-4 fill-yellow-400' : 'w-4 h-4'} />
                          </button>
                          <button
                            onClick={() => handleDelete(business.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No businesses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
