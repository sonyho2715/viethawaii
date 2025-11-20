'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Search,
  Star,
  MapPin,
  Phone,
  Globe,
  Trash2,
  Bell,
  Settings,
  LogOut,
  User,
  MessageSquare
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  };
  favorites: any[];
  savedSearches: any[];
  reviews: any[];
}

export default function DashboardClient({
  user,
  favorites: initialFavorites,
  savedSearches: initialSavedSearches,
  reviews
}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'favorites' | 'searches' | 'reviews'>('favorites');
  const [favorites, setFavorites] = useState(initialFavorites);
  const [savedSearches, setSavedSearches] = useState(initialSavedSearches);

  const handleRemoveFavorite = async (businessId: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId })
      });

      if (response.ok) {
        setFavorites(favorites.filter(b => b.id !== businessId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleDeleteSearch = async (searchId: string) => {
    try {
      const response = await fetch(`/api/saved-searches?id=${searchId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSavedSearches(savedSearches.filter(s => s.id !== searchId));
      }
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-rose-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} width={64} height={64} className="rounded-full" />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'favorites'
                ? 'text-rose-600 border-b-2 border-rose-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span>Favorites ({favorites.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('searches')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'searches'
                ? 'text-rose-600 border-b-2 border-rose-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              <span>Saved Searches ({savedSearches.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'reviews'
                ? 'text-rose-600 border-b-2 border-rose-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span>My Reviews ({reviews.length})</span>
            </div>
          </button>
        </div>

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            {favorites.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600 mb-6">Start exploring and save your favorite Vietnamese businesses!</p>
                <Link
                  href="/businesses"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-orange-600 transition"
                >
                  Browse Businesses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((business) => (
                  <div key={business.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
                    <div className="relative h-48">
                      <Image
                        src={business.image || business.images?.[0] || '/placeholder.jpg'}
                        alt={business.name}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                      <button
                        onClick={() => handleRemoveFavorite(business.id)}
                        className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-red-500 hover:text-white transition"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <Link href={`/business/${business.slug}`}>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-rose-600 transition mb-1">
                          {business.name}
                        </h3>
                      </Link>
                      {business.nameVi && (
                        <p className="text-sm text-gray-600 mb-2">{business.nameVi}</p>
                      )}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{business.rating?.toFixed(1) || 'N/A'}</span>
                          <span className="text-gray-500 text-sm">({business.reviewCount})</span>
                        </div>
                        <span className="text-sm text-gray-600">{business.priceRange}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{business.city}, {business.island}</span>
                      </div>
                      <div className="flex gap-2">
                        {business.phone && (
                          <a
                            href={`tel:${business.phone}`}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-semibold"
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </a>
                        )}
                        {business.website && (
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-semibold"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Searches Tab */}
        {activeTab === 'searches' && (
          <div>
            {savedSearches.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No saved searches</h3>
                <p className="text-gray-600 mb-6">Save your favorite search filters to get notified of new matches!</p>
                <Link
                  href="/businesses"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-orange-600 transition"
                >
                  Start Searching
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedSearches.map((search) => (
                  <div key={search.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{search.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {Object.entries(search.filters as Record<string, any>).map(([key, value]) => (
                            <span
                              key={key}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                            >
                              {key}: {Array.isArray(value) ? value.join(', ') : value}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Bell className="w-4 h-4" />
                            <span>Notifications: {search.frequency}</span>
                          </div>
                          <span>Created: {new Date(search.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSearch(search.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete saved search"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            {reviews.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-6">Share your experiences with the community!</p>
                <Link
                  href="/businesses"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-orange-600 transition"
                >
                  Find Businesses to Review
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex gap-4">
                      {review.business.image && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={review.business.image}
                            alt={review.business.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <Link
                          href={`/business/${review.business.slug}`}
                          className="text-lg font-bold text-gray-900 hover:text-rose-600 transition"
                        >
                          {review.business.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                        )}
                        <p className="text-gray-700">{review.comment}</p>
                        <div className="mt-3 text-sm text-gray-500">
                          Status: <span className={`font-semibold ${
                            review.status === 'approved' ? 'text-green-600' :
                            review.status === 'rejected' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>{review.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
