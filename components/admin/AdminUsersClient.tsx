'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Mail,
  Calendar,
  Shield,
  Star,
  Heart,
  Image as ImageIcon,
  Store,
  Chrome,
  Facebook,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  MoreVertical,
  User,
  MapPin,
  Bell
} from 'lucide-react';

interface AdminUsersClientProps {
  users: any[];
  stats: {
    total: number;
    active: number;
    oauth: number;
    businessOwners: number;
    admins: number;
    recentLogins: number;
  };
}

export default function AdminUsersClient({ users: initialUsers, stats }: AdminUsersClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedProvider, setSelectedProvider] = useState('All');

  const filteredUsers = initialUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || user.role === selectedRole.toUpperCase();
    const matchesProvider = selectedProvider === 'All' ||
                           (selectedProvider === 'OAuth' && user.provider && user.provider !== 'email') ||
                           (selectedProvider === 'Email' && (!user.provider || user.provider === 'email'));
    return matchesSearch && matchesRole && matchesProvider;
  });

  const getProviderIcon = (provider: string | null) => {
    if (!provider || provider === 'email') return <Mail className="w-4 h-4" />;
    if (provider === 'google') return <Chrome className="w-4 h-4 text-blue-600" />;
    if (provider === 'facebook') return <Facebook className="w-4 h-4 text-blue-700" />;
    return <User className="w-4 h-4" />;
  };

  const getProviderName = (provider: string | null) => {
    if (!provider || provider === 'email') return 'Email';
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage users, OAuth connections, and permissions</p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <div className="text-xs font-semibold text-gray-600 mb-1">Total Users</div>
            <div className="text-2xl font-black text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <div className="text-xs font-semibold text-gray-600 mb-1">Active</div>
            <div className="text-2xl font-black text-gray-900">{stats.active}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
            <div className="text-xs font-semibold text-gray-600 mb-1">OAuth</div>
            <div className="text-2xl font-black text-gray-900">{stats.oauth}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
            <div className="text-xs font-semibold text-gray-600 mb-1">Business Owners</div>
            <div className="text-2xl font-black text-gray-900">{stats.businessOwners}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
            <div className="text-xs font-semibold text-gray-600 mb-1">Admins</div>
            <div className="text-2xl font-black text-gray-900">{stats.admins}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-cyan-500">
            <div className="text-xs font-semibold text-gray-600 mb-1">Active (7d)</div>
            <div className="text-2xl font-black text-gray-900">{stats.recentLogins}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
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
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
              >
                <option value="All">All Roles</option>
                <option value="USER">User</option>
                <option value="BUSINESS_OWNER">Business Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
              >
                <option value="All">All Providers</option>
                <option value="Email">Email</option>
                <option value="OAuth">OAuth</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <div className="text-sm text-gray-600 font-semibold">
              Showing {filteredUsers.length} of {initialUsers.length} users
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
                    {user.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                    {getProviderIcon(user.provider)}
                    {user.email}
                  </p>
                </div>
              </div>

              {/* OAuth Provider Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                  user.role === 'BUSINESS_OWNER' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {user.role.replace('_', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  user.provider === 'google' ? 'bg-blue-50 text-blue-700' :
                  user.provider === 'facebook' ? 'bg-blue-50 text-blue-800' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {getProviderIcon(user.provider)}
                  {getProviderName(user.provider)}
                </span>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <Star className="w-4 h-4" />
                    <span className="text-xs font-semibold">Reviews</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mt-1">{user._count.reviews}</div>
                </div>
                <div className="bg-rose-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-rose-700">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs font-semibold">Favorites</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mt-1">{user.savedBusinesses.length}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-purple-700">
                    <Bell className="w-4 h-4" />
                    <span className="text-xs font-semibold">Searches</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mt-1">{user._count.savedSearches}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Store className="w-4 h-4" />
                    <span className="text-xs font-semibold">Businesses</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mt-1">{user._count.businesses}</div>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined: {formatDate(user.createdAt)}</span>
                </div>
                {user.emailVerified && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Email verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
