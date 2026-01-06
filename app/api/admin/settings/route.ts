import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const settingsSchema = z.object({
  siteName: z.string().max(100).optional(),
  siteDescription: z.string().max(500).optional(),
  siteDescriptionEn: z.string().max(500).optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().max(50).optional(),
  contactAddress: z.string().max(200).optional(),
  socialFacebook: z.string().url().optional().or(z.literal('')),
  socialInstagram: z.string().url().optional().or(z.literal('')),
  socialYoutube: z.string().url().optional().or(z.literal('')),
  socialTiktok: z.string().url().optional().or(z.literal('')),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
  enableListings: z.boolean().optional(),
  enableNews: z.boolean().optional(),
  enableTools: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  exchangeRateApiKey: z.string().max(200).optional(),
});

// Keys that only SUPERADMIN can modify
const SUPERADMIN_ONLY_KEYS = ['exchangeRateApiKey', 'maintenanceMode'];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isSuperAdmin = session.user.role === 'SUPERADMIN';
    const body = await req.json();
    const validated = settingsSchema.parse(body);

    // Filter out superadmin-only keys for regular admins and undefined values
    const keysToUpdate = Object.keys(validated).filter((key) => {
      if (SUPERADMIN_ONLY_KEYS.includes(key) && !isSuperAdmin) {
        return false;
      }
      // Only update keys with defined values
      const value = validated[key as keyof typeof validated];
      return value !== undefined;
    });

    // Update each setting
    const updates = keysToUpdate.map((key) => {
      const value = validated[key as keyof typeof validated];
      return db.siteSetting.upsert({
        where: { key },
        update: {
          value: value as string | boolean,
          updatedBy: session.user.id,
          updatedAt: new Date(),
        },
        create: {
          key,
          value: value as string | boolean,
          updatedBy: session.user.id,
        },
      });
    });

    await Promise.all(updates);

    return NextResponse.json({ success: true, message: 'Da luu cai dat thanh cong' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Du lieu khong hop le', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Save settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Loi server' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isSuperAdmin = session.user.role === 'SUPERADMIN';
    const settings = await db.siteSetting.findMany();

    // Convert to key-value object
    const settingsObject: Record<string, any> = {};
    for (const setting of settings) {
      // Hide superadmin-only keys from regular admins
      if (SUPERADMIN_ONLY_KEYS.includes(setting.key) && !isSuperAdmin) {
        continue;
      }
      settingsObject[setting.key] = setting.value;
    }

    return NextResponse.json({ success: true, data: settingsObject });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Loi server' },
      { status: 500 }
    );
  }
}
