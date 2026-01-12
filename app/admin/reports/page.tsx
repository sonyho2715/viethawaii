import { db } from '@/lib/db';
import Link from 'next/link';
import { Search, Filter, ExternalLink, AlertTriangle, Eye, FileText, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReportActions from './ReportActions';

interface SearchParams {
  status?: string;
  itemType?: string;
  search?: string;
  page?: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-800' },
  REVIEWED: { label: 'Đã xem xét', color: 'bg-blue-100 text-blue-800' },
  ACTIONED: { label: 'Đã xử lý', color: 'bg-green-100 text-green-800' },
  DISMISSED: { label: 'Bỏ qua', color: 'bg-gray-100 text-gray-800' },
};

const itemTypeLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  LISTING: { label: 'Tin đăng', icon: FileText },
  ARTICLE: { label: 'Bài viết', icon: FileText },
  USER: { label: 'Người dùng', icon: UserIcon },
};

const reasonLabels: Record<string, string> = {
  spam: 'Spam / Quảng cáo',
  scam: 'Lừa đảo',
  inappropriate: 'Nội dung không phù hợp',
  wrong_category: 'Sai danh mục',
  duplicate: 'Tin trùng lặp',
  fake: 'Thông tin giả mạo',
  offensive: 'Ngôn ngữ xúc phạm',
  other: 'Lý do khác',
};

export default async function AdminReportsPage({
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

  if (params.itemType && params.itemType !== 'all') {
    where.itemType = params.itemType;
  }

  if (params.search) {
    where.OR = [
      { reason: { contains: params.search, mode: 'insensitive' } },
      { details: { contains: params.search, mode: 'insensitive' } },
      { reporter: { email: { contains: params.search, mode: 'insensitive' } } },
    ];
  }

  const [reports, totalCount, pendingCount] = await Promise.all([
    db.report.findMany({
      where,
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        reviewedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.report.count({ where }),
    db.report.count({ where: { status: 'PENDING' } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const statusOptions = ['all', 'PENDING', 'REVIEWED', 'ACTIONED', 'DISMISSED'];
  const itemTypeOptions = ['all', 'LISTING', 'ARTICLE', 'USER'];

  // Helper to get item link
  const getItemLink = (itemType: string, itemId: number) => {
    switch (itemType) {
      case 'LISTING':
        return `/rao-vat/chi-tiet/${itemId}`;
      case 'ARTICLE':
        return `/tin-tuc/${itemId}`;
      case 'USER':
        return `/admin/users/${itemId}`;
      default:
        return '#';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Báo cáo</h1>
          <p className="text-gray-600">
            Tổng: {totalCount} báo cáo
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-sm rounded-full">
                {pendingCount} chờ xử lý
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">
              Có {pendingCount} báo cáo đang chờ xử lý
            </p>
            <p className="text-sm text-amber-700">
              Vui lòng xem xét và xử lý các báo cáo vi phạm để duy trì chất lượng nội dung.
            </p>
          </div>
        </div>
      )}

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
                placeholder="Tìm theo lý do hoặc email người báo cáo..."
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
              name="itemType"
              defaultValue={params.itemType || 'all'}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              {itemTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Tất cả loại' : itemTypeLabels[type]?.label || type}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="outline">
            Lọc
          </Button>
        </form>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nội dung bị báo cáo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lý do
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người báo cáo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày báo cáo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => {
              const ItemIcon = itemTypeLabels[report.itemType]?.icon || Eye;
              return (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ItemIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {itemTypeLabels[report.itemType]?.label || report.itemType}
                        </p>
                        <p className="text-xs text-gray-500">ID: {report.itemId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {reasonLabels[report.reason] || report.reason}
                      </p>
                      {report.details && (
                        <p className="text-xs text-gray-500 truncate max-w-[200px]" title={report.details}>
                          {report.details}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{report.reporter.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{report.reporter.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        statusLabels[report.status]?.color || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusLabels[report.status]?.label || report.status}
                    </span>
                    {report.reviewedBy && (
                      <p className="text-xs text-gray-500 mt-1">
                        bởi {report.reviewedBy.name}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={getItemLink(report.itemType, report.itemId)}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-teal-600"
                        title="Xem nội dung"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <ReportActions report={report} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {reports.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Không có báo cáo nào
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
              href={`/admin/reports?page=${p}${params.status ? `&status=${params.status}` : ''}${params.itemType ? `&itemType=${params.itemType}` : ''}${params.search ? `&search=${params.search}` : ''}`}
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
