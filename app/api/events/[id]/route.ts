import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  titleEn: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  eventType: z.enum(['FESTIVAL', 'COMMUNITY', 'RELIGIOUS', 'CULTURAL', 'BUSINESS', 'OTHER']).optional(),
  startDate: z.string().transform(s => new Date(s)).optional(),
  endDate: z.string().nullable().optional().transform(s => s ? new Date(s) : null),
  isAllDay: z.boolean().optional(),
  location: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  neighborhoodId: z.number().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  contactEmail: z.string().email().nullable().optional().or(z.literal('')),
  website: z.string().url().nullable().optional().or(z.literal('')),
  ticketUrl: z.string().url().nullable().optional().or(z.literal('')),
  price: z.string().nullable().optional(),
  isFree: z.boolean().optional(),
  imageUrl: z.string().nullable().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'CANCELLED', 'COMPLETED']).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
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
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    // Get existing event
    const existingEvent = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check authorization
    const isOwner = existingEvent.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Clean up empty strings to null
    const cleanedBody = { ...body };
    for (const key of ['contactEmail', 'website', 'ticketUrl']) {
      if (cleanedBody[key] === '') {
        cleanedBody[key] = null;
      }
    }

    const validated = updateEventSchema.parse(cleanedBody);

    // Only admins can change status
    if (validated.status && !isAdmin) {
      delete (validated as Record<string, unknown>).status;
    }

    // Convert price if provided
    const updateData: Record<string, unknown> = { ...validated };
    if (validated.price !== undefined) {
      updateData.price = validated.price && !validated.isFree
        ? parseFloat(validated.price)
        : null;
    }

    const event = await db.event.update({
      where: { id: eventId },
      data: updateData,
    });

    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    // Get existing event
    const existingEvent = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check authorization
    const isOwner = existingEvent.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await db.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
