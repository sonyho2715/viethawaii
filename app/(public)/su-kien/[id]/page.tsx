import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { serialize, serializeArray } from '@/lib/serialize';
import EventDetailClient from './EventDetailClient';
import type { SerializedEvent } from '../EventsClient';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) return { title: 'Sự kiện không tồn tại' };

  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return { title: 'Sự kiện không tồn tại' };
  }

  return {
    title: `${event.title} - Sự Kiện VietHawaii`,
    description: event.description?.slice(0, 160) || `${event.title} - Xem chi tiết sự kiện trên VietHawaii`,
    openGraph: {
      title: event.title,
      description: event.description?.slice(0, 160),
      images: event.imageUrl ? [event.imageUrl] : undefined,
    },
  };
}

async function getEvent(id: number) {
  const event = await db.event.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
        },
      },
      neighborhood: true,
    },
  });

  if (event) {
    // Increment views
    await db.event.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  return event;
}

async function getRelatedEvents(event: NonNullable<Awaited<ReturnType<typeof getEvent>>>) {
  return db.event.findMany({
    where: {
      id: { not: event.id },
      status: 'APPROVED',
      eventType: event.eventType,
      startDate: { gte: new Date() },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      neighborhood: true,
    },
    take: 4,
    orderBy: { startDate: 'asc' },
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) notFound();

  const [event, session] = await Promise.all([
    getEvent(eventId),
    auth(),
  ]);

  if (!event) {
    notFound();
  }

  const isOwner = session?.user?.id === event.userId;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canView = event.status === 'APPROVED' || isOwner || isAdmin;

  if (!canView) {
    notFound();
  }

  const relatedEvents = await getRelatedEvents(event);

  const serializedEvent = serialize(event) as unknown as SerializedEvent & {
    user: { id: string; name: string | null; image: string | null; createdAt: string };
    neighborhood: { id: number; name: string; slug: string } | null;
  };
  const serializedRelated = serializeArray(relatedEvents) as unknown as SerializedEvent[];

  return (
    <EventDetailClient
      event={serializedEvent}
      relatedEvents={serializedRelated}
      isOwner={isOwner}
    />
  );
}
