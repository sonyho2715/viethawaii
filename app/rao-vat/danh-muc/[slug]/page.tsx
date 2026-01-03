import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingCard from '@/components/classifieds/ListingCard';
import { Search, Plus, ChevronLeft, Filter, MapPin } from 'lucide-react';
import { hawaiiIslands } from '@/lib/validations/classified';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCategory(slug: string) {
  const category = await db.classifiedCategory.findUnique({
    where: { slug },
    include: {
      children: {
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { listings: { where: { status: 'active' } } } },
        },
      },
      parent: true,
    },
  });
  return category;
}

async function getListings(
  categoryId: string,
  subcategoryIds: string[],
  filters: {
    island?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
    page?: number;
  }
) {
  const { island, priceMin, priceMax, sort = 'newest', page = 1 } = filters;
  const perPage = 20;

  const where: any = {
    status: 'active',
    OR: [{ categoryId }, { categoryId: { in: subcategoryIds } }],
  };

  if (island) {
    where.island = island;
  }

  if (priceMin !== undefined || priceMax !== undefined) {
    where.price = {};
    if (priceMin !== undefined) where.price.gte = priceMin;
    if (priceMax !== undefined) where.price.lte = priceMax;
  }

  const orderBy: any =
    sort === 'price-low'
      ? { price: 'asc' }
      : sort === 'price-high'
      ? { price: 'desc' }
      : sort === 'oldest'
      ? { createdAt: 'asc' }
      : { createdAt: 'desc' };

  const [listings, total] = await Promise.all([
    db.classifiedListing.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: true },
    }),
    db.classifiedListing.count({ where }),
  ]);

  return { listings, total, perPage, page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return { title: 'Danh mục không tìm thấy | VietHawaii' };
  }

  return {
    title: `${category.name} | Rao Vặt VietHawaii`,
    description: category.description || `Tìm ${category.name} trên VietHawaii`,
    openGraph: {
      title: `${category.name} - VietHawaii Classifieds`,
      description: category.description || `Browse ${category.nameEn} on VietHawaii`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const search = await searchParams;

  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const subcategoryIds = category.children.map((c) => c.id);

  const filters = {
    island: typeof search.island === 'string' ? search.island : undefined,
    priceMin: search.priceMin ? parseInt(search.priceMin as string) : undefined,
    priceMax: search.priceMax ? parseInt(search.priceMax as string) : undefined,
    sort: typeof search.sort === 'string' ? search.sort : 'newest',
    page: search.page ? parseInt(search.page as string) : 1,
  };

  const { listings, total, perPage, page } = await getListings(
    category.id,
    subcategoryIds,
    filters
  );

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-rose-600 to-orange-500 text-white py-8">
          <div className="max-w-6xl mx-auto px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-rose-100 mb-4">
              <Link href="/rao-vat" className="hover:text-white">
                Rao Vặt
              </Link>
              <span>/</span>
              <span className="text-white">{category.name}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-5xl">{category.icon}</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
                <p className="text-rose-100">{category.nameEn}</p>
              </div>
            </div>

            {category.description && (
              <p className="mt-4 text-rose-100 max-w-2xl">{category.description}</p>
            )}
          </div>
        </section>

        {/* Subcategories */}
        {category.children.length > 0 && (
          <section className="bg-white border-b py-4">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/rao-vat/danh-muc/${category.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    !search.sub
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả
                </Link>
                {category.children.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/rao-vat/danh-muc/${sub.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  >
                    {sub.icon} {sub.name}
                    {sub._count.listings > 0 && (
                      <span className="ml-1 text-gray-400">({sub._count.listings})</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Filters & Listings */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Link
                  href="/rao-vat"
                  className="flex items-center gap-1 text-gray-500 hover:text-rose-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Quay lại
                </Link>
                <span className="text-gray-500">|</span>
                <span className="text-gray-700">
                  {total} tin đăng
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Island Filter */}
                <div className="relative">
                  <select
                    defaultValue={filters.island || ''}
                    onChange={(e) => {
                      const url = new URL(window.location.href);
                      if (e.target.value) {
                        url.searchParams.set('island', e.target.value);
                      } else {
                        url.searchParams.delete('island');
                      }
                      window.location.href = url.toString();
                    }}
                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Tất cả đảo</option>
                    {hawaiiIslands.map((isl) => (
                      <option key={isl.value} value={isl.value}>
                        {isl.labelVi}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Sort */}
                <select
                  defaultValue={filters.sort}
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('sort', e.target.value);
                    window.location.href = url.toString();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="price-low">Giá thấp → cao</option>
                  <option value="price-high">Giá cao → thấp</option>
                </select>

                {/* Post Button */}
                <Link
                  href="/rao-vat/dang-tin"
                  className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition"
                >
                  <Plus className="w-4 h-4" />
                  Đăng Tin
                </Link>
              </div>
            </div>

            {/* Listings Grid */}
            {listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <span className="text-6xl mb-4 block">{category.icon}</span>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Chưa có tin đăng trong danh mục này
                </h3>
                <p className="text-gray-500 mb-6">
                  Hãy là người đầu tiên đăng tin!
                </p>
                <Link
                  href="/rao-vat/dang-tin"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition"
                >
                  <Plus className="w-5 h-5" />
                  Đăng Tin Ngay
                </Link>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing as any} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {page > 1 && (
                      <Link
                        href={`?page=${page - 1}${filters.island ? `&island=${filters.island}` : ''}${filters.sort ? `&sort=${filters.sort}` : ''}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Trước
                      </Link>
                    )}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Link
                          key={pageNum}
                          href={`?page=${pageNum}${filters.island ? `&island=${filters.island}` : ''}${filters.sort ? `&sort=${filters.sort}` : ''}`}
                          className={`px-4 py-2 rounded-lg ${
                            pageNum === page
                              ? 'bg-rose-500 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                    {page < totalPages && (
                      <Link
                        href={`?page=${page + 1}${filters.island ? `&island=${filters.island}` : ''}${filters.sort ? `&sort=${filters.sort}` : ''}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Sau
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
