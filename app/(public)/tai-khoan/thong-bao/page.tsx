import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import NotificationsPageClient from './NotificationsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thông báo - VietHawaii',
  description: 'Xem tất cả thông báo của bạn',
};

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/dang-nhap');
  }

  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: session.user.id },
      include: {
        actor: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    db.notification.count({
      where: { userId: session.user.id, isRead: false },
    }),
  ]);

  // Serialize dates for client component
  const serialized = notifications.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
    readAt: n.readAt?.toISOString() || null,
  }));

  return (
    <NotificationsPageClient
      initialNotifications={serialized}
      initialUnreadCount={unreadCount}
    />
  );
}
