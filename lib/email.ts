import { Resend } from 'resend';

// Lazy initialize Resend to avoid build-time errors
let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'VietHawaii <noreply@viethawaii.com>';
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'mrsonyho@gmail.com';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      replyTo: REPLY_TO_EMAIL,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send exception:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export function getPasswordResetEmail(resetUrl: string, userName?: string) {
  const name = userName || 'bạn';

  return {
    subject: 'Đặt lại mật khẩu - VietHawaii',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt lại mật khẩu</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">VietHawaii</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Cộng đồng người Việt tại Hawaii</p>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Xin chào ${name},</h2>

    <p style="color: #4b5563;">
      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản VietHawaii của bạn.
      Nhấn vào nút bên dưới để tạo mật khẩu mới:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Đặt lại mật khẩu
      </a>
    </div>

    <p style="color: #6b7280; font-size: 14px;">
      Link này sẽ hết hạn sau <strong>1 giờ</strong>.
    </p>

    <p style="color: #6b7280; font-size: 14px;">
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
      Tài khoản của bạn vẫn an toàn.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="color: #9ca3af; font-size: 12px; margin-bottom: 0;">
      Nếu nút không hoạt động, copy và paste link sau vào trình duyệt:<br>
      <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} VietHawaii. All rights reserved.</p>
    <p style="margin: 5px 0 0 0;">
      <a href="https://viethawaii.com" style="color: #9ca3af;">viethawaii.com</a>
    </p>
  </div>
</body>
</html>
    `.trim(),
  };
}
