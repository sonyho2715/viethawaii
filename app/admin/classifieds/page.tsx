'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertCircle,
  Search,
  MapPin,
  Tag,
  User,
  Calendar,
  DollarSign,
  Flag,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface ClassifiedListing {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  price?: number;
  priceType: string;
  island: string;
  city?: string;
  status: 'pending' | 'active' | 'rejected' | 'expired' | 'sold';
  images: string[];
  createdAt: string;
  expiresAt: string;
  reportCount: number;
  category: {
    name: string;
    nameEn: string;
    icon?: string;
  };
  user: {
    name?: string;
    email: string;
  };
}

type StatusFilter = 'all' | 'pending' | 'active' | 'rejected' | 'expired' | 'reported';

export default function AdminClassifiedsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<ClassifiedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<ClassifiedListing | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchListings();
    }
  }, [statusFilter]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const result = await response.json();

      if (result.success && result.user.role === 'admin') {
        await fetchListings();
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    }
  };

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }
      if (searchQuery) {
        params.set('search', searchQuery);
      }

      const response = await fetch(`/api/admin/classifieds?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setListings(data.listings || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (listingId: string) => {
    setActionLoading(listingId);
    try {
      const response = await fetch(`/api/admin/classifieds/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (response.ok) {
        setListings((prev) =>
          prev.map((l) => (l.id === listingId ? { ...l, status: 'active' as const } : l))
        );
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error approving listing:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (listingId: string) => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    setActionLoading(listingId);
    try {
      const response = await fetch(`/api/admin/classifieds/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason: rejectReason }),
      });

      if (response.ok) {
        setListings((prev) =>
          prev.map((l) => (l.id === listingId ? { ...l, status: 'rejected' as const } : l))
        );
        setShowRejectModal(false);
        setShowDetailsModal(false);
        setRejectReason('');
      }
    } catch (error) {
      console.error('Error rejecting listing:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Bạn có chắc muốn xóa tin này?')) return;

    setActionLoading(listingId);
    try {
      const response = await fetch(`/api/admin/classifieds/${listingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setListings((prev) => prev.filter((l) => l.id !== listingId));
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const formatPrice = (listing: ClassifiedListing) => {
    if (listing.priceType === 'free') return 'Miễn Phí';
    if (listing.priceType === 'contact') return 'Liên Hệ';
    if (listing.price) return `$${listing.price.toLocaleString()}`;
    return 'N/A';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      active: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      expired: 'bg-gray-100 text-gray-700 border-gray-200',
      sold: 'bg-blue-100 text-blue-700 border-blue-200',
    };

    const labels: Record<string, string> = {
      pending: 'Chờ Duyệt',
      active: 'Đang Hoạt Động',
      rejected: 'Đã Từ Chối',
      expired: 'Hết Hạn',
      sold: 'Đã Bán',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const statusCounts = {
    all: listings.length,
    pending: listings.filter((l) => l.status === 'pending').length,
    active: listings.filter((l) => l.status === 'active').length,
    rejected: listings.filter((l) => l.status === 'rejected').length,
    expired: listings.filter((l) => l.status === 'expired').length,
    reported: listings.filter((l) => l.reportCount > 0).length,
  };

  const filteredListings = listings.filter((listing) => {
    if (statusFilter === 'reported') {
      return listing.reportCount > 0;
    }
    if (statusFilter !== 'all' && listing.status !== statusFilter) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        listing.title.toLowerCase().includes(query) ||
        listing.user.email.toLowerCase().includes(query) ||
        listing.category.name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản Lý Rao Vặt
        </h1>
        <p className="text-gray-600">
          Duyệt và quản lý tin đăng rao vặt
        </p>
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { key: 'all', label: 'Tất Cả', icon: Tag, color: 'gray' },
          { key: 'pending', label: 'Chờ Duyệt', icon: Clock, color: 'yellow' },
          { key: 'active', label: 'Hoạt Động', icon: CheckCircle, color: 'green' },
          { key: 'rejected', label: 'Từ Chối', icon: XCircle, color: 'red' },
          { key: 'expired', label: 'Hết Hạn', icon: AlertCircle, color: 'gray' },
          { key: 'reported', label: 'Bị Báo Cáo', icon: Flag, color: 'orange' },
        ].map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key as StatusFilter)}
            className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left ${
              statusFilter === key ? 'ring-2 ring-rose-500' : ''
            }`}
          >
            <Icon className={`w-6 h-6 mb-2 text-${color}-500`} />
            <div className="text-2xl font-bold text-gray-900">
              {statusCounts[key as keyof typeof statusCounts] || 0}
            </div>
            <div className="text-sm text-gray-600">{label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, email, danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition"
          >
            Tìm Kiếm
          </button>
        </div>
      </form>

      {/* Listings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredListings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Tin Đăng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Người Đăng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Ngày Đăng
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {listing.images[0] ? (
                          <img
                            src={listing.images[0]}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Tag className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 line-clamp-1">
                            {listing.title}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            {listing.category.icon} {listing.category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {listing.user.name || 'N/A'}
                        </div>
                        <div className="text-gray-500">{listing.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(listing)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(listing.status)}
                        {listing.reportCount > 0 && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                            {listing.reportCount} báo cáo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                          title="Xem Chi Tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <Link
                          href={`/rao-vat/tin/${listing.id}`}
                          target="_blank"
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                          title="Xem Trên Website"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        {listing.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(listing.id)}
                              disabled={actionLoading === listing.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                              title="Duyệt"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedListing(listing);
                                setShowRejectModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Từ Chối"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(listing.id)}
                          disabled={actionLoading === listing.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không có tin đăng nào
            </h3>
            <p className="text-gray-500">
              {statusFilter === 'pending'
                ? 'Không có tin đăng nào đang chờ duyệt'
                : 'Thử thay đổi bộ lọc hoặc tìm kiếm'}
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Chi Tiết Tin Đăng</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Images */}
              {selectedListing.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {selectedListing.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Title & Status */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedListing.title}
                  </h3>
                  {getStatusBadge(selectedListing.status)}
                </div>
                {selectedListing.titleEn && (
                  <p className="text-gray-600 italic">{selectedListing.titleEn}</p>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500">Giá</div>
                    <div className="font-semibold">{formatPrice(selectedListing)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Tag className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">Danh Mục</div>
                    <div className="font-semibold">
                      {selectedListing.category.icon} {selectedListing.category.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-rose-600" />
                  <div>
                    <div className="text-sm text-gray-500">Vị Trí</div>
                    <div className="font-semibold">
                      {selectedListing.city ? `${selectedListing.city}, ` : ''}
                      {selectedListing.island}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-500">Ngày Đăng</div>
                    <div className="font-semibold">
                      {new Date(selectedListing.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Mô Tả</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedListing.description}
                </p>
              </div>

              {/* User Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {selectedListing.user.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedListing.user.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reports Warning */}
              {selectedListing.reportCount > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-700">
                    <Flag className="w-5 h-5" />
                    <span className="font-semibold">
                      Tin này có {selectedListing.reportCount} báo cáo vi phạm
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedListing.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedListing.id)}
                      disabled={actionLoading === selectedListing.id}
                      className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Duyệt Tin
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setShowRejectModal(true);
                      }}
                      className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Từ Chối
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(selectedListing.id)}
                  disabled={actionLoading === selectedListing.id}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Từ Chối Tin Đăng
              </h2>
              <p className="text-gray-700 mb-4">
                Vui lòng nhập lý do từ chối tin &quot;{selectedListing.title}&quot;.
                Lý do này sẽ được gửi đến người đăng.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none mb-4"
                placeholder="VD: Nội dung không phù hợp, thiếu thông tin, vi phạm quy định..."
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleReject(selectedListing.id)}
                  disabled={actionLoading === selectedListing.id}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50"
                >
                  Xác Nhận Từ Chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
