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
  Download,
  Upload,
  MoreVertical
} from 'lucide-react';
import { sampleBusinesses } from '@/lib/sampleData';
import { realBusinesses } from '@/lib/enhancedData';

export default function AdminBusinesses() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIsland, setSelectedIsland] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const allBusinesses = [...sampleBusinesses, ...realBusinesses];

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const filteredBusinesses = allBusinesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIsland = selectedIsland === 'All' || business.island === selectedIsland;
    const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
    return matchesSearch && matchesIsland && matchesCategory;
  });

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Business Management</h1>
              <p className="text-gray-600 mt-1">Manage all Vietnamese businesses in Hawaii</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold">
                ← Dashboard
              </Link>
              <button className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Business
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Total Businesses</div>
            <div className="text-3xl font-black text-gray-900">{allBusinesses.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Featured</div>
            <div className="text-3xl font-black text-gray-900">{allBusinesses.filter(b => b.featured).length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Verified</div>
            <div className="text-3xl font-black text-gray-900">{allBusinesses.filter(b => b.verified).length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Avg Rating</div>
            <div className="text-3xl font-black text-gray-900">
              {(allBusinesses.reduce((acc, b) => acc + b.rating, 0) / allBusinesses.length).toFixed(1)}
            </div>
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
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Island Filter */}
            <div>
              <select
                value={selectedIsland}
                onChange={(e) => setSelectedIsland(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
              >
                <option value="All">All Islands</option>
                <option value="Oahu">Oahu</option>
                <option value="Maui">Maui</option>
                <option value="Big Island">Big Island</option>
                <option value="Kauai">Kauai</option>
                <option value="Molokai">Molokai</option>
                <option value="Lanai">Lanai</option>
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
                <option value="Restaurant">Restaurant</option>
                <option value="Market">Market</option>
                <option value="Beauty">Beauty</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Professional">Professional</option>
                <option value="Services">Services</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
            <div className="ml-auto text-sm text-gray-600 font-semibold">
              Showing {filteredBusinesses.length} of {allBusinesses.length} businesses
            </div>
          </div>
        </div>

        {/* Businesses Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBusinesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-orange-100 rounded-lg flex items-center justify-center text-2xl">
                          {business.category === 'Restaurant' && '🍜'}
                          {business.category === 'Market' && '🛒'}
                          {business.category === 'Beauty' && '💅'}
                          {business.category === 'Healthcare' && '🏥'}
                          {business.category === 'Professional' && '💼'}
                          {business.category === 'Services' && '🛠️'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{business.name}</div>
                          {business.nameVi && (
                            <div className="text-sm text-gray-600">{business.nameVi}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-gray-900">{business.city}</div>
                          <div className="text-gray-600">{business.island}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                        {business.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-900">{business.rating}</span>
                        <span className="text-gray-500 text-sm">({business.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {business.verified && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                            Verified
                          </span>
                        )}
                        {business.featured && (
                          <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-bold">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/business/${business.slug}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
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
                Showing <span className="font-semibold">1</span> to <span className="font-semibold">{filteredBusinesses.length}</span> of <span className="font-semibold">{allBusinesses.length}</span> results
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
