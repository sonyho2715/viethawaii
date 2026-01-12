import { db } from '@/lib/db';
import Link from 'next/link';
import { Search, Filter, ExternalLink, Calendar, PartyPopper, Users, Church, Palette, Briefcase, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventActions from './EventActions';

interface SearchParams {
  status?: string;
  type?: string;
  search?: string;
  page?: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-800' },
  APPROVED: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  COMPLETED: { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-800' },
};

const eventTypeLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  FESTIVAL: { label: 'Lễ hội', icon: PartyPopper },
  COMMUNITY: { label: 'Cộng đồng', icon: Users },
  RELIGIOUS: { label: 'Tôn giáo', icon: Church },
  CULTURAL: { label: 'Văn hóa', icon: Palette },
  BUSINESS: { label: 'Kinh doanh', icon: Briefcase },
  OTHER: { label: 'Khác', icon: CalendarDays },
};

export default async function AdminEventsPage({
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

  if (params.type && params.type !== 'all') {
    where.eventType = params.type;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { titleEn: { contains: params.search, mode: 'insensitive' } },
      { user: { email: { contains: params.search, mode: 'insensitive' } } },
    ];
  }

  const [events, totalCount, pendingCount] = await Promise.all([
    db.event.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        neighborhood: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.event.count({ where }),
    db.event.count({ where: { status: 'PENDING' } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const statusOptions = ['all', 'PENDING', 'APPROVED', 'CANCELLED', 'COMPLETED'];
  const typeOptions = ['all', 'FESTIVAL', 'COMMUNITY', 'RELIGIOUS', 'CULTURAL', 'BUSINESS', 'OTHER'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-7 w-7 text-orange-600" />
            Quản lý Sự kiện
          </h1>
          <p className="text-gray-600">Tổng: {totalCount} sự kiện</p>
        </div>
        {pendingCount > 0 && (
          <Link href="/admin/events?status=PENDING">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Duyệt sự kiện ({pendingCount})
            </Button>
          </Link>
        )}
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
                placeholder="Tìm theo tên sự kiện hoặc email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              name="status"
              defaultValue={params.status || 'all'}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'Tất cả trạng thái' : statusLabels[status]?.label || status}
                </option>
              ))}
            </select>
            <select
              name="type"
              defaultValue={params.type || 'all'}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Tất cả loại' : eventTypeLabels[type]?.label || type}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="outline">
            Lọc
          </Button>
        </form>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sự kiện
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
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
            {events.map((event) => {
              const typeInfo = eventTypeLabels[event.eventType];
              const TypeIcon = typeInfo?.icon || CalendarDays;
              return (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                          <TypeIcon className="h-6 w-6 text-orange-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-[300px]">
                          {event.title}
                        </p>
                        {event.location && (
                          <p className="text-sm text-gray-500 truncate max-w-[300px]">
                            {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-800">
                      <TypeIcon className="h-3 w-3" />
                      {typeInfo?.label || event.eventType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{event.user.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{event.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>
                      <p>{new Date(event.startDate).toLocaleDateString('vi-VN')}</p>
                      {!event.isAllDay && (
                        <p className="text-xs text-gray-500">
                          {new Date(event.startDate).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        statusLabels[event.status]?.color || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusLabels[event.status]?.label || event.status}
                    </span>
                    {event.isFree && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        Miễn phí
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/su-kien/${event.id}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-orange-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <EventActions event={event} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy sự kiện nào
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
              href={`/admin/events?page=${p}${params.status ? `&status=${params.status}` : ''}${params.type ? `&type=${params.type}` : ''}${params.search ? `&search=${params.search}` : ''}`}
              className={`px-4 py-2 rounded-lg ${
                p === page
                  ? 'bg-orange-600 text-white'
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
