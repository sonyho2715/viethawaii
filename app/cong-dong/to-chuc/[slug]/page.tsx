import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { MapPin, Phone, Mail, Globe, ChevronRight, ExternalLink, Clock, CheckCircle, Facebook, Building2, Church, Heart, Briefcase, Users, GraduationCap, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ServiceTime {
  day: string;
  time: string;
  name?: string;
}

const organizationTypes: Record<string, { label: string; icon: typeof Building2 }> = {
  religious: { label: 'Tôn Giáo', icon: Church },
  cultural: { label: 'Văn Hóa', icon: Heart },
  business: { label: 'Kinh Doanh', icon: Briefcase },
  social: { label: 'Xã Hội', icon: Users },
  educational: { label: 'Giáo Dục', icon: GraduationCap },
};

const subtypeLabels: Record<string, string> = {
  catholic: 'Công Giáo',
  buddhist: 'Phật Giáo',
  protestant: 'Tin Lành',
  caodai: 'Cao Đài',
  hoahao: 'Hòa Hảo',
};

async function getOrganization(slug: string) {
  try {
    const org = await db.communityOrganization.findUnique({
      where: { slug, published: true },
    });
    return org;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const org = await getOrganization(slug);

  if (!org) {
    return { title: 'Tổ Chức Không Tìm Thấy | VietHawaii' };
  }

  return {
    title: `${org.name} | VietHawaii`,
    description: org.description.slice(0, 160),
    openGraph: {
      title: org.name,
      description: org.description.slice(0, 160),
      images: org.image ? [org.image] : org.logo ? [org.logo] : undefined,
    },
  };
}

export default async function OrganizationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const org = await getOrganization(slug);

  if (!org) {
    notFound();
  }

  const TypeIcon = organizationTypes[org.type]?.icon || Building2;
  const typeLabel = organizationTypes[org.type]?.label || org.type;

  // Parse service schedule if it exists
  let serviceSchedule: ServiceTime[] = [];
  if (org.serviceSchedule && Array.isArray(org.serviceSchedule)) {
    serviceSchedule = org.serviceSchedule as unknown as ServiceTime[];
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero with Image */}
        <section className="relative">
          {org.image ? (
            <div className="h-64 md:h-80 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={org.image}
                alt={org.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          ) : (
            <div className="h-64 md:h-72 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 flex items-center justify-center">
              {org.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={org.logo}
                  alt={org.name}
                  className="w-32 h-32 object-contain"
                />
              ) : (
                <TypeIcon className="w-24 h-24 text-white/30" />
              )}
            </div>
          )}

          {/* Breadcrumb */}
          <div className="absolute top-4 left-0 right-0">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Link href="/cong-dong" className="hover:text-white">Cộng Đồng</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/cong-dong/to-chuc" className="hover:text-white">Tổ Chức</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{org.name}</span>
              </div>
            </div>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 text-white pb-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1">
                  <TypeIcon className="w-4 h-4" />
                  {typeLabel}
                </span>
                {org.subtype && subtypeLabels[org.subtype] && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {subtypeLabels[org.subtype]}
                  </span>
                )}
                {org.verified && (
                  <span className="px-3 py-1 bg-green-500/80 rounded-full text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Đã Xác Thực
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{org.name}</h1>
              {org.nameEn && (
                <p className="text-xl text-white/80">{org.nameEn}</p>
              )}
            </div>
          </div>
        </section>

        {/* Organization Details */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Giới Thiệu</h2>
                  <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                    {org.description}
                  </div>
                  {org.descriptionEn && (
                    <>
                      <hr className="my-6" />
                      <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-wrap">
                        {org.descriptionEn}
                      </div>
                    </>
                  )}
                </div>

                {/* Service Schedule (for religious organizations) */}
                {org.type === 'religious' && serviceSchedule.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-6 h-6 text-purple-600" />
                      Lịch Lễ / Lịch Tu Học
                    </h2>
                    <div className="divide-y">
                      {serviceSchedule.map((service, index) => (
                        <div key={index} className="py-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{service.day}</p>
                            {service.name && (
                              <p className="text-sm text-gray-500">{service.name}</p>
                            )}
                          </div>
                          <p className="text-gray-700 font-medium">{service.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                {org.address && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Địa Chỉ</h2>
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">{org.name}</p>
                        <p className="text-gray-600">{org.address}</p>
                        <p className="text-gray-600">
                          {org.city && `${org.city}, `}{org.island}
                          {org.zipCode && ` ${org.zipCode}`}
                        </p>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(org.address + ', ' + org.island + ', Hawaii')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Mở trong Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Liên Hệ</h3>
                  <div className="space-y-4">
                    {org.phone && (
                      <a
                        href={`tel:${org.phone}`}
                        className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition"
                      >
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <span>{org.phone}</span>
                      </a>
                    )}
                    {org.email && (
                      <a
                        href={`mailto:${org.email}`}
                        className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition"
                      >
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="truncate">{org.email}</span>
                      </a>
                    )}
                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition"
                      >
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="truncate">{org.website.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                    {org.facebookUrl && (
                      <a
                        href={org.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition"
                      >
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Facebook className="w-5 h-5 text-blue-600" />
                        </div>
                        <span>Facebook</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    Vị Trí
                  </h3>
                  <p className="text-gray-600 mb-2">{org.island}</p>
                  {org.city && <p className="text-sm text-gray-500">{org.city}</p>}
                </div>

                {/* Share */}
                <button className="w-full py-3 border border-gray-300 text-gray-700 text-center font-semibold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Chia Sẻ
                </button>

                {/* Related Organizations CTA */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-blue-900 mb-2">Tìm Thêm Tổ Chức</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Khám phá các tổ chức khác trong cộng đồng Việt Hawaii
                  </p>
                  <Link
                    href={`/cong-dong/to-chuc?type=${org.type}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Xem thêm {typeLabel.toLowerCase()}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
