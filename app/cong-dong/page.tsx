import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Calendar, Building2, MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Cộng Đồng | Community | VietHawaii',
  description: 'Kết nối với cộng đồng người Việt Hawaii. Sự kiện, tổ chức, nhà thờ, chùa chiền. Connect with Hawaiian Vietnamese community.',
  openGraph: {
    title: 'Cộng Đồng Người Việt Hawaii',
    description: 'Sự kiện và tổ chức cộng đồng người Việt Hawaii',
  },
};

async function getUpcomingEvents() {
  try {
    const events = await db.communityEvent.findMany({
      where: {
        status: 'approved',
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: 'asc' },
      take: 6,
    });
    return events;
  } catch {
    return [];
  }
}

async function getFeaturedOrganizations() {
  try {
    const orgs = await db.communityOrganization.findMany({
      where: {
        published: true,
        featured: true,
      },
      orderBy: { name: 'asc' },
      take: 6,
    });
    return orgs;
  } catch {
    return [];
  }
}

const orgTypes = [
  { type: 'religious', name: 'Tôn Giáo', nameEn: 'Religious', icon: '🙏', description: 'Nhà thờ, chùa chiền, đền miếu' },
  { type: 'cultural', name: 'Văn Hóa', nameEn: 'Cultural', icon: '🎭', description: 'Bảo tồn văn hóa Việt' },
  { type: 'business', name: 'Kinh Doanh', nameEn: 'Business', icon: '💼', description: 'Hội doanh nhân Việt' },
  { type: 'social', name: 'Xã Hội', nameEn: 'Social', icon: '🤝', description: 'Hỗ trợ cộng đồng' },
  { type: 'educational', name: 'Giáo Dục', nameEn: 'Educational', icon: '📚', description: 'Trường Việt ngữ, học bổng' },
];

export default async function CommunityPage() {
  const [events, organizations] = await Promise.all([
    getUpcomingEvents(),
    getFeaturedOrganizations(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-600 via-red-700 to-yellow-500 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Cộng Đồng Người Việt Hawaii
              </h1>
              <p className="text-xl text-red-100 mb-2">
                Vietnamese Community in Hawaii
              </p>
              <p className="text-lg text-red-100 max-w-2xl mx-auto">
                Kết nối với đồng hương, tham gia sự kiện, và tìm hiểu các tổ chức cộng đồng
              </p>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-white border-b py-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/cong-dong/su-kien"
                className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium"
              >
                <Calendar className="w-5 h-5" />
                Sự Kiện
              </Link>
              <Link
                href="/cong-dong/to-chuc"
                className="flex items-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
              >
                <Building2 className="w-5 h-5" />
                Tổ Chức
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sự Kiện Sắp Tới</h2>
                <p className="text-gray-600">Upcoming Events</p>
              </div>
              <Link href="/cong-dong/su-kien" className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {events.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Chưa có sự kiện sắp tới
                </h3>
                <p className="text-gray-500 mb-4">
                  Hãy quay lại sau để xem các sự kiện cộng đồng!
                </p>
                <Link
                  href="/cong-dong/su-kien/them-moi"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                >
                  Đăng sự kiện của bạn <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/cong-dong/su-kien/${event.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {event.image ? (
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-sm text-red-600 font-medium mb-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.startDate).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {event.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.venue}
                          </span>
                        )}
                        {event.isFree ? (
                          <span className="text-green-600 font-medium">Miễn Phí</span>
                        ) : (
                          <span>${event.ticketPrice?.toString()}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Organization Types */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Các Loại Tổ Chức</h2>
                <p className="text-gray-600">Types of Organizations</p>
              </div>
              <Link href="/cong-dong/to-chuc" className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {orgTypes.map((type) => (
                <Link
                  key={type.type}
                  href={`/cong-dong/to-chuc?type=${type.type}`}
                  className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {type.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-500">{type.nameEn}</p>
                  <p className="text-xs text-gray-400 mt-2">{type.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Organizations */}
        {organizations.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Tổ Chức Nổi Bật</h2>
                  <p className="text-gray-600">Featured Organizations</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <Link
                    key={org.id}
                    href={`/cong-dong/to-chuc/${org.slug}`}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {org.logo ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={org.logo}
                            alt={org.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{org.name}</h3>
                        {org.nameEn && (
                          <p className="text-sm text-gray-500">{org.nameEn}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {org.island}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Join Community CTA */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white text-center">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold mb-2">
                Tham Gia Cộng Đồng
              </h2>
              <p className="text-red-100 mb-6 max-w-xl mx-auto">
                Đăng ký để nhận thông báo về các sự kiện mới, kết nối với đồng hương,
                và đăng tin rao vặt miễn phí.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                Đăng Ký Miễn Phí
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
