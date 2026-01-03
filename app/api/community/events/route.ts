import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

const eventSchema = z.object({
  title: z.string().min(5, 'Tên sự kiện ít nhất 5 ký tự').max(200),
  titleEn: z.string().max(200).optional(),
  description: z.string().min(20, 'Mô tả ít nhất 20 ký tự'),
  descriptionEn: z.string().optional(),
  category: z.string(),
  startDate: z.string(),
  startTime: z.string().optional(),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  isAllDay: z.boolean().default(false),
  venue: z.string().optional(),
  address: z.string().optional(),
  island: z.string(),
  city: z.string().optional(),
  virtualLink: z.string().url().optional().or(z.literal('')),
  isFree: z.boolean().default(true),
  ticketPrice: z.string().optional(),
  ticketLink: z.string().url().optional().or(z.literal('')),
  organizationName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  image: z.string().url().optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = eventSchema.parse(body);

    // Build start and end dates
    let startDate = new Date(validated.startDate);
    if (validated.startTime && !validated.isAllDay) {
      const [hours, minutes] = validated.startTime.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes));
    }

    let endDate: Date | null = null;
    if (validated.endDate) {
      endDate = new Date(validated.endDate);
      if (validated.endTime && !validated.isAllDay) {
        const [hours, minutes] = validated.endTime.split(':');
        endDate.setHours(parseInt(hours), parseInt(minutes));
      }
    }

    // Generate unique slug
    let baseSlug = generateSlug(validated.title);
    let slug = baseSlug;
    let counter = 1;

    while (await db.communityEvent.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const event = await db.communityEvent.create({
      data: {
        slug,
        title: validated.title,
        titleEn: validated.titleEn || null,
        description: validated.description,
        descriptionEn: validated.descriptionEn || null,
        category: validated.category,
        startDate,
        endDate,
        isAllDay: validated.isAllDay,
        venue: validated.venue || null,
        address: validated.address || null,
        island: validated.island,
        city: validated.city || null,
        virtualLink: validated.virtualLink || null,
        isFree: validated.isFree,
        ticketPrice: validated.ticketPrice ? parseFloat(validated.ticketPrice) : null,
        ticketLink: validated.ticketLink || null,
        organizationName: validated.organizationName || null,
        contactEmail: validated.contactEmail || null,
        contactPhone: validated.contactPhone || null,
        website: validated.website || null,
        image: validated.image || null,
        organizerId: session.userId,
        status: 'pending',
        featured: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: event.id, slug: event.slug },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    console.error('Event creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tạo sự kiện' },
      { status: 500 }
    );
  }
}
