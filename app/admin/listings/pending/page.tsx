import { db } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, Clock, Eye } from 'lucide-react';
import PendingListingCard from './PendingListingCard';

export default async function PendingListingsPage() {
  const pendingListings = await db.listing.findMany({
    where: { status: 'PENDING' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: { select: { listings: true } },
        },
      },
      category: { select: { id: true, nameVn: true, slug: true } },
      neighborhood: { select: { name: true } },
      images: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { createdAt: 'asc' }, // Oldest first (FIFO)
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/listings"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Duyệt tin đăng</h1>
            <p className="text-gray-600">
              {pendingListings.length} tin đang chờ duyệt
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-800 rounded-lg">
          <Clock className="h-5 w-5" />
          <span className="font-medium">
            {pendingListings.length} chờ duyệt
          </span>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Mẹo:</strong> Nhấn nút &quot;Duyệt&quot; để phê duyệt hoặc &quot;Từ chối&quot; để từ chối tin đăng.
          Tin sẽ tự động chuyển sang tin tiếp theo sau khi xử lý.
        </p>
      </div>

      {/* Pending Listings */}
      {pendingListings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <Eye className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không có tin nào cần duyệt
          </h2>
          <p className="text-gray-600 mb-4">
            Tất cả tin đăng đã được xử lý. Quay lại sau để kiểm tra tin mới.
          </p>
          <Link
            href="/admin/listings"
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Xem tất cả tin đăng
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingListings.map((listing, index) => (
            <PendingListingCard
              key={listing.id}
              listing={listing}
              index={index + 1}
              total={pendingListings.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
