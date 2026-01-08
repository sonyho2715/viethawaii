import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail, getPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

// Rate limiting: Track requests by IP
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.lastRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  record.lastRequest = now;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 giờ.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Always return success to prevent email enumeration
    // But only send email if user exists
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true, passwordHash: true },
    });

    // If user exists and has a password (not OAuth-only account)
    if (user && user.passwordHash) {
      // Generate secure token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Delete any existing tokens for this user
      await db.verificationToken.deleteMany({
        where: { identifier: normalizedEmail },
      });

      // Create new token
      await db.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token,
          expires,
        },
      });

      // Build reset URL
      const baseUrl = process.env.NEXTAUTH_URL || 'https://viethawaii.com';
      const resetUrl = `${baseUrl}/dat-lai-mat-khau?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

      // Send email
      const emailContent = getPasswordResetEmail(resetUrl, user.name || undefined);
      const result = await sendEmail({
        to: normalizedEmail,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      if (!result.success) {
        console.error('Failed to send password reset email:', result.error);
        // Still return success to prevent enumeration
      }
    }

    // Always return success message
    return NextResponse.json({
      success: true,
      message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
