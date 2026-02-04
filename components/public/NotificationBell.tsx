'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  FileCheck,
  FileX,
  Heart,
  MessageCircle,
  Calendar,
  Megaphone,
  X,
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

export default function NotificationBell() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=10');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark single notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
    setIsLoading(false);
  };

  // Delete notification
  const deleteNotification = async (notificationId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch(`/api/notifications?id=${notificationId}`, { method: 'DELETE' });
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: language === 'vn' ? vi : enUS,
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors"
        aria-label={language === 'vn' ? 'Thông báo' : 'Notifications'}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-lg bg-white shadow-lg ring-1 ring-black/5 z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold text-gray-900">
              {language === 'vn' ? 'Thông báo' : 'Notifications'}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={isLoading}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  {language === 'vn' ? 'Đọc tất cả' : 'Mark all read'}
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Bell className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  {language === 'vn' ? 'Không có thông báo' : 'No notifications'}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map(notification => {
                  const IconComponent = NOTIFICATION_ICONS[notification.type] || Bell;
                  const colorClass = NOTIFICATION_COLORS[notification.type] || 'text-gray-600 bg-gray-100';
                  const title = language === 'vn' ? notification.title : (notification.titleEn || notification.title);
                  const message = language === 'vn' ? notification.message : (notification.messageEn || notification.message);

                  const content = (
                    <div
                      className={`flex gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* Icon or Actor Avatar */}
                      {notification.actor?.image ? (
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={notification.actor.image} alt={notification.actor.name || ''} />
                          <AvatarFallback>{notification.actor.name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTime(notification.createdAt)}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-start gap-1 flex-shrink-0">
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                        )}
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={language === 'vn' ? 'Xóa thông báo' : 'Delete notification'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );

                  if (notification.referenceUrl) {
                    return (
                      <Link key={notification.id} href={notification.referenceUrl} className="block group">
                        {content}
                      </Link>
                    );
                  }

                  return <div key={notification.id} className="group">{content}</div>;
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t p-2">
              <Link
                href="/tai-khoan/thong-bao"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-blue-600 hover:text-blue-700 py-2"
              >
                {language === 'vn' ? 'Xem tất cả thông báo' : 'View all notifications'}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
