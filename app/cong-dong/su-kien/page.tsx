import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Calendar, MapPin, Clock, ChevronRight, Filter, Plus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Sự Kiện Cộng Đồng | Community Events | VietHawaii',
  description: 'Tìm kiếm sự kiện cộng đồng người Việt tại Hawaii. Lễ hội, văn hóa, tôn giáo và nhiều hơn nữa.',
  openGraph: {
    title: 'Sự Kiện Cộng Đồng Người Việt Hawaii',
    description: 'Tham gia các sự kiện văn hóa, tôn giáo và cộng đồng',
  },
};

interface SearchParams {
  category?: string;
  island?: string;
  month?: string;
}

const eventCategories = [
  { value: 'all', label: 'Tất Cả', labelEn: 'All' },
  { value: 'cultural', label: 'Văn Hóa', labelEn: 'Cultural' },
  { value: 'religious', label: 'Tôn Giáo', labelEn: 'Religious' },
  { value: 'business', label: 'Kinh Doanh', labelEn: 'Business' },
  { value: 'social', label: 'Xã Hội', labelEn: 'Social' },
  { value: 'educational', label: 'Giáo Dục', labelEn: 'Educational' },
];

const islands = [
  { value: 'all', label: 'Tất Cả Đảo' },
  { value: 'oahu', label: "O'ahu" },
  { value: 'maui', label: 'Maui' },
  { value: 'big-island', label: 'Big Island' },
  { value: 'kauai', label: "Kaua'i" },
];

async function getEvents(searchParams: SearchParams) {
  const where: Record<string, unknown> = {
    status: 'approved',
    startDate: { gte: new Date() },
  };

  if (searchParams.category && searchParams.category !== 'all') {
    where.category = searchParams.category;
  }

  if (searchParams.island && searchParams.island !== 'all') {
    where.island = searchParams.island;
  }

  if (searchParams.month) {
    const [year, month] = searchParams.month.split('-').map(Number);
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);
    where.startDate = { gte: startOfMonth, lte: endOfMonth };
  }

  try {
    const events = await db.communityEvent.findMany({
      where,
      orderBy: { startDate: 'asc' },
    });
    return events;
  } catch {
    return [];
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const events = await getEvents(params);
  const currentCategory = params.category || 'all';
  const currentIsland = params.island || 'all';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-red-600 via-red-700 to-yellow-500 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 text-red-200 mb-4">
              <Link href="/cong-dong" className="hover:text-white">Cộng Đồng</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Sự Kiện</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Sự Kiện Cộng Đồng</h1>
                <p className="text-red-100">Community Events</p>
              </div>
              <Link
                href="/cong-dong/su-kien/them-moi"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition"
              >
                <Plus className="w-5 h-5" />
                Đăng Sự Kiện
              </Link>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b py-4 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {eventCategories.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/cong-dong/su-kien?category=${cat.value}${currentIsland !== 'all' ? `&island=${currentIsland}` : ''}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      currentCategory === cat.value
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>

              <div className="h-6 w-px bg-gray-300" />

              {/* Island Filter */}
              <select
                defaultValue={currentIsland}
                onChange={(e) => {
                  window.location.href = `/cong-dong/su-kien?category=${currentCategory}&island=${e.target.value}`;
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {islands.map((island) => (
                  <option key={island.value} value={island.value}>
                    {island.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Events List */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            {events.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Không tìm thấy sự kiện
                </h3>
                <p className="text-gray-500 mb-6">
                  Không có sự kiện nào phù hợp với bộ lọc của bạn. Hãy thử thay đổi bộ lọc hoặc đăng sự kiện của bạn!
                </p>
                <Link
                  href="/cong-dong/su-kien/them-moi"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Đăng Sự Kiện Mới
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/cong-dong/su-kien/${event.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row"
                  >
                    {/* Image */}
                    <div className="md:w-64 flex-shrink-0">
                      {event.image ? (
                        <div className="aspect-video md:aspect-square bg-gray-100 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video md:aspect-square bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                          {eventCategories.find((c) => c.value === event.category)?.label || event.category}
                        </span>
                        {event.isFree && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            Miễn Phí
                          </span>
                        )}
                        {event.featured && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                            Nổi Bật
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {event.title}
                      </h2>
                      {event.titleEn && (
                        <p className="text-gray-500 mb-3">{event.titleEn}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-red-500" />
                          {new Date(event.startDate).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-500" />
                          {new Date(event.startDate).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        {event.venue && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-green-500" />
                            {event.venue}, {event.island}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
