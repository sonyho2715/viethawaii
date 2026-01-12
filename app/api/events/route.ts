import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleEn: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  eventType: z.enum(['FESTIVAL', 'COMMUNITY', 'RELIGIOUS', 'CULTURAL', 'BUSINESS', 'OTHER']),
  startDate: z.string().transform(s => new Date(s)),
  endDate: z.string().nullable().optional().transform(s => s ? new Date(s) : null),
  isAllDay: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  neighborhoodId: z.number().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  contactEmail: z.string().email().nullable().optional().or(z.literal('')),
  website: z.string().url().nullable().optional().or(z.literal('')),
  ticketUrl: z.string().url().nullable().optional().or(z.literal('')),
  price: z.string().nullable().optional(),
  isFree: z.boolean().default(true),
  imageUrl: z.string().nullable().optional(),
  userId: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const type = searchParams.get('type');
    const status = searchParams.get('status') || 'APPROVED';

    const where: Record<string, unknown> = {};

    if (status !== 'all') {
      where.status = status;
    }

    if (type && type !== 'all') {
      where.eventType = type.toUpperCase();
    }

    // Default to upcoming events
    if (!searchParams.get('past')) {
      where.startDate = { gte: new Date() };
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.event.count({ where }),
    ]);

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate that the userId matches the session user
    if (body.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Clean up empty strings to null
    const cleanedBody = { ...body };
    for (const key of ['contactEmail', 'website', 'ticketUrl']) {
      if (cleanedBody[key] === '') {
        cleanedBody[key] = null;
      }
    }

    const validated = createEventSchema.parse(cleanedBody);

    // Convert price string to Decimal if provided
    const priceValue = validated.price && !validated.isFree
      ? parseFloat(validated.price)
      : null;

    const event = await db.event.create({
      data: {
        title: validated.title,
        titleEn: validated.titleEn || null,
        description: validated.description || null,
        descriptionEn: validated.descriptionEn || null,
        eventType: validated.eventType,
        startDate: validated.startDate,
        endDate: validated.endDate,
        isAllDay: validated.isAllDay,
        isRecurring: validated.isRecurring,
        recurrenceRule: validated.recurrenceRule || null,
        location: validated.location || null,
        address: validated.address || null,
        neighborhoodId: validated.neighborhoodId || null,
        contactPhone: validated.contactPhone || null,
        contactEmail: validated.contactEmail || null,
        website: validated.website || null,
        ticketUrl: validated.ticketUrl || null,
        price: priceValue,
        isFree: validated.isFree,
        imageUrl: validated.imageUrl || null,
        userId: validated.userId,
        status: 'PENDING', // Events need approval
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
