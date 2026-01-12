import { db } from '@/lib/db';
import Link from 'next/link';
import { Search, Filter, ExternalLink, Tag, Store, Percent, DollarSign, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CouponActions from './CouponActions';

interface SearchParams {
  active?: string;
  category?: string;
  search?: string;
  page?: string;
}

const discountTypeLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  PERCENTAGE: { label: 'Phần trăm', icon: Percent },
  FIXED_AMOUNT: { label: 'Số tiền', icon: DollarSign },
  FREE_ITEM: { label: 'Miễn phí', icon: Gift },
};

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const pageSize = 20;

  const now = new Date();
  const where: Record<string, unknown> = {};

  if (params.active === 'true') {
    where.isActive = true;
    where.endDate = { gte: now };
  } else if (params.active === 'false') {
    where.OR = [
      { isActive: false },
      { endDate: { lt: now } },
    ];
  }

  if (params.category) {
    where.business = { category: params.category };
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { titleEn: { contains: params.search, mode: 'insensitive' } },
      { business: { name: { contains: params.search, mode: 'insensitive' } } },
    ];
  }

  const [coupons, totalCount, categories] = await Promise.all([
    db.coupon.findMany({
      where,
      include: {
        business: { select: { id: true, name: true, category: true } },
        _count: { select: { claims: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.coupon.count({ where }),
    db.business.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const formatDiscount = (type: string, value: number) => {
    switch (type) {
      case 'PERCENTAGE':
        return `${value}%`;
      case 'FIXED_AMOUNT':
        return `$${value}`;
      case 'FREE_ITEM':
        return 'Miễn phí';
      default:
        return value;
    }
  };

  const isExpired = (endDate: Date) => new Date(endDate) < now;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="h-7 w-7 text-rose-600" />
            Quản lý Khuyến mãi
          </h1>
          <p className="text-gray-600">Tổng: {totalCount} khuyến mãi</p>
        </div>
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
                placeholder="Tìm theo tên khuyến mãi hoặc doanh nghiệp..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              name="active"
              defaultValue={params.active || ''}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Hết hạn/Tắt</option>
            </select>
            <select
              name="category"
              defaultValue={params.category || ''}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.category} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="outline">
            Lọc
          </Button>
        </form>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khuyến mãi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doanh nghiệp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời hạn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đã dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.map((coupon) => {
              const expired = isExpired(coupon.endDate);
              const typeInfo = discountTypeLabels[coupon.discountType];
              const TypeIcon = typeInfo?.icon || Tag;

              return (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {coupon.imageUrl ? (
                        <img
                          src={coupon.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
                          <TypeIcon className="h-6 w-6 text-rose-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-[200px]">
                          {coupon.title}
                        </p>
                        {coupon.code && (
                          <p className="text-xs text-gray-500 font-mono">{coupon.code}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{coupon.business.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded bg-rose-100 text-rose-800">
                      <TypeIcon className="h-3 w-3" />
                      {formatDiscount(coupon.discountType, Number(coupon.discountValue))}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>
                      <p>{new Date(coupon.startDate).toLocaleDateString('vi-VN')}</p>
                      <p className="text-xs text-gray-500">
                        → {new Date(coupon.endDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {coupon._count.claims}
                    {coupon.maxUses && ` / ${coupon.maxUses}`}
                  </td>
                  <td className="px-6 py-4">
                    {expired ? (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
                        Hết hạn
                      </span>
                    ) : coupon.isActive ? (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-800">
                        Tắt
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/khuyen-mai/${coupon.id}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-rose-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <CouponActions coupon={coupon} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy khuyến mãi nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/coupons?page=${p}${params.active ? `&active=${params.active}` : ''}${params.category ? `&category=${params.category}` : ''}${params.search ? `&search=${params.search}` : ''}`}
              className={`px-4 py-2 rounded-lg ${
                p === page
                  ? 'bg-rose-600 text-white'
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
