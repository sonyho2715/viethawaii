'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bell,
  CheckCheck,
  Trash2,
  FileCheck,
  FileX,
  Heart,
  MessageCircle,
  Calendar,
  Megaphone,
  Filter,
  Inbox,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

interface Notification {
  id: number;
  type: string;
  title: string;
  titleEn: string | null;
  message: string;
  messageEn: string | null;
  referenceUrl: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
  actor: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

const NOTIFICATION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LISTING_APPROVED: FileCheck,
  LISTING_REJECTED: FileX,
  LISTING_SAVED: Heart,
  LISTING_INQUIRY: MessageCircle,
  LISTING_EXPIRING: Bell,
  EVENT_APPROVED: Calendar,
  EVENT_REMINDER: Calendar,
  COUPON_NEW: Megaphone,
  SYSTEM: Megaphone,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  LISTING_APPROVED: 'text-green-600 bg-green-100',
  LISTING_REJECTED: 'text-red-600 bg-red-100',
  LISTING_SAVED: 'text-pink-600 bg-pink-100',
  LISTING_INQUIRY: 'text-blue-600 bg-blue-100',
  LISTING_EXPIRING: 'text-orange-600 bg-orange-100',
  EVENT_APPROVED: 'text-purple-600 bg-purple-100',
  EVENT_REMINDER: 'text-purple-600 bg-purple-100',
  COUPON_NEW: 'text-yellow-600 bg-yellow-100',
  SYSTEM: 'text-gray-600 bg-gray-100',
};

const FILTER_OPTIONS = [
  { value: 'all', labelVn: 'Tất cả', labelEn: 'All' },
  { value: 'unread', labelVn: 'Chưa đọc', labelEn: 'Unread' },
  { value: 'LISTING_APPROVED', labelVn: 'Tin được duyệt', labelEn: 'Approved' },
  { value: 'LISTING_REJECTED', labelVn: 'Tin bị từ chối', labelEn: 'Rejected' },
  { value: 'LISTING_SAVED', labelVn: 'Tin được lưu', labelEn: 'Saved' },
  { value: 'LISTING_INQUIRY', labelVn: 'Liên hệ', labelEn: 'Inquiries' },
  { value: 'EVENT_APPROVED', labelVn: 'Sự kiện', labelEn: 'Events' },
  { value: 'SYSTEM', labelVn: 'Hệ thống', labelEn: 'System' },
];

interface NotificationsPageClientProps {
  initialNotifications: Notification[];
  initialUnreadCount: number;
}

export default function NotificationsPageClient({
  initialNotifications,
  initialUnreadCount,
}: NotificationsPageClientProps) {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.type === filter;
  });

  const markAsRead = async (id: number) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [id] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
    setIsLoading(false);
  };

  const deleteNotification = async (id: number) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
      const notification = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteAllRead = async () => {
    if (!confirm(language === 'vn' ? 'Xóa tất cả thông báo đã đọc?' : 'Delete all read notifications?')) return;
    setIsLoading(true);
    try {
      await fetch('/api/notifications?all=true', { method: 'DELETE' });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error deleting all:', error);
    }
    setIsLoading(false);
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: language === 'vn' ? vi : enUS,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            <Bell className="h-6 w-6 inline mr-2" />
            {language === 'vn' ? 'Thông báo' : 'Notifications'}
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} {language === 'vn' ? 'chưa đọc' : 'unread'}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={isLoading}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              {language === 'vn' ? 'Đọc tất cả' : 'Mark all read'}
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={deleteAllRead}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {language === 'vn' ? 'Xóa tất cả' : 'Delete all'}
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
              filter === option.value
                ? 'bg-teal-100 text-teal-700 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {language === 'vn' ? option.labelVn : option.labelEn}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Inbox className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">
              {filter === 'unread'
                ? (language === 'vn' ? 'Không có thông báo chưa đọc' : 'No unread notifications')
                : (language === 'vn' ? 'Không có thông báo nào' : 'No notifications')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => {
            const IconComponent = NOTIFICATION_ICONS[notification.type] || Bell;
            const colorClass = NOTIFICATION_COLORS[notification.type] || 'text-gray-600 bg-gray-100';
            const title = language === 'vn' ? notification.title : (notification.titleEn || notification.title);
            const message = language === 'vn' ? notification.message : (notification.messageEn || notification.message);

            const inner = (
              <div
                className={`flex gap-4 p-4 rounded-xl border transition-colors group ${
                  !notification.isRead
                    ? 'bg-blue-50/60 border-blue-100 hover:bg-blue-50'
                    : 'bg-white border-gray-100 hover:bg-gray-50'
                }`}
                onClick={() => {
                  if (!notification.isRead) markAsRead(notification.id);
                }}
              >
                {/* Icon / Avatar */}
                {notification.actor?.image ? (
                  <Avatar className="h-11 w-11 flex-shrink-0">
                    <AvatarImage src={notification.actor.image} alt={notification.actor.name || ''} />
                    <AvatarFallback>{notification.actor.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className={`h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {title}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{message}</p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{formatTime(notification.createdAt)}</p>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 self-center"
                  aria-label={language === 'vn' ? 'Xóa' : 'Delete'}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );

            if (notification.referenceUrl) {
              return (
                <Link key={notification.id} href={notification.referenceUrl} className="block">
                  {inner}
                </Link>
              );
            }

            return <div key={notification.id}>{inner}</div>;
          })}
        </div>
      )}
    </div>
  );
}
