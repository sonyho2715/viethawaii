'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Eye, Edit, Clock, AlertCircle, Search, Filter, ChevronLeft } from 'lucide-react';

interface PendingBusiness {
  id: string;
  businessName: string;
  businessNameVi?: string;
  category: string;
  island: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  ownerName: string;
  ownerEmail: string;
  submittedDate: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
}

// Mock data - replace with API call
const mockPendingBusinesses: PendingBusiness[] = [
  {
    id: 'pb1',
    businessName: 'Saigon Taste Restaurant',
    businessNameVi: 'Nhà Hàng Sài Gòn',
    category: 'Restaurant',
    island: 'Oahu',
    city: 'Honolulu',
    address: '123 Main St, Honolulu, HI 96814',
    phone: '(808) 555-0123',
    email: 'info@saigontaste.com',
    website: 'https://saigontaste.com',
    description: 'Authentic Vietnamese cuisine with traditional recipes passed down through generations.',
    ownerName: 'John Nguyen',
    ownerEmail: 'john@saigontaste.com',
    submittedDate: '2025-11-13',
    status: 'pending'
  },
  {
    id: 'pb2',
    businessName: 'Little Saigon Market',
    businessNameVi: 'Chợ Sài Gòn Nhỏ',
    category: 'Retail',
    island: 'Oahu',
    city: 'Pearl City',
    address: '456 Kamehameha Hwy, Pearl City, HI 96782',
    phone: '(808) 555-0456',
    email: 'contact@littlesaigonmarket.com',
    description: 'Vietnamese grocery store offering fresh produce, imported goods, and specialty items.',
    ownerName: 'Maria Tran',
    ownerEmail: 'maria@littlesaigonmarket.com',
    submittedDate: '2025-11-12',
    status: 'reviewing'
  },
  {
    id: 'pb3',
    businessName: 'Viet Hair Studio',
    category: 'Service',
    island: 'Oahu',
    city: 'Honolulu',
    address: '789 Kapiolani Blvd, Honolulu, HI 96814',
    phone: '(808) 555-0789',
    email: 'info@viethairstudio.com',
    description: 'Professional hair salon specializing in Asian hair types and modern styling.',
    ownerName: 'Linh Pham',
    ownerEmail: 'linh@viethairstudio.com',
    submittedDate: '2025-11-11',
    status: 'pending'
  }
];

export default function PendingBusinessesPage() {
  const [businesses, setBusinesses] = useState<PendingBusiness[]>(mockPendingBusinesses);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewing' | 'approved' | 'rejected'>('all');
  const [selectedBusiness, setSelectedBusiness] = useState<PendingBusiness | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (businessId: string) => {
    setBusinesses(prev => prev.map(b =>
      b.id === businessId ? { ...b, status: 'approved' as const } : b
    ));
    setShowDetailsModal(false);
    // TODO: API call to approve business
  };

  const handleReject = (businessId: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setBusinesses(prev => prev.map(b =>
      b.id === businessId ? { ...b, status: 'rejected' as const } : b
    ));
    setShowRejectModal(false);
    setShowDetailsModal(false);
    setRejectReason('');
    // TODO: API call to reject business with reason
  };

  const handleSetReviewing = (businessId: string) => {
    setBusinesses(prev => prev.map(b =>
      b.id === businessId ? { ...b, status: 'reviewing' as const } : b
    ));
  };

  const statusCounts = {
    all: businesses.length,
    pending: businesses.filter(b => b.status === 'pending').length,
    reviewing: businesses.filter(b => b.status === 'reviewing').length,
    approved: businesses.filter(b => b.status === 'approved').length,
    rejected: businesses.filter(b => b.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Admin Dashboard</span>
            </Link>
            <h1 className="text-2xl font-black text-gray-900">Pending Business Submissions</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { key: 'all', label: 'All Submissions', color: 'from-gray-500 to-gray-600', icon: '📋' },
            { key: 'pending', label: 'Pending', color: 'from-yellow-500 to-orange-500', icon: '⏳' },
            { key: 'reviewing', label: 'Reviewing', color: 'from-blue-500 to-cyan-500', icon: '🔍' },
            { key: 'approved', label: 'Approved', color: 'from-green-500 to-emerald-500', icon: '✅' },
            { key: 'rejected', label: 'Rejected', color: 'from-red-500 to-rose-500', icon: '❌' }
          ].map(({ key, label, color, icon }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key as any)}
              className={`bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all ${
                statusFilter === key ? 'ring-4 ring-rose-200' : ''
              }`}
            >
              <div className={`text-2xl mb-2 p-3 rounded-lg bg-gradient-to-r ${color} text-white inline-block`}>
                {icon}
              </div>
              <div className="text-3xl font-black text-gray-900">{statusCounts[key as keyof typeof statusCounts]}</div>
              <div className="text-sm font-semibold text-gray-600">{label}</div>
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by business name, owner, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Business List */}
        {filteredBusinesses.length > 0 ? (
          <div className="space-y-4">
            {filteredBusinesses.map((business) => (
              <div key={business.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-gray-900">{business.businessName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          business.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          business.status === 'reviewing' ? 'bg-blue-100 text-blue-700' :
                          business.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {business.status.toUpperCase()}
                        </span>
                      </div>
                      {business.businessNameVi && (
                        <p className="text-sm text-gray-600 italic mb-2">{business.businessNameVi}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="font-semibold">{business.category}</span>
                        <span>•</span>
                        <span>{business.city}, {business.island}</span>
                        <span>•</span>
                        <span>{business.phone}</span>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{business.description}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-700">Owner:</span>
                        <span className="text-gray-600">{business.ownerName} ({business.ownerEmail})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Clock className="w-4 h-4" />
                        <span>Submitted on {new Date(business.submittedDate).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSelectedBusiness(business);
                        setShowDetailsModal(true);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>

                    {business.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleSetReviewing(business.id)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                        >
                          Mark as Reviewing
                        </button>
                        <button
                          onClick={() => handleApprove(business.id)}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBusiness(business);
                            setShowRejectModal(true);
                          }}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}

                    {business.status === 'reviewing' && (
                      <>
                        <button
                          onClick={() => handleApprove(business.id)}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBusiness(business);
                            setShowRejectModal(true);
                          }}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}

                    {business.status === 'approved' && (
                      <span className="text-sm text-green-600 font-semibold">✓ Approved and published</span>
                    )}

                    {business.status === 'rejected' && (
                      <span className="text-sm text-red-600 font-semibold">✗ Rejected</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">Business Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Business Information</h3>
                <div className="space-y-3">
                  <div><span className="font-semibold">Name:</span> {selectedBusiness.businessName}</div>
                  {selectedBusiness.businessNameVi && (
                    <div><span className="font-semibold">Vietnamese Name:</span> {selectedBusiness.businessNameVi}</div>
                  )}
                  <div><span className="font-semibold">Category:</span> {selectedBusiness.category}</div>
                  <div><span className="font-semibold">Description:</span> {selectedBusiness.description}</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
                <div className="space-y-3">
                  <div><span className="font-semibold">Address:</span> {selectedBusiness.address}</div>
                  <div><span className="font-semibold">City:</span> {selectedBusiness.city}</div>
                  <div><span className="font-semibold">Island:</span> {selectedBusiness.island}</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div><span className="font-semibold">Phone:</span> {selectedBusiness.phone}</div>
                  <div><span className="font-semibold">Email:</span> {selectedBusiness.email}</div>
                  {selectedBusiness.website && (
                    <div><span className="font-semibold">Website:</span> <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">{selectedBusiness.website}</a></div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Owner Information</h3>
                <div className="space-y-3">
                  <div><span className="font-semibold">Name:</span> {selectedBusiness.ownerName}</div>
                  <div><span className="font-semibold">Email:</span> {selectedBusiness.ownerEmail}</div>
                  <div><span className="font-semibold">Submitted:</span> {new Date(selectedBusiness.submittedDate).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}</div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleApprove(selectedBusiness.id)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Business
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowRejectModal(true);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Business
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Reject Business Submission</h2>
              <p className="text-gray-700 mb-4">
                Please provide a reason for rejecting <strong>{selectedBusiness.businessName}</strong>. This will be sent to the business owner.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all resize-none mb-4"
                placeholder="e.g., Incomplete information, does not meet criteria, duplicate listing..."
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedBusiness.id)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
