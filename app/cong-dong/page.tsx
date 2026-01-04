import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Calendar, Building2, MapPin, Clock, Users, ChevronRight, Star, Heart, Plus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

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
  { type: 'religious', name: 'Tôn Giáo', nameEn: 'Religious', icon: '🙏', description: 'Nhà thờ, chùa chiền, đền miếu', color: 'from-purple-500 to-purple-600' },
  { type: 'cultural', name: 'Văn Hóa', nameEn: 'Cultural', icon: '🎭', description: 'Bảo tồn văn hóa Việt', color: 'from-primary-500 to-primary-600' },
  { type: 'business', name: 'Kinh Doanh', nameEn: 'Business', icon: '💼', description: 'Hội doanh nhân Việt', color: 'from-accent-500 to-accent-600' },
  { type: 'social', name: 'Xã Hội', nameEn: 'Social', icon: '🤝', description: 'Hỗ trợ cộng đồng', color: 'from-warm-500 to-warm-600' },
  { type: 'educational', name: 'Giáo Dục', nameEn: 'Educational', icon: '📚', description: 'Trường Việt ngữ, học bổng', color: 'from-success-500 to-success-600' },
];

export default async function CommunityPage() {
  const [events, organizations] = await Promise.all([
    getUpcomingEvents(),
    getFeaturedOrganizations(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section - Updated with Teal/Blue gradient */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="w-10 h-10" />
                <h1 className="text-4xl md:text-5xl font-black">
                  Cộng Đồng Người Việt Hawaii
                </h1>
              </div>
              <p className="text-xl text-primary-100 mb-2">
                Vietnamese Community in Hawaii
              </p>
              <p className="text-lg text-primary-100 max-w-2xl mx-auto">
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
                className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                Sự Kiện
              </Link>
              <Link
                href="/cong-dong/to-chuc"
                className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Building2 className="w-5 h-5" />
                Tổ Chức
              </Link>
              <Link
                href="/cong-dong/su-kien/them-moi"
                className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-warm-500 to-warm-600 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Đăng Sự Kiện
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Sự Kiện Sắp Tới</h2>
                  <p className="text-gray-500 text-sm">Upcoming Events</p>
                </div>
              </div>
              <Link href="/cong-dong/su-kien" className="text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {events.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
                <Calendar className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-black text-gray-700 mb-3">
                  Chưa có sự kiện sắp tới
                </h3>
                <p className="text-gray-500 mb-6 text-lg">
                  Hãy quay lại sau để xem các sự kiện cộng đồng!
                </p>
                <Link
                  href="/cong-dong/su-kien/them-moi"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold rounded-xl hover:shadow-xl transition-all hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Đăng Sự Kiện Của Bạn
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/cong-dong/su-kien/${event.slug}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary-300 transition-all group hover:-translate-y-1"
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
                      <div className="aspect-video bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-sm text-primary-600 font-bold mb-3">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.startDate).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-primary-600 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {event.venue && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-primary-500" />
                            {event.venue}
                          </span>
                        )}
                        {event.isFree ? (
                          <span className="px-2 py-0.5 bg-success-100 text-success-700 font-bold rounded-full text-xs">Miễn Phí</span>
                        ) : (
                          <span className="font-bold text-primary-600">${event.ticketPrice?.toString()}</span>
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
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Các Loại Tổ Chức</h2>
                  <p className="text-gray-500 text-sm">Types of Organizations</p>
                </div>
              </div>
              <Link href="/cong-dong/to-chuc" className="text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {orgTypes.map((type) => (
                <Link
                  key={type.type}
                  href={`/cong-dong/to-chuc?type=${type.type}`}
                  className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary-300 transition-all group hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <span className="text-2xl">{type.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-500">{type.nameEn}</p>
                  <p className="text-xs text-gray-400 mt-2">{type.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Organizations */}
        {organizations.length > 0 && (
          <section className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-warm-500 to-warm-600 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Tổ Chức Nổi Bật</h2>
                    <p className="text-gray-500 text-sm">Featured Organizations</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <Link
                    key={org.id}
                    href={`/cong-dong/to-chuc/${org.slug}`}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary-300 transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      {org.logo ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={org.logo}
                            alt={org.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900">{org.name}</h3>
                        {org.nameEn && (
                          <p className="text-sm text-gray-500">{org.nameEn}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4 text-primary-500" />
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
            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 rounded-3xl p-10 text-white text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white rounded-full" />
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Heart className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black mb-3">
                  Tham Gia Cộng Đồng
                </h2>
                <p className="text-primary-100 mb-8 max-w-xl mx-auto text-lg">
                  Đăng ký để nhận thông báo về các sự kiện mới, kết nối với đồng hương,
                  và đăng tin rao vặt miễn phí.
                </p>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-white text-primary-600 font-bold rounded-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  Đăng Ký Miễn Phí
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
      <div className="lg:hidden h-20" />
    </div>
  );
}
