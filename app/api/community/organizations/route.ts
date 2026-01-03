import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

const organizationSchema = z.object({
  name: z.string().min(3, 'Tên tổ chức ít nhất 3 ký tự').max(200),
  nameEn: z.string().max(200).optional(),
  description: z.string().min(20, 'Mô tả ít nhất 20 ký tự'),
  descriptionEn: z.string().optional(),
  type: z.string(),
  subtype: z.string().optional(),
  address: z.string().optional(),
  island: z.string(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  image: z.string().url().optional().or(z.literal('')),
  logo: z.string().url().optional().or(z.literal('')),
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
    const validated = organizationSchema.parse(body);

    // Generate unique slug
    let baseSlug = generateSlug(validated.name);
    let slug = baseSlug;
    let counter = 1;

    while (await db.communityOrganization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const organization = await db.communityOrganization.create({
      data: {
        slug,
        name: validated.name,
        nameEn: validated.nameEn || null,
        description: validated.description,
        descriptionEn: validated.descriptionEn || null,
        type: validated.type,
        subtype: validated.subtype || null,
        address: validated.address || null,
        island: validated.island,
        city: validated.city || null,
        zipCode: validated.zipCode || null,
        phone: validated.phone || null,
        email: validated.email || null,
        website: validated.website || null,
        facebookUrl: validated.facebookUrl || null,
        image: validated.image || null,
        logo: validated.logo || null,
        verified: false,
        featured: false,
        published: false, // Requires admin approval
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: organization.id, slug: organization.slug },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    console.error('Organization creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể đăng ký tổ chức' },
      { status: 500 }
    );
  }
}
