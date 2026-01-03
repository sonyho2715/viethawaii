import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Calendar, MapPin, Clock, ChevronRight, ExternalLink, Phone, Mail, Globe, Users, Ticket, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SponsorButton from './SponsorButton';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string) {
  try {
    const event = await db.communityEvent.findUnique({
      where: { slug, status: 'approved' },
    });
    return event;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return { title: 'Sự Kiện Không Tìm Thấy | VietHawaii' };
  }

  return {
    title: `${event.title} | VietHawaii`,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      images: event.image ? [event.image] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero with Image */}
        <section className="relative">
          {event.image ? (
            <div className="h-64 md:h-96 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          ) : (
            <div className="h-64 md:h-80 bg-gradient-to-br from-red-600 via-red-700 to-yellow-500" />
          )}

          {/* Breadcrumb */}
          <div className="absolute top-4 left-0 right-0">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Link href="/cong-dong" className="hover:text-white">Cộng Đồng</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/cong-dong/su-kien" className="hover:text-white">Sự Kiện</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{event.title}</span>
              </div>
            </div>
          </div>

          {/* Event Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 text-white pb-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {event.category}
                </span>
                {event.isFree && (
                  <span className="px-3 py-1 bg-green-500/80 rounded-full text-sm font-medium">
                    Miễn Phí
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              {event.titleEn && (
                <p className="text-xl text-white/80">{event.titleEn}</p>
              )}
            </div>
          </div>
        </section>

        {/* Event Details */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Info Cards */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-red-50 rounded-xl p-4">
                    <Calendar className="w-6 h-6 text-red-600 mb-2" />
                    <p className="text-sm text-gray-500">Ngày</p>
                    <p className="font-semibold text-gray-900">{formatDate(event.startDate)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <Clock className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-500">Thời gian</p>
                    <p className="font-semibold text-gray-900">
                      {formatTime(event.startDate)}
                      {event.endDate && ` - ${formatTime(event.endDate)}`}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <MapPin className="w-6 h-6 text-green-600 mb-2" />
                    <p className="text-sm text-gray-500">Địa điểm</p>
                    <p className="font-semibold text-gray-900">
                      {event.venue || event.island}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Chi Tiết Sự Kiện</h2>
                  <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                    {event.description}
                  </div>
                  {event.descriptionEn && (
                    <>
                      <hr className="my-6" />
                      <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-wrap">
                        {event.descriptionEn}
                      </div>
                    </>
                  )}
                </div>

                {/* Location Details */}
                {event.address && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Địa Điểm</h2>
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        {event.venue && (
                          <p className="font-semibold text-gray-900">{event.venue}</p>
                        )}
                        <p className="text-gray-600">{event.address}</p>
                        <p className="text-gray-600">{event.city}, {event.island}</p>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(event.address + ', ' + event.island + ', Hawaii')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 mt-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Mở trong Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Virtual Link */}
                {event.virtualLink && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-blue-900 mb-2">Sự Kiện Online</h2>
                    <p className="text-blue-700 mb-4">Tham gia sự kiện trực tuyến qua đường link sau:</p>
                    <a
                      href={event.virtualLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                      <Globe className="w-5 h-5" />
                      Tham Gia Online
                    </a>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Ticket/RSVP Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-center mb-6">
                    {event.isFree ? (
                      <div>
                        <p className="text-3xl font-bold text-green-600">Miễn Phí</p>
                        <p className="text-gray-500">Free Event</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-3xl font-bold text-gray-900">
                          ${event.ticketPrice?.toString()}
                        </p>
                        <p className="text-gray-500">/ người</p>
                      </div>
                    )}
                  </div>

                  {event.ticketLink && (
                    <a
                      href={event.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-red-600 text-white text-center font-semibold rounded-lg hover:bg-red-700 transition mb-4"
                    >
                      <Ticket className="w-5 h-5 inline mr-2" />
                      Đăng Ký / Mua Vé
                    </a>
                  )}

                  <button className="w-full py-3 border border-gray-300 text-gray-700 text-center font-semibold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Chia Sẻ Sự Kiện
                  </button>
                </div>

                {/* Sponsor Button */}
                <SponsorButton eventId={event.id} isFeatured={event.featured} />

                {/* Organizer Info */}
                {(event.organizationName || event.contactEmail || event.contactPhone) && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-500" />
                      Ban Tổ Chức
                    </h3>
                    {event.organizationName && (
                      <p className="font-semibold text-gray-900 mb-3">{event.organizationName}</p>
                    )}
                    <div className="space-y-2">
                      {event.contactEmail && (
                        <a
                          href={`mailto:${event.contactEmail}`}
                          className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                        >
                          <Mail className="w-4 h-4" />
                          {event.contactEmail}
                        </a>
                      )}
                      {event.contactPhone && (
                        <a
                          href={`tel:${event.contactPhone}`}
                          className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                        >
                          <Phone className="w-4 h-4" />
                          {event.contactPhone}
                        </a>
                      )}
                      {event.website && (
                        <a
                          href={event.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Add to Calendar */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Thêm vào Lịch</h3>
                  <div className="space-y-2">
                    <a
                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${event.endDate ? new Date(event.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : ''}&details=${encodeURIComponent(event.description.slice(0, 200))}&location=${encodeURIComponent(event.venue || event.island)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 text-center border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition text-sm"
                    >
                      Google Calendar
                    </a>
                  </div>
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
