'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  MapPin
} from 'lucide-react';
import { sampleBusinesses } from '@/lib/sampleData';
import { realBusinesses } from '@/lib/enhancedData';

// Mock review data
const mockReviews = [
  {
    id: '1',
    businessId: 'the-pig-and-the-lady',
    businessName: 'The Pig and The Lady',
    author: 'Sarah Johnson',
    authorEmail: 'sarah.j@email.com',
    rating: 5,
    title: 'Amazing Vietnamese fusion!',
    content: 'Absolutely loved the pho! The broth was rich and flavorful. The service was excellent and the atmosphere was perfect. Will definitely come back!',
    date: '2025-01-10',
    status: 'approved',
    helpful: 24,
    reported: 0
  },
  {
    id: '2',
    businessId: 'pho-ha-noi',
    businessName: 'Pho Ha Noi',
    author: 'Michael Chen',
    authorEmail: 'mchen@email.com',
    rating: 4,
    title: 'Authentic and delicious',
    content: 'Great authentic Vietnamese food. The pho was excellent, though I wish the portions were a bit larger. Prices are very reasonable.',
    date: '2025-01-09',
    status: 'approved',
    helpful: 18,
    reported: 0
  },
  {
    id: '3',
    businessId: 'vietnamese-hale',
    businessName: 'Vietnamese Hale',
    author: 'Jennifer Lee',
    authorEmail: 'jlee@email.com',
    rating: 5,
    title: 'Best banh mi in Honolulu',
    content: 'I have tried every banh mi place in town and this is hands down the best. Fresh ingredients, perfect bread, and amazing value for money.',
    date: '2025-01-08',
    status: 'approved',
    helpful: 31,
    reported: 0
  },
  {
    id: '4',
    businessId: 'ba-le-sandwich',
    businessName: 'Ba-Le Sandwich Shop',
    author: 'David Nguyen',
    authorEmail: 'dnguyen@email.com',
    rating: 3,
    title: 'Good but could be better',
    content: 'The sandwiches are decent but not as good as I remember. Service was a bit slow during lunch rush.',
    date: '2025-01-07',
    status: 'pending',
    helpful: 5,
    reported: 1
  },
  {
    id: '5',
    businessId: 'kims-nails',
    businessName: "Kim's Nail Salon",
    author: 'Emily Wong',
    authorEmail: 'ewong@email.com',
    rating: 5,
    title: 'Always perfect nails',
    content: 'I have been coming here for years and Kim always does an amazing job. Very clean, professional, and friendly. Highly recommend!',
    date: '2025-01-06',
    status: 'approved',
    helpful: 42,
    reported: 0
  },
  {
    id: '6',
    businessId: 'pho-saigon-pearl',
    businessName: 'Pho Saigon Pearl',
    author: 'Robert Kim',
    authorEmail: 'rkim@email.com',
    rating: 2,
    title: 'Disappointed',
    content: 'Not what I expected. The pho broth was bland and the meat was tough. Service was okay but food quality was poor.',
    date: '2025-01-05',
    status: 'pending',
    helpful: 3,
    reported: 2
  }
];

export default function AdminReviews() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
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

  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = review.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || review.status === selectedStatus.toLowerCase();
    const matchesRating = selectedRating === 'All' || review.rating === parseInt(selectedRating);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const stats = {
    totalReviews: mockReviews.length,
    approved: mockReviews.filter(r => r.status === 'approved').length,
    pending: mockReviews.filter(r => r.status === 'pending').length,
    reported: mockReviews.filter(r => r.reported > 0).length,
    avgRating: (mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length).toFixed(1)
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
              <h1 className="text-3xl font-black text-gray-900">Reviews Management</h1>
              <p className="text-gray-600 mt-1">Moderate and manage customer reviews</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold">
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Total Reviews</div>
            <div className="text-3xl font-black text-gray-900">{stats.totalReviews}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Approved</div>
            <div className="text-3xl font-black text-gray-900">{stats.approved}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Pending</div>
            <div className="text-3xl font-black text-gray-900">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Reported</div>
            <div className="text-3xl font-black text-gray-900">{stats.reported}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-sm font-semibold text-gray-600 mb-1">Avg Rating</div>
            <div className="text-3xl font-black text-gray-900">{stats.avgRating}</div>
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
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-semibold"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Reviews
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
            <div className="ml-auto text-sm text-gray-600 font-semibold">
              Showing {filteredReviews.length} of {mockReviews.length} reviews
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href={`/business/${review.businessId}`}
                      className="font-bold text-lg text-gray-900 hover:text-rose-600 transition-colors"
                    >
                      {review.businessName}
                    </Link>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      review.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : review.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                    {review.reported > 0 && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Flag className="w-3 h-3" />
                        {review.reported} Report{review.reported > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
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
                      <span className="font-semibold ml-1">{review.rating}.0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {review.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {review.author}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-2">{review.title}</h3>
                <p className="text-gray-700 leading-relaxed">{review.content}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful} helpful</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span>{review.authorEmail}</span>
                </div>

                <div className="flex items-center gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-semibold transition-colors">
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold transition-colors">
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  {review.status === 'approved' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition-colors">
                      <XCircle className="w-4 h-4" />
                      Unpublish
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-semibold transition-colors">
                    <Flag className="w-4 h-4" />
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-xl shadow-md px-6 py-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">1</span> to <span className="font-semibold">{filteredReviews.length}</span> of <span className="font-semibold">{mockReviews.length}</span> results
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
  );
}
