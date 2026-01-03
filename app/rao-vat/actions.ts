'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import {
  classifiedListingSchema,
  classifiedInquirySchema,
  classifiedReportSchema,
  ClassifiedListingInput,
  ClassifiedInquiryInput,
  ClassifiedReportInput,
} from '@/lib/validations/classified';

// ============================================
// LISTING ACTIONS
// ============================================

export async function createListing(data: ClassifiedListingInput) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return { success: false, error: 'Vui lòng đăng nhập để đăng tin' };
    }

    const validated = classifiedListingSchema.parse(data);

    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const listing = await db.classifiedListing.create({
      data: {
        categoryId: validated.categoryId,
        userId: session.userId,
        title: validated.title,
        titleEn: validated.titleEn || null,
        description: validated.description,
        descriptionEn: validated.descriptionEn || null,
        price: validated.price ? validated.price : null,
        priceType: validated.priceType,
        island: validated.island,
        city: validated.city || null,
        zipCode: validated.zipCode || null,
        neighborhood: validated.neighborhood || null,
        address: validated.address || null,
        hideExactLocation: validated.hideExactLocation,
        contactEmail: validated.contactEmail || null,
        contactPhone: validated.contactPhone || null,
        contactMethod: validated.contactMethod,
        images: validated.images,
        jobDetails: validated.jobDetails ?? Prisma.JsonNull,
        housingDetails: validated.housingDetails ?? Prisma.JsonNull,
        vehicleDetails: validated.vehicleDetails ?? Prisma.JsonNull,
        urgent: validated.urgent,
        status: 'pending', // Requires approval
        expiresAt,
      },
    });

    revalidatePath('/rao-vat');
    return { success: true, data: listing };
  } catch (error) {
    console.error('Error creating listing:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Không thể tạo tin đăng' };
  }
}

export async function updateListing(id: string, data: Partial<ClassifiedListingInput>) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return { success: false, error: 'Vui lòng đăng nhập' };
    }

    // Check ownership
    const existing = await db.classifiedListing.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return { success: false, error: 'Tin đăng không tồn tại' };
    }

    if (existing.userId !== session.userId && session.role !== 'admin') {
      return { success: false, error: 'Bạn không có quyền sửa tin này' };
    }

    const listing = await db.classifiedListing.update({
      where: { id },
      data: {
        ...data,
        status: 'pending', // Re-review after edit
      },
    });

    revalidatePath('/rao-vat');
    revalidatePath(`/rao-vat/${id}`);
    return { success: true, data: listing };
  } catch (error) {
    console.error('Error updating listing:', error);
    return { success: false, error: 'Không thể cập nhật tin đăng' };
  }
}

export async function deleteListing(id: string) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return { success: false, error: 'Vui lòng đăng nhập' };
    }

    // Check ownership
    const existing = await db.classifiedListing.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return { success: false, error: 'Tin đăng không tồn tại' };
    }

    if (existing.userId !== session.userId && session.role !== 'admin') {
      return { success: false, error: 'Bạn không có quyền xóa tin này' };
    }

    await db.classifiedListing.delete({ where: { id } });

    revalidatePath('/rao-vat');
    return { success: true };
  } catch (error) {
    console.error('Error deleting listing:', error);
    return { success: false, error: 'Không thể xóa tin đăng' };
  }
}

export async function renewListing(id: string) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return { success: false, error: 'Vui lòng đăng nhập' };
    }

    // Check ownership
    const existing = await db.classifiedListing.findUnique({
      where: { id },
      select: { userId: true, renewedAt: true },
    });

    if (!existing) {
      return { success: false, error: 'Tin đăng không tồn tại' };
    }

    if (existing.userId !== session.userId) {
      return { success: false, error: 'Bạn không có quyền gia hạn tin này' };
    }

    // Check if renewed recently (within 7 days)
    if (existing.renewedAt) {
      const daysSinceRenewal = Math.floor(
        (Date.now() - existing.renewedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceRenewal < 7) {
        return { success: false, error: 'Bạn chỉ có thể gia hạn sau 7 ngày' };
      }
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const listing = await db.classifiedListing.update({
      where: { id },
      data: {
        expiresAt,
        renewedAt: new Date(),
        status: 'active',
      },
    });

    revalidatePath('/rao-vat');
    return { success: true, data: listing };
  } catch (error) {
    console.error('Error renewing listing:', error);
    return { success: false, error: 'Không thể gia hạn tin đăng' };
  }
}

export async function markAsSold(id: string) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return { success: false, error: 'Vui lòng đăng nhập' };
    }

    // Check ownership
    const existing = await db.classifiedListing.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return { success: false, error: 'Tin đăng không tồn tại' };
    }

    if (existing.userId !== session.userId) {
      return { success: false, error: 'Bạn không có quyền đánh dấu tin này' };
    }

    const listing = await db.classifiedListing.update({
      where: { id },
      data: { status: 'sold' },
    });

    revalidatePath('/rao-vat');
    return { success: true, data: listing };
  } catch (error) {
    console.error('Error marking as sold:', error);
    return { success: false, error: 'Không thể đánh dấu đã bán' };
  }
}

// ============================================
// INQUIRY ACTIONS
// ============================================

export async function sendInquiry(data: ClassifiedInquiryInput) {
  try {
    const validated = classifiedInquirySchema.parse(data);

    // Get session for logged in users
    const session = await getSession();

    // Check if listing exists and is active
    const listing = await db.classifiedListing.findUnique({
      where: { id: validated.listingId },
      select: { status: true },
    });

    if (!listing) {
      return { success: false, error: 'Tin đăng không tồn tại' };
    }

    if (listing.status !== 'active') {
      return { success: false, error: 'Tin đăng này không còn hoạt động' };
    }

    const inquiry = await db.classifiedInquiry.create({
      data: {
        listingId: validated.listingId,
        senderId: session.userId || null,
        senderName: validated.senderName,
        senderEmail: validated.senderEmail,
        senderPhone: validated.senderPhone || null,
        message: validated.message,
      },
    });

    // TODO: Send email notification to listing owner

    return { success: true, data: inquiry };
  } catch (error) {
    console.error('Error sending inquiry:', error);
    return { success: false, error: 'Không thể gửi tin nhắn' };
  }
}

// ============================================
// REPORT ACTIONS
// ============================================

export async function reportListing(data: ClassifiedReportInput) {
  try {
    const validated = classifiedReportSchema.parse(data);

    // Get session for logged in users
    const session = await getSession();

    // Check if listing exists
    const listing = await db.classifiedListing.findUnique({
      where: { id: validated.listingId },
      select: { id: true },
    });

    if (!listing) {
      return { success: false, error: 'Tin đăng không tồn tại' };
    }

    // Check for duplicate report from same user
    if (session.userId) {
      const existingReport = await db.classifiedReport.findFirst({
        where: {
          listingId: validated.listingId,
          reporterId: session.userId,
        },
      });

      if (existingReport) {
        return { success: false, error: 'Bạn đã báo cáo tin này rồi' };
      }
    }

    const report = await db.classifiedReport.create({
      data: {
        listingId: validated.listingId,
        reporterId: session.userId || null,
        reason: validated.reason,
        details: validated.description || null,
      },
    });

    return { success: true, data: report };
  } catch (error) {
    console.error('Error reporting listing:', error);
    return { success: false, error: 'Không thể báo cáo tin đăng' };
  }
}

// ============================================
// FAVORITE ACTIONS
// ============================================

export async function toggleFavorite(listingId: string) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return { success: false, error: 'Vui lòng đăng nhập để lưu tin' };
    }

    // Check if already favorited
    const existing = await db.classifiedFavorite.findUnique({
      where: {
        userId_listingId: {
          userId: session.userId,
          listingId,
        },
      },
    });

    if (existing) {
      await db.classifiedFavorite.delete({
        where: { id: existing.id },
      });
      return { success: true, favorited: false };
    }

    await db.classifiedFavorite.create({
      data: {
        userId: session.userId,
        listingId,
      },
    });

    return { success: true, favorited: true };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, error: 'Không thể lưu tin đăng' };
  }
}

// ============================================
// VIEW TRACKING
// ============================================

export async function incrementViewCount(id: string) {
  try {
    await db.classifiedListing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
