import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Plus, Search, MapPin, Clock, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Rao Vặt | Classifieds | VietHawaii',
  description: 'Mua bán, việc làm, nhà ở cho cộng đồng người Việt Hawaii. Jobs, housing, for sale in Vietnamese Hawaii community.',
  openGraph: {
    title: 'Rao Vặt - VietHawaii Classifieds',
    description: 'Mua bán, việc làm, nhà ở cho cộng đồng người Việt Hawaii',
  },
};

// Color mapping for category slugs
const categoryColors: Record<string, string> = {
  'viec-lam': 'bg-blue-500',
  'nha-o': 'bg-green-500',
  'mua-ban': 'bg-orange-500',
  'dich-vu': 'bg-purple-500',
  'cong-dong': 'bg-rose-500',
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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-600 via-red-700 to-yellow-500 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Rao Vặt
              </h1>
              <p className="text-xl text-red-100 mb-2">
                VietHawaii Classifieds
              </p>
              <p className="text-lg text-red-100 max-w-2xl mx-auto mb-8">
                Mua bán, việc làm, nhà ở cho cộng đồng người Việt Hawaii
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <form className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm rao vặt..."
                      className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition-colors"
                  >
                    Tìm
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Post Ad Button */}
        <section className="bg-white border-b py-4">
          <div className="max-w-6xl mx-auto px-4 flex justify-center">
            <Link
              href="/rao-vat/dang-tin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Đăng Tin Miễn Phí
            </Link>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Danh Mục</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category) => {
                const color = categoryColors[category.slug] || 'bg-gray-500';
                return (
                  <Link
                    key={category.slug}
                    href={`/rao-vat/danh-muc/${category.slug}`}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center group"
                  >
                    <div className={`w-14 h-14 mx-auto mb-3 ${color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform text-2xl`}>
                      {category.icon || '📦'}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.nameEn}</p>
                    {category._count.listings > 0 && (
                      <span className="inline-block mt-2 text-xs text-gray-400">
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
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tin Mới Nhất</h2>
              <Link href="/rao-vat/tat-ca" className="text-red-600 hover:text-red-700 font-medium">
                Xem tất cả →
              </Link>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Chưa có tin rao vặt
                </h3>
                <p className="text-gray-500 mb-4">
                  Hãy là người đầu tiên đăng tin!
                </p>
                <Link
                  href="/rao-vat/dang-tin"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
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
                    className="bg-white rounded-lg border hover:border-red-300 hover:shadow-md transition-all p-4 flex gap-4"
                  >
                    {listing.images[0] ? (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                        {listing.urgent && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                            Gấp
                          </span>
                        )}
                      </div>
                      <p className="text-red-600 font-semibold mt-1">
                        {listing.price
                          ? `$${listing.price.toLocaleString()}`
                          : listing.priceType === 'free'
                          ? 'Miễn Phí'
                          : 'Liên Hệ'}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {listing.island}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
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
      </main>

      <Footer />
    </div>
  );
}
