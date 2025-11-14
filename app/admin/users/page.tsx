'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  MapPin,
  Shield,
  Star,
  MessageSquare,
  Download,
  Filter,
  MoreVertical
} from 'lucide-react';

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    role: 'Customer',
    status: 'Active',
    joinDate: '2024-11-15',
    lastActive: '2025-01-10',
    location: 'Honolulu, Oahu',
    reviewCount: 12,
    favoriteCount: 8,
    verified: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@email.com',
    role: 'Business Owner',
    status: 'Active',
    joinDate: '2024-10-20',
    lastActive: '2025-01-09',
    location: 'Pearl City, Oahu',
    reviewCount: 5,
    favoriteCount: 15,
    verified: true
  },
  {
    id: '3',
    name: 'Jennifer Lee',
    email: 'jlee@email.com',
    role: 'Customer',
    status: 'Active',
    joinDate: '2024-12-01',
    lastActive: '2025-01-08',
    location: 'Kailua, Oahu',
    reviewCount: 24,
    favoriteCount: 32,
    verified: true
  },
  {
    id: '4',
    name: 'David Nguyen',
    email: 'dnguyen@email.com',
    role: 'Customer',
    status: 'Active',
    joinDate: '2024-09-15',
    lastActive: '2025-01-07',
    location: 'Waipahu, Oahu',
    reviewCount: 8,
    favoriteCount: 12,
    verified: false
  },
  {
    id: '5',
    name: 'Emily Wong',
    email: 'ewong@email.com',
    role: 'Customer',
    status: 'Active',
    joinDate: '2024-08-10',
    lastActive: '2025-01-06',
    location: 'Kaneohe, Oahu',
    reviewCount: 31,
    favoriteCount: 45,
    verified: true
  },
  {
    id: '6',
    name: 'Robert Kim',
    email: 'rkim@email.com',
    role: 'Customer',
    status: 'Suspended',
    joinDate: '2024-11-25',
    lastActive: '2025-01-05',
    location: 'Ewa Beach, Oahu',
    reviewCount: 3,
    favoriteCount: 2,
    verified: false
  },
  {
    id: '7',
    name: 'Linda Tran',
    email: 'ltran@email.com',
    role: 'Business Owner',
    status: 'Active',
    joinDate: '2024-07-05',
    lastActive: '2025-01-04',
    location: 'Honolulu, Oahu',
    reviewCount: 2,
    favoriteCount: 28,
    verified: true
  },
  {
    id: '8',
    name: 'James Park',
    email: 'jpark@email.com',
    role: 'Moderator',
    status: 'Active',
    joinDate: '2024-06-15',
    lastActive: '2025-01-10',
    location: 'Aiea, Oahu',
    reviewCount: 15,
    favoriteCount: 20,
    verified: true
  }
];

export default function AdminUsers() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(u => u.status === 'Active').length,
    businessOwners: mockUsers.filter(u => u.role === 'Business Owner').length,
    verified: mockUsers.filter(u => u.verified).length,
    suspended: mockUsers.filter(u => u.status === 'Suspended').length
  };

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
              <h1 className="text-3xl font-black text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage platform users and permissions</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold">
                ← Dashboard
              </Link>
              <button className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Total Users</div>
            <div className="text-3xl font-black text-gray-900">{stats.totalUsers}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Active</div>
            <div className="text-3xl font-black text-gray-900">{stats.activeUsers}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Business Owners</div>
            <div className="text-3xl font-black text-gray-900">{stats.businessOwners}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Verified</div>
            <div className="text-3xl font-black text-gray-900">{stats.verified}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Suspended</div>
            <div className="text-3xl font-black text-gray-900">{stats.suspended}</div>
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
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
              >
                <option value="All">All Roles</option>
                <option value="Customer">Customer</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Moderator">Moderator</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Users
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
            <div className="ml-auto text-sm text-gray-600 font-semibold">
              Showing {filteredUsers.length} of {mockUsers.length} users
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                    Activity
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-2">
                            {user.name}
                            {user.verified && (
                              <CheckCircle className="w-4 h-4 text-blue-500" title="Verified" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                        user.role === 'Moderator' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'Business Owner' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {user.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{user.reviewCount} reviews</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Last: {user.lastActive}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'Active' ? 'bg-green-100 text-green-700' :
                          user.status === 'Suspended' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Shield className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {user.status === 'Active' ? (
                          <button
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Suspend"
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Activate"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
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
                Showing <span className="font-semibold">1</span> to <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{mockUsers.length}</span> results
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
