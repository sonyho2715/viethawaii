import { db } from '@/lib/db';
import { NotificationType } from '@prisma/client';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  titleEn?: string;
  message: string;
  messageEn?: string;
  referenceType?: string;
  referenceId?: number;
  referenceUrl?: string;
  actorId?: string;
  actorName?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    return await db.notification.create({
      data: params,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

// Helper functions for common notification types

export async function notifyListingApproved(
  userId: string,
  listingId: number,
  listingTitle: string,
  listingType: string
) {
  const urlMap: Record<string, string> = {
    GENERAL: `/rao-vat/chi-tiet/${listingId}`,
    JOB: `/viec-lam/chi-tiet/${listingId}`,
    HOUSING: `/nha-o/chi-tiet/${listingId}`,
    SERVICE: `/dich-vu/chi-tiet/${listingId}`,
  };

  return createNotification({
    userId,
    type: 'LISTING_APPROVED',
    title: 'Tin đăng đã được duyệt',
    titleEn: 'Listing Approved',
    message: `Tin đăng "${listingTitle}" của bạn đã được duyệt và hiển thị công khai.`,
    messageEn: `Your listing "${listingTitle}" has been approved and is now live.`,
    referenceType: 'listing',
    referenceId: listingId,
    referenceUrl: urlMap[listingType] || `/rao-vat/chi-tiet/${listingId}`,
  });
}

export async function notifyListingRejected(
  userId: string,
  listingId: number,
  listingTitle: string,
  reason?: string
) {
  return createNotification({
    userId,
    type: 'LISTING_REJECTED',
    title: 'Tin đăng bị từ chối',
    titleEn: 'Listing Rejected',
    message: reason
      ? `Tin đăng "${listingTitle}" bị từ chối: ${reason}`
      : `Tin đăng "${listingTitle}" bị từ chối. Vui lòng kiểm tra và chỉnh sửa lại.`,
    messageEn: reason
      ? `Your listing "${listingTitle}" was rejected: ${reason}`
      : `Your listing "${listingTitle}" was rejected. Please review and edit.`,
    referenceType: 'listing',
    referenceId: listingId,
    referenceUrl: `/tai-khoan/tin-dang`,
  });
}

export async function notifyListingSaved(
  listingOwnerId: string,
  listingId: number,
  listingTitle: string,
  listingType: string,
  actorId?: string,
  actorName?: string
) {
  const urlMap: Record<string, string> = {
    GENERAL: `/rao-vat/chi-tiet/${listingId}`,
    JOB: `/viec-lam/chi-tiet/${listingId}`,
    HOUSING: `/nha-o/chi-tiet/${listingId}`,
    SERVICE: `/dich-vu/chi-tiet/${listingId}`,
  };

  return createNotification({
    userId: listingOwnerId,
    type: 'LISTING_SAVED',
    title: 'Có người lưu tin đăng của bạn',
    titleEn: 'Someone saved your listing',
    message: actorName
      ? `${actorName} đã lưu tin đăng "${listingTitle}" của bạn.`
      : `Có người đã lưu tin đăng "${listingTitle}" của bạn.`,
    messageEn: actorName
      ? `${actorName} saved your listing "${listingTitle}".`
      : `Someone saved your listing "${listingTitle}".`,
    referenceType: 'listing',
    referenceId: listingId,
    referenceUrl: urlMap[listingType] || `/rao-vat/chi-tiet/${listingId}`,
    actorId,
    actorName,
  });
}

export async function notifyListingInquiry(
  listingOwnerId: string,
  listingId: number,
  listingTitle: string,
  listingType: string,
  inquiryMessage: string,
  senderName?: string,
  senderId?: string
) {
  const urlMap: Record<string, string> = {
    GENERAL: `/rao-vat/chi-tiet/${listingId}`,
    JOB: `/viec-lam/chi-tiet/${listingId}`,
    HOUSING: `/nha-o/chi-tiet/${listingId}`,
    SERVICE: `/dich-vu/chi-tiet/${listingId}`,
  };

  return createNotification({
    userId: listingOwnerId,
    type: 'LISTING_INQUIRY',
    title: 'Có người quan tâm tin đăng của bạn',
    titleEn: 'New inquiry on your listing',
    message: senderName
      ? `${senderName} gửi tin nhắn về "${listingTitle}": "${inquiryMessage.slice(0, 100)}${inquiryMessage.length > 100 ? '...' : ''}"`
      : `Có người gửi tin nhắn về "${listingTitle}": "${inquiryMessage.slice(0, 100)}${inquiryMessage.length > 100 ? '...' : ''}"`,
    messageEn: senderName
      ? `${senderName} sent a message about "${listingTitle}": "${inquiryMessage.slice(0, 100)}${inquiryMessage.length > 100 ? '...' : ''}"`
      : `Someone sent a message about "${listingTitle}": "${inquiryMessage.slice(0, 100)}${inquiryMessage.length > 100 ? '...' : ''}"`,
    referenceType: 'listing',
    referenceId: listingId,
    referenceUrl: urlMap[listingType] || `/rao-vat/chi-tiet/${listingId}`,
    actorId: senderId,
    actorName: senderName,
  });
}

export async function notifyEventApproved(
  userId: string,
  eventId: number,
  eventTitle: string
) {
  return createNotification({
    userId,
    type: 'EVENT_APPROVED',
    title: 'Sự kiện đã được duyệt',
    titleEn: 'Event Approved',
    message: `Sự kiện "${eventTitle}" của bạn đã được duyệt và hiển thị công khai.`,
    messageEn: `Your event "${eventTitle}" has been approved and is now visible.`,
    referenceType: 'event',
    referenceId: eventId,
    referenceUrl: `/su-kien/${eventId}`,
  });
}

export async function notifySystem(
  userId: string,
  title: string,
  titleEn: string,
  message: string,
  messageEn: string,
  url?: string
) {
  return createNotification({
    userId,
    type: 'SYSTEM',
    title,
    titleEn,
    message,
    messageEn,
    referenceUrl: url,
  });
}
