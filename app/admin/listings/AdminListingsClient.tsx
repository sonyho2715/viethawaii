'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, ExternalLink } from 'lucide-react';
import ListingActions from './ListingActions';
import BulkActionsBar from './BulkActionsBar';

interface ListingData {
  id: number;
  title: string;
  price: number | null;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
  category: { id: number; nameVn: string; slug: string };
  images: { id: number; imageUrl: string }[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-800' },
  ACTIVE: { label: 'Đang hiển thị', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Từ chối', color: 'bg-red-100 text-red-800' },
  EXPIRED: { label: 'Hết hạn', color: 'bg-gray-100 text-gray-800' },
  SOLD: { label: 'Đã bán', color: 'bg-blue-100 text-blue-800' },
  DELETED: { label: 'Đã xóa', color: 'bg-gray-100 text-gray-500' },
};

interface AdminListingsClientProps {
  listings: ListingData[];
  totalCount: number;
}

export default function AdminListingsClient({
  listings,
  totalCount,
}: AdminListingsClientProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleId = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedIds(listings.map((l) => l.id));
  const deselectAll = () => setSelectedIds([]);
  const allSelected = listings.length > 0 && selectedIds.length === listings.length;

  return (
    <>
      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedIds={selectedIds}
        totalCount={listings.length}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        allSelected={allSelected}
      />

      {/* Listings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={allSelected ? deselectAll : selectAll}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tin đăng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người đăng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đăng
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listings.map((listing) => (
              <tr
                key={listing.id}
                className={`hover:bg-gray-50 ${
                  selectedIds.includes(listing.id) ? 'bg-teal-50/50' : ''
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(listing.id)}
                    onChange={() => toggleId(listing.id)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {listing.images[0] ? (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={listing.images[0].imageUrl}
                          alt={listing.title}
                          fill
                          sizes="48px"
                          className="rounded-lg object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate max-w-[300px]">
                        {listing.title}
                      </p>
                      {listing.price && (
                        <p className="text-sm text-teal-600 font-medium">
                          ${Number(listing.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-gray-900">{listing.user.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{listing.user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {listing.category.nameVn}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      statusLabels[listing.status]?.color || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {statusLabels[listing.status]?.label || listing.status}
                  </span>
                  {listing.isFeatured && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/rao-vat/chi-tiet/${listing.id}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-teal-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <ListingActions listing={listing} />
                  </div>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy tin đăng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
