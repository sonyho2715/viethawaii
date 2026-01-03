import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatDate, getIslandName, formatCurrency } from '@/lib/utils';
import {
  MapPin,
  Clock,
  Eye,
  Phone,
  Mail,
  MessageCircle,
  Heart,
  Flag,
  Share2,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Bed,
  Bath,
  Car,
  Square,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { incrementViewCount } from '@/app/rao-vat/actions';
import InquiryForm from './InquiryForm';
import ReportButton from './ReportButton';
import BoostButton from './BoostButton';

interface Props {
  params: Promise<{ id: string }>;
}

async function getListing(id: string) {
  const listing = await db.classifiedListing.findUnique({
    where: { id },
    include: {
      category: {
        include: { parent: true },
      },
      user: {
        select: { id: true, name: true, createdAt: true },
      },
    },
  });
  return listing;
}

async function getRelatedListings(categoryId: string, currentId: string) {
  const listings = await db.classifiedListing.findMany({
    where: {
      categoryId,
      status: 'active',
      id: { not: currentId },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });
  return listings;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    return { title: 'Tin không tìm thấy | VietHawaii' };
  }

  return {
    title: `${listing.title} | Rao Vặt VietHawaii`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: listing.images[0] ? [listing.images[0]] : undefined,
    },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  // Increment view count
  await incrementViewCount(id);

  const relatedListings = await getRelatedListings(listing.categoryId, id);

  const formatPrice = () => {
    if (listing.priceType === 'free') return 'Miễn Phí';
    if (listing.priceType === 'contact') return 'Liên Hệ';
    if (listing.price) return formatCurrency(Number(listing.price));
    return 'Liên Hệ';
  };

  const isOwner = session.userId === listing.userId;
  const categoryPath = listing.category.parent
    ? `${listing.category.parent.name} > ${listing.category.name}`
    : listing.category.name;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/rao-vat" className="text-gray-500 hover:text-rose-600">
                Rao Vặt
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href={`/rao-vat/danh-muc/${listing.category.parent?.slug || listing.category.slug}`}
                className="text-gray-500 hover:text-rose-600"
              >
                {listing.category.parent?.name || listing.category.name}
              </Link>
              {listing.category.parent && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-700">{listing.category.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Back Link */}
              <Link
                href="/rao-vat"
                className="inline-flex items-center gap-1 text-gray-500 hover:text-rose-600"
              >
                <ChevronLeft className="w-4 h-4" />
                Quay lại danh sách
              </Link>

              {/* Status Banner */}
              {listing.status !== 'active' && (
                <div
                  className={`p-4 rounded-xl flex items-center gap-3 ${
                    listing.status === 'pending'
                      ? 'bg-amber-50 border border-amber-200'
                      : listing.status === 'sold'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  {listing.status === 'pending' ? (
                    <>
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span className="text-amber-700 font-medium">
                        Tin đang chờ duyệt
                      </span>
                    </>
                  ) : listing.status === 'sold' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">Đã bán</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700 font-medium">
                        Tin không còn hoạt động
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Images */}
              <div className="bg-white rounded-xl overflow-hidden">
                {listing.images.length > 0 ? (
                  <div className="aspect-video bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <span className="text-8xl">{listing.category.icon || '📦'}</span>
                  </div>
                )}
                {listing.images.length > 1 && (
                  <div className="p-4 grid grid-cols-4 gap-2">
                    {listing.images.slice(1, 5).map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    {(listing.urgent || listing.featured) && (
                      <div className="flex gap-2 mb-2">
                        {listing.urgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">
                            KHẨN
                          </span>
                        )}
                        {listing.featured && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-600 text-xs font-bold rounded">
                            NỔI BẬT
                          </span>
                        )}
                      </div>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {listing.title}
                    </h1>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-rose-600">{formatPrice()}</div>
                    {listing.priceType === 'negotiable' && (
                      <span className="text-sm text-gray-500">Có thể thương lượng</span>
                    )}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 pb-4 border-b">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {listing.city ? `${listing.city}, ` : ''}
                    {getIslandName(listing.island, 'vi')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(listing.createdAt, 'vi')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {listing.viewCount} lượt xem
                  </span>
                </div>

                {/* Category Badge */}
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {listing.category.icon} {categoryPath}
                  </span>
                </div>
              </div>

              {/* Type-specific Details */}
              {listing.housingDetails && (
                <div className="bg-white rounded-xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Chi Tiết Nhà Ở</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(listing.housingDetails as any).bedrooms && (
                      <div className="flex items-center gap-2">
                        <Bed className="w-5 h-5 text-gray-400" />
                        <span>{(listing.housingDetails as any).bedrooms} phòng ngủ</span>
                      </div>
                    )}
                    {(listing.housingDetails as any).bathrooms && (
                      <div className="flex items-center gap-2">
                        <Bath className="w-5 h-5 text-gray-400" />
                        <span>{(listing.housingDetails as any).bathrooms} phòng tắm</span>
                      </div>
                    )}
                    {(listing.housingDetails as any).sqft && (
                      <div className="flex items-center gap-2">
                        <Square className="w-5 h-5 text-gray-400" />
                        <span>{(listing.housingDetails as any).sqft} sqft</span>
                      </div>
                    )}
                    {(listing.housingDetails as any).parking && (
                      <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-gray-400" />
                        <span>{(listing.housingDetails as any).parking} chỗ đậu xe</span>
                      </div>
                    )}
                    {(listing.housingDetails as any).availableDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span>
                          Có phòng từ{' '}
                          {new Date(
                            (listing.housingDetails as any).availableDate
                          ).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(listing.housingDetails as any).furnished && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
                        Có nội thất
                      </span>
                    )}
                    {(listing.housingDetails as any).petsAllowed && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                        Cho phép thú cưng
                      </span>
                    )}
                    {(listing.housingDetails as any).utilitiesIncluded && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded">
                        Bao điện nước
                      </span>
                    )}
                  </div>
                </div>
              )}

              {listing.jobDetails && (
                <div className="bg-white rounded-xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Chi Tiết Việc Làm</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {(listing.jobDetails as any).employmentType && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        <span>
                          {(listing.jobDetails as any).employmentType === 'full-time'
                            ? 'Toàn thời gian'
                            : (listing.jobDetails as any).employmentType === 'part-time'
                            ? 'Bán thời gian'
                            : (listing.jobDetails as any).employmentType}
                        </span>
                      </div>
                    )}
                    {((listing.jobDetails as any).salaryMin ||
                      (listing.jobDetails as any).salaryMax) && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">$</span>
                        <span>
                          {(listing.jobDetails as any).salaryMin &&
                            formatCurrency((listing.jobDetails as any).salaryMin)}
                          {(listing.jobDetails as any).salaryMin &&
                            (listing.jobDetails as any).salaryMax &&
                            ' - '}
                          {(listing.jobDetails as any).salaryMax &&
                            formatCurrency((listing.jobDetails as any).salaryMax)}
                        </span>
                      </div>
                    )}
                    {(listing.jobDetails as any).experienceRequired && (
                      <div>
                        <span className="text-gray-500">Kinh nghiệm: </span>
                        <span>{(listing.jobDetails as any).experienceRequired}</span>
                      </div>
                    )}
                    {(listing.jobDetails as any).schedule && (
                      <div>
                        <span className="text-gray-500">Lịch làm: </span>
                        <span>{(listing.jobDetails as any).schedule}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {listing.vehicleDetails && (
                <div className="bg-white rounded-xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Chi Tiết Xe</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(listing.vehicleDetails as any).make && (
                      <div>
                        <span className="text-gray-500 text-sm">Hãng</span>
                        <p className="font-medium">{(listing.vehicleDetails as any).make}</p>
                      </div>
                    )}
                    {(listing.vehicleDetails as any).model && (
                      <div>
                        <span className="text-gray-500 text-sm">Dòng</span>
                        <p className="font-medium">{(listing.vehicleDetails as any).model}</p>
                      </div>
                    )}
                    {(listing.vehicleDetails as any).year && (
                      <div>
                        <span className="text-gray-500 text-sm">Năm</span>
                        <p className="font-medium">{(listing.vehicleDetails as any).year}</p>
                      </div>
                    )}
                    {(listing.vehicleDetails as any).mileage && (
                      <div>
                        <span className="text-gray-500 text-sm">Số dặm</span>
                        <p className="font-medium">
                          {Number((listing.vehicleDetails as any).mileage).toLocaleString()} mi
                        </p>
                      </div>
                    )}
                    {(listing.vehicleDetails as any).condition && (
                      <div>
                        <span className="text-gray-500 text-sm">Tình trạng</span>
                        <p className="font-medium">{(listing.vehicleDetails as any).condition}</p>
                      </div>
                    )}
                    {(listing.vehicleDetails as any).transmission && (
                      <div>
                        <span className="text-gray-500 text-sm">Hộp số</span>
                        <p className="font-medium">
                          {(listing.vehicleDetails as any).transmission === 'automatic'
                            ? 'Tự động'
                            : 'Số sàn'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Mô Tả</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">{listing.description}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Heart className="w-5 h-5" />
                  Lưu tin
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Share2 className="w-5 h-5" />
                  Chia sẻ
                </button>
                {!isOwner && listing.status === 'active' && (
                  <ReportButton listingId={listing.id} />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Poster Info */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Người Đăng</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {listing.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{listing.user.name}</p>
                    <p className="text-sm text-gray-500">
                      Thành viên từ{' '}
                      {new Date(listing.user.createdAt).toLocaleDateString('vi-VN', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              {listing.status === 'active' && !isOwner && (
                <div className="bg-white rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Liên Hệ</h3>

                  {(listing.contactMethod === 'phone' || listing.contactMethod === 'both') &&
                    listing.contactPhone && (
                      <a
                        href={`tel:${listing.contactPhone}`}
                        className="flex items-center gap-3 w-full px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition mb-3"
                      >
                        <Phone className="w-5 h-5" />
                        {listing.contactPhone}
                      </a>
                    )}

                  {(listing.contactMethod === 'email' || listing.contactMethod === 'both') &&
                    listing.contactEmail && (
                      <a
                        href={`mailto:${listing.contactEmail}`}
                        className="flex items-center gap-3 w-full px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition mb-3"
                      >
                        <Mail className="w-5 h-5" />
                        Gửi Email
                      </a>
                    )}

                  {listing.contactMethod === 'message' && (
                    <InquiryForm listingId={listing.id} />
                  )}
                </div>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="font-bold text-amber-800 mb-4">Tin của bạn</h3>
                  <div className="space-y-2">
                    <BoostButton listingId={listing.id} isFeatured={listing.featured} />
                    <Link
                      href={`/rao-vat/tin/${listing.id}/sua`}
                      className="block w-full px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition text-center"
                    >
                      Sửa Tin
                    </Link>
                    <button className="w-full px-4 py-2 border border-amber-300 text-amber-700 rounded-lg font-semibold hover:bg-amber-100 transition">
                      Gia Hạn Tin
                    </button>
                    <button className="w-full px-4 py-2 border border-green-300 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition">
                      Đánh Dấu Đã Bán
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Listings */}
          {relatedListings.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tin Liên Quan</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedListings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/rao-vat/tin/${item.id}`}
                    className="bg-white rounded-lg border hover:shadow-md transition p-4"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      {item.images[0] ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-4xl">{item.category.icon || '📦'}</span>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                    <p className="text-rose-600 font-bold mt-1">
                      {item.price ? formatCurrency(Number(item.price)) : 'Liên Hệ'}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
