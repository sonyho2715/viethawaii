'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  X,
  List,
  Grid3X3,
  PartyPopper,
  Users,
  Church,
  Palette,
  Briefcase,
  CalendarDays,
  Ticket,
  DollarSign,
} from 'lucide-react';

export interface SerializedEvent {
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
  };
  neighborhood: SerializedNeighborhood | null;
}

export interface SerializedNeighborhood {
  id: number;
  name: string;
  slug: string;
}

interface EventsClientProps {
  initialEvents: SerializedEvent[];
  neighborhoods: SerializedNeighborhood[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchParams: {
    type?: string;
    neighborhood?: string;
    q?: string;
    month?: string;
    year?: string;
    view?: 'list' | 'calendar';
    page?: string;
  };
  selectedMonth: number;
  selectedYear: number;
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

const MONTH_NAMES = {
  vn: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const DAY_NAMES = {
  vn: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

export default function EventsClient({
  initialEvents,
  neighborhoods,
  pagination,
  searchParams,
  selectedMonth,
  selectedYear,
}: EventsClientProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const { language } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>(searchParams.view || 'list');

  const [filters, setFilters] = useState({
    q: searchParams.q || '',
    type: searchParams.type || '',
    neighborhood: searchParams.neighborhood || '',
  });

  const updateFilters = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.type) params.set('type', filters.type);
    if (filters.neighborhood) params.set('neighborhood', filters.neighborhood);
    if (viewMode === 'calendar') {
      params.set('view', 'calendar');
      params.set('month', String(selectedMonth));
      params.set('year', String(selectedYear));
    }
    router.push(`/su-kien?${params.toString()}`);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      type: '',
      neighborhood: '',
    });
    router.push(`/su-kien${viewMode === 'calendar' ? `?view=calendar&month=${selectedMonth}&year=${selectedYear}` : ''}`);
    setShowFilters(false);
  };

  const switchView = (view: 'list' | 'calendar') => {
    setViewMode(view);
    const params = new URLSearchParams(currentSearchParams.toString());
    if (view === 'calendar') {
      params.set('view', 'calendar');
      if (!params.get('month')) params.set('month', String(new Date().getMonth()));
      if (!params.get('year')) params.set('year', String(new Date().getFullYear()));
    } else {
      params.delete('view');
      params.delete('month');
      params.delete('year');
    }
    router.push(`/su-kien?${params.toString()}`);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    let newMonth = selectedMonth;
    let newYear = selectedYear;
    if (direction === 'prev') {
      newMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
      newYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    } else {
      newMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
      newYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
    }
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set('month', String(newMonth));
    params.set('year', String(newYear));
    router.push(`/su-kien?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set('page', String(page));
    router.push(`/su-kien?${params.toString()}`);
  };

  const hasActiveFilters = filters.q || filters.type || filters.neighborhood;

  const formatEventDate = (startDate: string, endDate: string | null, isAllDay: boolean) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
    };

    const locale = language === 'vn' ? 'vi-VN' : 'en-US';
    let result = start.toLocaleDateString(locale, dateOptions);

    if (!isAllDay) {
      result += ` ${start.toLocaleTimeString(locale, timeOptions)}`;
    }

    if (end && end.toDateString() !== start.toDateString()) {
      result += ` - ${end.toLocaleDateString(locale, dateOptions)}`;
    }

    return result;
  };

  const getEventIcon = (eventType: string) => {
    return EVENT_TYPE_ICONS[eventType] || CalendarDays;
  };

  // Calendar helper functions
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (date: number) => {
    return initialEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date &&
        eventDate.getMonth() === selectedMonth &&
        eventDate.getFullYear() === selectedYear
      );
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const today = new Date();
    const isCurrentMonth = today.getMonth() === selectedMonth && today.getFullYear() === selectedYear;

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Calendar header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {MONTH_NAMES[language][selectedMonth]} {selectedYear}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b">
          {DAY_NAMES[language].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const eventsForDay = day ? getEventsForDate(day) : [];
            const isToday = isCurrentMonth && day === today.getDate();

            return (
              <div
                key={index}
                className={`min-h-[100px] p-1 border-b border-r ${
                  day === null ? 'bg-gray-50' : ''
                } ${isToday ? 'bg-orange-50' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-orange-600' : 'text-gray-700'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {eventsForDay.slice(0, 2).map(event => (
                        <Link
                          key={event.id}
                          href={`/su-kien/${event.id}`}
                          className="block text-xs p-1 rounded bg-orange-100 text-orange-800 hover:bg-orange-200 truncate"
                        >
                          {language === 'vn' ? event.title : event.titleEn || event.title}
                        </Link>
                      ))}
                      {eventsForDay.length > 2 && (
                        <div className="text-xs text-gray-500 pl-1">
                          +{eventsForDay.length - 2} {language === 'vn' ? 'sự kiện' : 'more'}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Calendar className="h-8 w-8" />
                {language === 'vn' ? 'Sự kiện' : 'Events'}
              </h1>
              <p className="text-orange-100 mt-1">
                {language === 'vn'
                  ? 'Khám phá các sự kiện của cộng đồng Việt Hawaii'
                  : 'Discover Vietnamese Hawaiian community events'}
              </p>
            </div>
            <Button asChild className="bg-white text-orange-600 hover:bg-orange-50">
              <Link href="/su-kien/dang-tin">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'vn' ? 'Đăng sự kiện' : 'Post Event'}
              </Link>
            </Button>
          </div>

          {/* Search and View Toggle */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={filters.q}
                onChange={e => updateFilters('q', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                placeholder={language === 'vn' ? 'Tìm kiếm sự kiện...' : 'Search events...'}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
            <div className="flex bg-white/20 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => switchView('list')}
                className={viewMode === 'list' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/20'}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => switchView('calendar')}
                className={viewMode === 'calendar' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/20'}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white text-gray-700 border-white hover:bg-orange-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              {language === 'vn' ? 'Lọc' : 'Filter'}
            </Button>
            <Button onClick={applyFilters} className="bg-orange-700 hover:bg-orange-800">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Event Type Quick Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={!filters.type ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                updateFilters('type', '');
                applyFilters();
              }}
              className={!filters.type ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              {language === 'vn' ? 'Tất cả' : 'All'}
            </Button>
            {Object.entries(EVENT_TYPE_LABELS[language]).map(([type, label]) => {
              const IconComponent = EVENT_TYPE_ICONS[type];
              return (
                <Button
                  key={type}
                  variant={filters.type === type.toLowerCase() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    updateFilters('type', type.toLowerCase());
                    setTimeout(applyFilters, 0);
                  }}
                  className={filters.type === type.toLowerCase() ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  <IconComponent className="h-4 w-4 mr-1" />
                  {label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Select value={filters.type} onValueChange={v => updateFilters('type', v)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'vn' ? 'Loại sự kiện' : 'Event Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'vn' ? 'Tất cả' : 'All'}</SelectItem>
                  {Object.entries(EVENT_TYPE_LABELS[language]).map(([type, label]) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.neighborhood} onValueChange={v => updateFilters('neighborhood', v)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'vn' ? 'Khu vực' : 'Area'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{language === 'vn' ? 'Tất cả' : 'All'}</SelectItem>
                  {neighborhoods.map(n => (
                    <SelectItem key={n.id} value={n.slug}>
                      {n.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  <X className="h-4 w-4 mr-1" />
                  {language === 'vn' ? 'Xóa bộ lọc' : 'Clear filters'}
                </Button>
              )}
              <Button onClick={applyFilters} size="sm" className="bg-orange-600 hover:bg-orange-700">
                {language === 'vn' ? 'Áp dụng' : 'Apply'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {viewMode === 'calendar' ? (
          <>
            {/* Calendar View */}
            {renderCalendar()}
          </>
        ) : (
          <>
            {/* List View */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {pagination.total} {language === 'vn' ? 'sự kiện' : 'events'}
              </p>
            </div>

            {initialEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'vn' ? 'Không tìm thấy sự kiện' : 'No events found'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {language === 'vn'
                    ? 'Thử thay đổi bộ lọc hoặc đăng sự kiện mới'
                    : 'Try adjusting your filters or post a new event'}
                </p>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/su-kien/dang-tin">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'vn' ? 'Đăng sự kiện' : 'Post Event'}
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Event Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {initialEvents.map(event => {
                    const IconComponent = getEventIcon(event.eventType);
                    return (
                      <Link key={event.id} href={`/su-kien/${event.id}`} className="group">
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                          {/* Image or Icon */}
                          <div className="relative aspect-[16/9] bg-gradient-to-br from-orange-100 to-amber-100">
                            {event.imageUrl ? (
                              <Image
                                src={event.imageUrl}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <IconComponent className="h-16 w-16 text-orange-300" />
                              </div>
                            )}
                            {/* Event Type Badge */}
                            <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                              <IconComponent className="h-3 w-3" />
                              {EVENT_TYPE_LABELS[language][event.eventType as keyof typeof EVENT_TYPE_LABELS['vn']] || event.eventType}
                            </span>
                            {/* Price Badge */}
                            {event.isFree ? (
                              <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                {language === 'vn' ? 'Miễn phí' : 'Free'}
                              </span>
                            ) : event.price && (
                              <span className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {event.price}
                              </span>
                            )}
                          </div>

                          <CardContent className="p-4">
                            {/* Date */}
                            <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                              <Clock className="h-4 w-4" />
                              <span>{formatEventDate(event.startDate, event.endDate, event.isAllDay)}</span>
                            </div>

                            {/* Title */}
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                              {language === 'vn' ? event.title : event.titleEn || event.title}
                            </h3>

                            {/* Description */}
                            {(event.description || event.descriptionEn) && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {language === 'vn' ? event.description : event.descriptionEn || event.description}
                              </p>
                            )}

                            {/* Location */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.neighborhood?.name || event.location || 'Hawaii'}
                              </span>
                              {event.ticketUrl && (
                                <span className="flex items-center gap-1 text-orange-600">
                                  <Ticket className="h-3 w-3" />
                                  {language === 'vn' ? 'Có vé' : 'Tickets'}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                      .map((p, idx, arr) => (
                        <span key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2">...</span>}
                          <Button
                            variant={p === pagination.page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => goToPage(p)}
                            className={p === pagination.page ? 'bg-orange-600 hover:bg-orange-700' : ''}
                          >
                            {p}
                          </Button>
                        </span>
                      ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
