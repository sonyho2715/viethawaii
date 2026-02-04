/**
 * Email notification system for VietHawaii
 * Sends emails for various events using Resend
 */

import { Resend } from 'resend';
import { db } from './db';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'VietHawaii <noreply@viethawaii.com>';
const baseUrl = process.env.NEXTAUTH_URL || 'https://viethawaii.com';

interface EmailTemplate {
  subject: string;
  html: string;
}

/**
 * Send email notification to a user
 */
async function sendNotificationEmail(to: string, template: EmailTemplate) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email notification skipped (no RESEND_API_KEY):', template.subject);
    return { success: false, error: 'No API key configured' };
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: template.subject,
      html: template.html,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

/**
 * Notify listing owner of a new inquiry
 */
export async function notifyNewInquiry({
  listingId,
  listingTitle,
  senderName,
  senderEmail,
  senderPhone,
  message,
}: {
  listingId: number;
  listingTitle: string;
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  message: string;
}) {
  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { user: { select: { email: true, name: true, preferredLang: true } } },
  });

  if (!listing?.user.email) return;

  const isVietnamese = listing.user.preferredLang === 'vn';

  const template: EmailTemplate = {
    subject: isVietnamese
      ? `Có người quan tâm đến tin "${listingTitle}"`
      : `New inquiry for "${listingTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f97316; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">VietHawaii</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #111827;">
            ${isVietnamese ? 'Tin nhắn mới về tin đăng của bạn' : 'New message about your listing'}
          </h2>
          <p style="color: #4b5563;">
            ${isVietnamese ? 'Có người đã gửi tin nhắn về' : 'Someone is interested in'}:
            <strong>${listingTitle}</strong>
          </p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #374151; margin: 0 0 10px 0;">
              <strong>${isVietnamese ? 'Tin nhắn' : 'Message'}:</strong><br>
              ${message}
            </p>
            ${senderName ? `<p style="color: #6b7280; margin: 5px 0;"><strong>${isVietnamese ? 'Tên' : 'Name'}:</strong> ${senderName}</p>` : ''}
            ${senderEmail ? `<p style="color: #6b7280; margin: 5px 0;"><strong>Email:</strong> ${senderEmail}</p>` : ''}
            ${senderPhone ? `<p style="color: #6b7280; margin: 5px 0;"><strong>${isVietnamese ? 'Điện thoại' : 'Phone'}:</strong> ${senderPhone}</p>` : ''}
          </div>
          <a href="${baseUrl}/rao-vat/${listingId}" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            ${isVietnamese ? 'Xem tin đăng' : 'View Listing'}
          </a>
        </div>
        <div style="padding: 20px; background: #f3f4f6; text-align: center; font-size: 12px; color: #6b7280;">
          © ${new Date().getFullYear()} VietHawaii
        </div>
      </div>
    `,
  };

  return sendNotificationEmail(listing.user.email, template);
}

/**
 * Notify user when their listing is approved
 */
export async function notifyListingApproved({
  listingId,
  listingTitle,
  userId,
}: {
  listingId: number;
  listingTitle: string;
  userId: string;
}) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, preferredLang: true },
  });

  if (!user?.email) return;

  const isVietnamese = user.preferredLang === 'vn';
  const listingUrl = `${baseUrl}/rao-vat/${listingId}`;

  const template: EmailTemplate = {
    subject: isVietnamese
      ? `Tin đăng "${listingTitle}" đã được duyệt!`
      : `Your listing "${listingTitle}" has been approved!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">✓ ${isVietnamese ? 'Đã Duyệt' : 'Approved'}</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #111827;">
            ${isVietnamese ? 'Chúc mừng!' : 'Congratulations!'} ${user.name || ''}
          </h2>
          <p style="color: #4b5563;">
            ${isVietnamese
              ? `Tin đăng "<strong>${listingTitle}</strong>" của bạn đã được duyệt và hiện đang hiển thị trên VietHawaii.`
              : `Your listing "<strong>${listingTitle}</strong>" has been approved and is now live on VietHawaii.`
            }
          </p>
          <a href="${listingUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
            ${isVietnamese ? 'Xem tin đăng' : 'View Listing'}
          </a>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            ${isVietnamese
              ? 'Chia sẻ tin đăng để có nhiều người xem hơn!'
              : 'Share your listing to get more views!'
            }
          </p>
        </div>
        <div style="padding: 20px; background: #f3f4f6; text-align: center; font-size: 12px; color: #6b7280;">
          © ${new Date().getFullYear()} VietHawaii
        </div>
      </div>
    `,
  };

  // Also create in-app notification
  await db.notification.create({
    data: {
      userId,
      type: 'LISTING_APPROVED',
      title: isVietnamese ? 'Tin đăng đã được duyệt' : 'Listing Approved',
      titleEn: 'Listing Approved',
      message: isVietnamese
        ? `Tin đăng "${listingTitle}" của bạn đã được duyệt.`
        : `Your listing "${listingTitle}" has been approved.`,
      messageEn: `Your listing "${listingTitle}" has been approved.`,
      referenceType: 'listing',
      referenceId: listingId,
      referenceUrl: listingUrl,
    },
  });

  return sendNotificationEmail(user.email, template);
}

/**
 * Notify user when their listing is rejected
 */
export async function notifyListingRejected({
  listingId,
  listingTitle,
  userId,
  reason,
}: {
  listingId: number;
  listingTitle: string;
  userId: string;
  reason?: string;
}) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, preferredLang: true },
  });

  if (!user?.email) return;

  const isVietnamese = user.preferredLang === 'vn';

  const template: EmailTemplate = {
    subject: isVietnamese
      ? `Tin đăng "${listingTitle}" không được duyệt`
      : `Your listing "${listingTitle}" was not approved`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">${isVietnamese ? 'Không được duyệt' : 'Not Approved'}</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #111827;">
            ${isVietnamese ? 'Xin chào' : 'Hello'} ${user.name || ''},
          </h2>
          <p style="color: #4b5563;">
            ${isVietnamese
              ? `Tin đăng "<strong>${listingTitle}</strong>" của bạn không được duyệt.`
              : `Your listing "<strong>${listingTitle}</strong>" was not approved.`
            }
          </p>
          ${reason ? `
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p style="color: #991b1b; margin: 0;">
                <strong>${isVietnamese ? 'Lý do' : 'Reason'}:</strong> ${reason}
              </p>
            </div>
          ` : ''}
          <p style="color: #4b5563;">
            ${isVietnamese
              ? 'Bạn có thể chỉnh sửa và gửi lại tin đăng.'
              : 'You can edit and resubmit your listing.'
            }
          </p>
          <a href="${baseUrl}/tai-khoan/tin-cua-toi" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
            ${isVietnamese ? 'Chỉnh sửa tin' : 'Edit Listing'}
          </a>
        </div>
        <div style="padding: 20px; background: #f3f4f6; text-align: center; font-size: 12px; color: #6b7280;">
          © ${new Date().getFullYear()} VietHawaii
        </div>
      </div>
    `,
  };

  // Also create in-app notification
  await db.notification.create({
    data: {
      userId,
      type: 'LISTING_REJECTED',
      title: isVietnamese ? 'Tin đăng không được duyệt' : 'Listing Not Approved',
      titleEn: 'Listing Not Approved',
      message: isVietnamese
        ? `Tin đăng "${listingTitle}" của bạn không được duyệt.${reason ? ` Lý do: ${reason}` : ''}`
        : `Your listing "${listingTitle}" was not approved.${reason ? ` Reason: ${reason}` : ''}`,
      messageEn: `Your listing "${listingTitle}" was not approved.${reason ? ` Reason: ${reason}` : ''}`,
      referenceType: 'listing',
      referenceId: listingId,
    },
  });

  return sendNotificationEmail(user.email, template);
}

/**
 * Notify user when their event is approved
 */
export async function notifyEventApproved({
  eventId,
  eventTitle,
  userId,
  startDate,
}: {
  eventId: number;
  eventTitle: string;
  userId: string;
  startDate: Date;
}) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, preferredLang: true },
  });

  if (!user?.email) return;

  const isVietnamese = user.preferredLang === 'vn';
  const eventUrl = `${baseUrl}/su-kien/${eventId}`;
  const formattedDate = startDate.toLocaleDateString(isVietnamese ? 'vi-VN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const template: EmailTemplate = {
    subject: isVietnamese
      ? `Sự kiện "${eventTitle}" đã được duyệt!`
      : `Your event "${eventTitle}" has been approved!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8b5cf6; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 ${isVietnamese ? 'Sự Kiện Đã Duyệt' : 'Event Approved'}</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #111827;">${eventTitle}</h2>
          <p style="color: #4b5563;">
            ${isVietnamese
              ? `Sự kiện của bạn đã được duyệt và sẽ diễn ra vào:`
              : `Your event has been approved and is scheduled for:`
            }
          </p>
          <p style="color: #8b5cf6; font-size: 18px; font-weight: bold;">${formattedDate}</p>
          <a href="${eventUrl}" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
            ${isVietnamese ? 'Xem sự kiện' : 'View Event'}
          </a>
        </div>
        <div style="padding: 20px; background: #f3f4f6; text-align: center; font-size: 12px; color: #6b7280;">
          © ${new Date().getFullYear()} VietHawaii
        </div>
      </div>
    `,
  };

  // Also create in-app notification
  await db.notification.create({
    data: {
      userId,
      type: 'EVENT_APPROVED',
      title: isVietnamese ? 'Sự kiện đã được duyệt' : 'Event Approved',
      titleEn: 'Event Approved',
      message: isVietnamese
        ? `Sự kiện "${eventTitle}" của bạn đã được duyệt.`
        : `Your event "${eventTitle}" has been approved.`,
      messageEn: `Your event "${eventTitle}" has been approved.`,
      referenceType: 'event',
      referenceId: eventId,
      referenceUrl: eventUrl,
    },
  });

  return sendNotificationEmail(user.email, template);
}
