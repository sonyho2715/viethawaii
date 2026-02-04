import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = getClientIP(request);
    const rateLimit = await checkRateLimit(ip, 'api');

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = subscribeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0]?.message || 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    const { email } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed (using SiteSetting as newsletter storage)
    // In a full implementation, you'd have a dedicated Newsletter model
    const existingSubscriber = await db.siteSetting.findUnique({
      where: { key: `newsletter:${normalizedEmail}` },
    });

    if (existingSubscriber) {
      return NextResponse.json({
        success: true,
        message: 'Email đã được đăng ký trước đó!',
      });
    }

    // Store subscription
    await db.siteSetting.create({
      data: {
        key: `newsletter:${normalizedEmail}`,
        value: {
          email: normalizedEmail,
          subscribedAt: new Date().toISOString(),
          source: 'website',
        },
      },
    });

    // Add to Resend audience (if configured)
    if (process.env.RESEND_AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email: normalizedEmail,
          audienceId: process.env.RESEND_AUDIENCE_ID,
        });
      } catch (error) {
        console.error('Failed to add to Resend audience:', error);
        // Don't fail the request if Resend fails
      }
    }

    // Send welcome email
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'VietHawaii <noreply@viethawaii.com>',
        to: normalizedEmail,
        subject: 'Chào mừng bạn đến với VietHawaii! 🌺',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0d9488, #0284c7); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">VietHawaii</h1>
              <p style="color: #e5e7eb; margin-top: 10px;">Cộng đồng Việt Nam tại Hawaii</p>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #111827;">Cảm ơn bạn đã đăng ký!</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Chào bạn,<br><br>
                Cảm ơn bạn đã đăng ký nhận bản tin từ VietHawaii. Bạn sẽ nhận được thông tin mới nhất về:
              </p>
              <ul style="color: #4b5563; line-height: 1.8;">
                <li>Việc làm mới</li>
                <li>Nhà cho thuê</li>
                <li>Sự kiện cộng đồng</li>
                <li>Khuyến mãi từ các doanh nghiệp Việt</li>
              </ul>
              <p style="color: #4b5563;">
                Ghé thăm <a href="https://viethawaii.com" style="color: #0d9488;">viethawaii.com</a> để khám phá thêm!
              </p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Aloha,<br>
                Đội ngũ VietHawaii 🌺
              </p>
            </div>
            <div style="padding: 20px; background: #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
              <p>© ${new Date().getFullYear()} VietHawaii. All rights reserved.</p>
              <p>
                <a href="https://viethawaii.com/huy-dang-ky?email=${encodeURIComponent(normalizedEmail)}" style="color: #6b7280;">
                  Hủy đăng ký
                </a>
              </p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công! Kiểm tra email để nhận bản tin.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
