import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = resetPasswordSchema.safeParse(body);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ';
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const { token, email, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Find and validate token
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        identifier: normalizedEmail,
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: 'Link đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng.' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await db.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: normalizedEmail,
            token,
          },
        },
      });

      return NextResponse.json(
        { success: false, error: 'Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu link mới.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tài khoản.' },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Delete the used token
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: normalizedEmail,
          token,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
