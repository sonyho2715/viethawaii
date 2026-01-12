import { db } from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import EventsClient, { type SerializedEvent, type SerializedNeighborhood } from './EventsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sự kiện - VietHawaii',
  description: 'Khám phá các sự kiện của cộng đồng Việt Hawaii. Lễ hội, gặp gỡ, văn hóa và nhiều hơn nữa.',
};

interface SearchParams {
  type?: string;
  neighborhood?: string;
  q?: string;
  month?: string;
  year?: string;
  view?: 'list' | 'calendar';
  page?: string;
}

async function getEvents(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 12;
  const skip = (page - 1) * limit;

  // Parse month/year for calendar view filtering
  const now = new Date();
  const selectedMonth = searchParams.month ? parseInt(searchParams.month, 10) : now.getMonth();
  const selectedYear = searchParams.year ? parseInt(searchParams.year, 10) : now.getFullYear();

  // Build where clause
  const where: Record<string, unknown> = {
    status: 'APPROVED',
  };

  // For calendar view, filter by selected month
  if (searchParams.view === 'calendar') {
    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);
    where.startDate = {
      gte: startOfMonth,
      lte: endOfMonth,
    };
  } else {
    // For list view, show only upcoming events
    where.startDate = {
      gte: new Date(),
    };
  }

  // Filter by event type
  if (searchParams.type && searchParams.type !== 'all') {
    where.eventType = searchParams.type.toUpperCase();
  }

  // Filter by neighborhood
  if (searchParams.neighborhood && searchParams.neighborhood !== 'any') {
    const neighborhood = await db.neighborhood.findUnique({
      where: { slug: searchParams.neighborhood },
    });
    if (neighborhood) {
      where.neighborhoodId = neighborhood.id;
    }
  }

  // Search query
  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: 'insensitive' } },
      { titleEn: { contains: searchParams.q, mode: 'insensitive' } },
      { description: { contains: searchParams.q, mode: 'insensitive' } },
      { location: { contains: searchParams.q, mode: 'insensitive' } },
    ];
  }

  const [events, total] = await Promise.all([
    db.event.findMany({
      where,
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
      orderBy: { startDate: 'asc' },
      skip: searchParams.view === 'calendar' ? undefined : skip,
      take: searchParams.view === 'calendar' ? undefined : limit,
    }),
    db.event.count({ where }),
  ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    selectedMonth,
    selectedYear,
  };
}

async function getNeighborhoods() {
  return db.neighborhood.findMany({
    orderBy: { name: 'asc' },
  });
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [{ events, pagination, selectedMonth, selectedYear }, neighborhoods] = await Promise.all([
    getEvents(params),
    getNeighborhoods(),
  ]);

  const serializedEvents = serializeArray(events) as unknown as SerializedEvent[];
  const serializedNeighborhoods = serializeArray(neighborhoods) as unknown as SerializedNeighborhood[];

  return (
    <EventsClient
      initialEvents={serializedEvents}
      neighborhoods={serializedNeighborhoods}
      pagination={pagination}
      searchParams={params}
      selectedMonth={selectedMonth}
      selectedYear={selectedYear}
    />
  );
}
