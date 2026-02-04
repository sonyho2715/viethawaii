'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  Share2,
  Ticket,
  DollarSign,
  User,
  Eye,
  PartyPopper,
  Users,
  Church,
  Palette,
  Briefcase,
  CalendarDays,
  ExternalLink,
  Edit,
  Copy,
  Facebook,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { SerializedEvent } from '../EventsClient';

interface EventDetailClientProps {
  event: {
    id: number;
    userId: string;
    title: string;
    titleEn: string | null;
    description: string | null;
    descriptionEn: string | null;
    eventType: string;
    startDate: string;
    endDate: string | null;
    isAllDay: boolean;
    isRecurring: boolean;
    recurrenceRule: string | null;
    location: string | null;
    address: string | null;
    neighborhoodId: number | null;
    contactPhone: string | null;
    contactEmail: string | null;
    website: string | null;
    imageUrl: string | null;
    ticketUrl: string | null;
    price: string | null;
    isFree: boolean;
    status: string;
    views: number;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
      createdAt: string;
    };
    neighborhood: {
      id: number;
      name: string;
      slug: string;
    } | null;
  };
  relatedEvents: SerializedEvent[];
  isOwner: boolean;
}

const EVENT_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FESTIVAL: PartyPopper,
  COMMUNITY: Users,
  RELIGIOUS: Church,
  CULTURAL: Palette,
  BUSINESS: Briefcase,
  OTHER: CalendarDays,
};

const EVENT_TYPE_LABELS = {
  vn: {
    FESTIVAL: 'Lễ hội',
    COMMUNITY: 'Cộng đồng',
    RELIGIOUS: 'Tôn giáo',
    CULTURAL: 'Văn hóa',
    BUSINESS: 'Kinh doanh',
    OTHER: 'Khác',
  },
  en: {
    FESTIVAL: 'Festival',
    COMMUNITY: 'Community',
    RELIGIOUS: 'Religious',
    CULTURAL: 'Cultural',
    BUSINESS: 'Business',
    OTHER: 'Other',
  },
};

export default function EventDetailClient({
  event,
  relatedEvents,
  isOwner,
}: EventDetailClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [showShareMenu, setShowShareMenu] = useState(false);

  const IconComponent = EVENT_TYPE_ICONS[event.eventType] || CalendarDays;

  const formatEventDate = (startDate: string, endDate: string | null, isAllDay: boolean) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
    };

    const locale = language === 'vn' ? 'vi-VN' : 'en-US';
    let result = start.toLocaleDateString(locale, dateOptions);

    if (!isAllDay) {
      result += ` • ${start.toLocaleTimeString(locale, timeOptions)}`;
      if (end) {
        result += ` - ${end.toLocaleTimeString(locale, timeOptions)}`;
      }
    } else {
      result = `${language === 'vn' ? 'Cả ngày' : 'All day'} • ${result}`;
    }

    if (end && end.toDateString() !== start.toDateString()) {
      result += ` → ${end.toLocaleDateString(locale, dateOptions)}`;
    }

    return result;
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = language === 'vn' ? event.title : event.titleEn || event.title;

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;
      case 'zalo':
        window.open(`https://zalo.me/share?url=${encodedUrl}`, '_blank');
        break;
      case 'messenger':
        window.open(`fb-messenger://share/?link=${encodedUrl}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success(language === 'vn' ? 'Đã sao chép link!' : 'Link copied!');
        break;
    }
    setShowShareMenu(false);
  };

  const addToCalendar = () => {
    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.address || event.location || ''}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(language === 'vn' ? 'Đã tải file lịch!' : 'Calendar file downloaded!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-orange-100 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === 'vn' ? 'Quay lại' : 'Back'}
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <IconComponent className="h-3 w-3" />
                  {EVENT_TYPE_LABELS[language][event.eventType as keyof typeof EVENT_TYPE_LABELS['vn']] || event.eventType}
                </span>
                {event.status !== 'APPROVED' && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    {event.status}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {language === 'vn' ? event.title : event.titleEn || event.title}
              </h1>
            </div>

            <div className="flex gap-2">
              {isOwner && (
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                  onClick={() => router.push(`/tai-khoan/su-kien/${event.id}/chinh-sua`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {language === 'vn' ? 'Chỉnh sửa' : 'Edit'}
                </Button>
              )}
              <div className="relative">
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {language === 'vn' ? 'Chia sẻ' : 'Share'}
                </Button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Facebook className="h-4 w-4 text-blue-600" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('zalo')}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      Zalo
                    </button>
                    <button
                      onClick={() => handleShare('messenger')}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4 text-purple-600" />
                      Messenger
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      {language === 'vn' ? 'Sao chép link' : 'Copy link'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            {event.imageUrl && (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Date & Time Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 rounded-lg p-3">
                    <Calendar className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-gray-900 mb-1">
                      {language === 'vn' ? 'Thời gian' : 'Date & Time'}
                    </h2>
                    <p className="text-gray-700">
                      {formatEventDate(event.startDate, event.endDate, event.isAllDay)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={addToCalendar}
                    >
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {language === 'vn' ? 'Thêm vào lịch' : 'Add to Calendar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            {(event.location || event.address) && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 rounded-lg p-3">
                      <MapPin className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg text-gray-900 mb-1">
                        {language === 'vn' ? 'Địa điểm' : 'Location'}
                      </h2>
                      {event.location && (
                        <p className="text-gray-900 font-medium">{event.location}</p>
                      )}
                      {event.address && (
                        <p className="text-gray-600">{event.address}</p>
                      )}
                      {event.neighborhood && (
                        <p className="text-gray-500 text-sm mt-1">{event.neighborhood.name}</p>
                      )}
                      {event.address && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(event.address!)}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {language === 'vn' ? 'Xem bản đồ' : 'View on Map'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {(event.description || event.descriptionEn) && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-lg text-gray-900 mb-4">
                    {language === 'vn' ? 'Chi tiết sự kiện' : 'Event Details'}
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {language === 'vn' ? event.description : event.descriptionEn || event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket / Price Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  {event.isFree ? (
                    <div className="bg-green-100 text-green-700 rounded-full py-3 px-6 inline-block mb-4">
                      <span className="text-2xl font-bold">
                        {language === 'vn' ? 'Miễn phí' : 'Free'}
                      </span>
                    </div>
                  ) : event.price ? (
                    <div className="bg-amber-100 text-amber-700 rounded-full py-3 px-6 inline-block mb-4">
                      <span className="text-2xl font-bold flex items-center gap-1">
                        <DollarSign className="h-6 w-6" />
                        {event.price}
                      </span>
                    </div>
                  ) : null}

                  {event.ticketUrl && (
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={() => window.open(event.ticketUrl!, '_blank')}
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      {language === 'vn' ? 'Mua vé' : 'Get Tickets'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            {(event.contactPhone || event.contactEmail || event.website) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {language === 'vn' ? 'Liên hệ' : 'Contact'}
                  </h3>
                  <div className="space-y-3">
                    {event.contactPhone && (
                      <a
                        href={`tel:${event.contactPhone}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-orange-600"
                      >
                        <Phone className="h-5 w-5" />
                        <span>{event.contactPhone}</span>
                      </a>
                    )}
                    {event.contactEmail && (
                      <a
                        href={`mailto:${event.contactEmail}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-orange-600"
                      >
                        <Mail className="h-5 w-5" />
                        <span>{event.contactEmail}</span>
                      </a>
                    )}
                    {event.website && (
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-orange-600"
                      >
                        <Globe className="h-5 w-5" />
                        <span className="truncate">{event.website.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Organizer */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {language === 'vn' ? 'Người tổ chức' : 'Organizer'}
                </h3>
                <div className="flex items-center gap-3">
                  {event.user.image ? (
                    <Image
                      src={event.user.image}
                      alt={event.user.name || 'User'}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-orange-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{event.user.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">
                      {language === 'vn' ? 'Tham gia' : 'Joined'}{' '}
                      {new Date(event.user.createdAt).toLocaleDateString(
                        language === 'vn' ? 'vi-VN' : 'en-US',
                        { year: 'numeric', month: 'short' }
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {event.views} {language === 'vn' ? 'lượt xem' : 'views'}
                  </span>
                  <span>
                    {language === 'vn' ? 'Đăng' : 'Posted'}{' '}
                    {new Date(event.createdAt).toLocaleDateString(
                      language === 'vn' ? 'vi-VN' : 'en-US'
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'vn' ? 'Sự kiện tương tự' : 'Similar Events'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedEvents.map(relatedEvent => {
                const RelatedIcon = EVENT_TYPE_ICONS[relatedEvent.eventType] || CalendarDays;
                return (
                  <Link key={relatedEvent.id} href={`/su-kien/${relatedEvent.id}`} className="group">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <div className="relative aspect-[16/9] bg-gradient-to-br from-orange-100 to-amber-100">
                        {relatedEvent.imageUrl ? (
                          <Image
                            src={relatedEvent.imageUrl}
                            alt={relatedEvent.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <RelatedIcon className="h-12 w-12 text-orange-300" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatShortDate(relatedEvent.startDate)}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {language === 'vn' ? relatedEvent.title : relatedEvent.titleEn || relatedEvent.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
