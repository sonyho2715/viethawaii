import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Plus, Search, MapPin, Clock, ShoppingBag, TrendingUp, Star, Briefcase, Home, Car, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Rao Vặt | Chợ VietHawaii',
  description: 'Mua bán, việc làm, nhà ở cho cộng đồng người Việt Hawaii. Jobs, housing, for sale in Vietnamese Hawaii community.',
  openGraph: {
    title: 'Rao Vặt - Chợ VietHawaii',
    description: 'Mua bán, việc làm, nhà ở cho cộng đồng người Việt Hawaii',
  },
};

// Updated color mapping with new palette
const categoryColors: Record<string, string> = {
  'viec-lam': 'from-accent-500 to-accent-600',
  'nha-o': 'from-success-500 to-success-600',
  'mua-ban': 'from-warm-500 to-warm-600',
  'dich-vu': 'from-purple-500 to-purple-600',
  'cong-dong': 'from-primary-500 to-primary-600',
};

const categoryIcons: Record<string, React.ReactNode> = {
  'viec-lam': <Briefcase className="w-6 h-6 text-white" />,
  'nha-o': <Home className="w-6 h-6 text-white" />,
  'mua-ban': <ShoppingBag className="w-6 h-6 text-white" />,
  'dich-vu': <Car className="w-6 h-6 text-white" />,
  'cong-dong': <Users className="w-6 h-6 text-white" />,
};

async function getRecentListings() {
  try {
    const listings = await db.classifiedListing.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        category: true,
        user: { select: { name: true } },
      },
    });
    return listings;
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await db.classifiedCategory.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            listings: { where: { status: 'active' } },
          },
        },
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return categories;
  } catch {
    return [];
  }
}

export default async function ClassifiedsPage() {
  const [listings, categories] = await Promise.all([
    getRecentListings(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section - New Teal/Blue Gradient */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingBag className="w-10 h-10" />
                <h1 className="text-4xl md:text-5xl font-black">
                  Chợ & Rao Vặt
                </h1>
              </div>
              <p className="text-xl text-primary-100 mb-2">
                VietHawaii Marketplace
              </p>
              <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
                Mua bán, việc làm, nhà ở cho cộng đồng người Việt tại Hawaii
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <form className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm rao vặt..."
                      className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-300 shadow-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-warm-500 hover:bg-warm-600 text-white font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                  >
                    Tìm
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Post Ad Button */}
        <section className="bg-white border-b py-6">
          <div className="max-w-6xl mx-auto px-4 flex justify-center gap-4 flex-wrap">
            <Link
              href="/rao-vat/dang-tin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-warm-500 to-warm-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Đăng Tin Miễn Phí
            </Link>
            <div className="flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary-700 rounded-xl">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">{listings.length} tin đang hoạt động</span>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Danh Mục</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category) => {
                const colorClass = categoryColors[category.slug] || 'from-gray-500 to-gray-600';
                const icon = categoryIcons[category.slug];
                return (
                  <Link
                    key={category.slug}
                    href={`/rao-vat/danh-muc/${category.slug}`}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary-300 transition-all text-center group hover:-translate-y-1"
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${colorClass} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      {icon || <span className="text-2xl">{category.icon || '📦'}</span>}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.nameEn}</p>
                    {category._count.listings > 0 && (
                      <span className="inline-block mt-3 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full">
                        {category._count.listings} tin
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent Listings */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-warm-500 to-warm-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Tin Mới Nhất</h2>
              </div>
              <Link href="/rao-vat/tat-ca" className="text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1">
                Xem tất cả
                <span className="text-lg">→</span>
              </Link>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-black text-gray-700 mb-3">
                  Chưa có tin rao vặt
                </h3>
                <p className="text-gray-500 mb-6 text-lg">
                  Hãy là người đầu tiên đăng tin!
                </p>
                <Link
                  href="/rao-vat/dang-tin"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold rounded-xl transition-all hover:shadow-xl hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Đăng Tin Ngay
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/rao-vat/tin/${listing.id}`}
                    className="bg-white rounded-2xl border border-gray-100 hover:border-primary-300 hover:shadow-xl transition-all p-5 flex gap-4 group"
                  >
                    {listing.images[0] ? (
                      <div className="w-28 h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">{listing.title}</h3>
                        {listing.urgent && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full flex-shrink-0">
                            Gấp
                          </span>
                        )}
                      </div>
                      <p className="text-primary-600 font-black text-lg">
                        {listing.price
                          ? `$${listing.price.toLocaleString()}`
                          : listing.priceType === 'free'
                          ? 'Miễn Phí'
                          : 'Liên Hệ'}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          {listing.island}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-primary-500" />
                          {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-black mb-4">Bạn có đồ muốn bán?</h2>
            <p className="text-lg text-primary-100 mb-6">
              Đăng tin miễn phí và tiếp cận hàng ngàn người Việt tại Hawaii
            </p>
            <Link
              href="/rao-vat/dang-tin"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-primary-600 font-bold rounded-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Đăng Tin Ngay
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
      <div className="lg:hidden h-20" />
    </div>
  );
}
