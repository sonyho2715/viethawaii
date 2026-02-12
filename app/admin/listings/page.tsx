import { db } from '@/lib/db';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminListingsClient from './AdminListingsClient';

interface SearchParams {
  status?: string;
  category?: string;
  search?: string;
  page?: string;
}

const statusLabels: Record<string, { label: string }> = {
  PENDING: { label: 'Chờ duyệt' },
  ACTIVE: { label: 'Đang hiển thị' },
  REJECTED: { label: 'Từ chối' },
  EXPIRED: { label: 'Hết hạn' },
  SOLD: { label: 'Đã bán' },
};

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const pageSize = 20;

  const where: Record<string, unknown> = {};

  if (params.status && params.status !== 'all') {
    where.status = params.status;
  }

  if (params.category) {
    where.categoryId = parseInt(params.category);
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { user: { email: { contains: params.search, mode: 'insensitive' } } },
    ];
  }

  const [listings, totalCount, categories] = await Promise.all([
    db.listing.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, nameVn: true, slug: true } },
        images: { take: 1, orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.listing.count({ where }),
    db.category.findMany({
      where: { parentId: null },
      select: { id: true, nameVn: true },
      orderBy: { nameVn: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const statusOptions = ['all', 'PENDING', 'ACTIVE', 'REJECTED', 'EXPIRED', 'SOLD'];

  // Serialize for client component (convert Decimal/Date)
  const serializedListings = listings.map((l) => ({
    id: l.id,
    title: l.title,
    price: l.price ? Number(l.price) : null,
    status: l.status,
    isFeatured: l.isFeatured,
    createdAt: l.createdAt.toISOString(),
    user: l.user,
    category: l.category,
    images: l.images.map((img) => ({ id: img.id, imageUrl: img.imageUrl })),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tin đăng</h1>
          <p className="text-gray-600">Tổng: {totalCount} tin đăng</p>
        </div>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <Link href="/admin/listings/pending">
            Duyệt tin chờ
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={params.search || ''}
                placeholder="Tìm theo tiêu đề hoặc email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              name="status"
              defaultValue={params.status || 'all'}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'Tất cả trạng thái' : statusLabels[status]?.label || status}
                </option>
              ))}
            </select>
            <select
              name="category"
              defaultValue={params.category || ''}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameVn}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="outline">
            Lọc
          </Button>
        </form>
      </div>

      {/* Client Component with Bulk Actions + Table */}
      <AdminListingsClient
        listings={serializedListings}
        totalCount={totalCount}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/listings?page=${p}${params.status ? `&status=${params.status}` : ''}${params.category ? `&category=${params.category}` : ''}${params.search ? `&search=${params.search}` : ''}`}
              className={`px-4 py-2 rounded-lg ${
                p === page
                  ? 'bg-teal-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
