import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, hashPassword } from '@/lib/auth';
import { db } from '@/lib/db';

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(100).optional(),
  role: z.enum(['USER', 'SELLER', 'EDITOR', 'MODERATOR', 'ADMIN', 'SUPERADMIN']).optional(),
  phone: z.string().max(20).nullable().optional(),
});

// GET - Get single user
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        emailVerified: true,
        phoneVerified: true,
        trustScore: true,
        _count: {
          select: {
            listings: true,
            articles: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// PATCH - Update user
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const body = await req.json();
    const validated = updateUserSchema.parse(body);

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Prevent modifying SUPERADMIN unless you are SUPERADMIN
    if (
      existingUser.role === 'SUPERADMIN' &&
      session.user.role !== 'SUPERADMIN'
    ) {
      return NextResponse.json(
        { success: false, error: 'Không thể sửa tài khoản SUPERADMIN' },
        { status: 403 }
      );
    }

    // Only SUPERADMIN can set ADMIN or SUPERADMIN roles
    if (
      validated.role &&
      (validated.role === 'ADMIN' || validated.role === 'SUPERADMIN') &&
      session.user.role !== 'SUPERADMIN'
    ) {
      return NextResponse.json(
        { success: false, error: 'Chỉ SUPERADMIN mới có thể gán quyền ADMIN' },
        { status: 403 }
      );
    }

    // Prevent self-demotion for last SUPERADMIN
    if (
      id === session.user.id &&
      existingUser.role === 'SUPERADMIN' &&
      validated.role &&
      validated.role !== 'SUPERADMIN'
    ) {
      const superadminCount = await db.user.count({
        where: { role: 'SUPERADMIN' },
      });
      if (superadminCount <= 1) {
        return NextResponse.json(
          { success: false, error: 'Không thể hạ cấp SUPERADMIN cuối cùng' },
          { status: 400 }
        );
      }
    }

    // Check email uniqueness if updating email
    if (validated.email && validated.email !== existingUser.email) {
      const emailExists = await db.user.findUnique({
        where: { email: validated.email.toLowerCase() },
      });
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email đã được sử dụng' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.email !== undefined) updateData.email = validated.email.toLowerCase();
    if (validated.role !== undefined) updateData.role = validated.role;
    if (validated.phone !== undefined) updateData.phone = validated.phone;
    if (validated.password) {
      updateData.passwordHash = await hashPassword(validated.password);
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Cannot delete yourself
    if (id === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Không thể xóa tài khoản của chính mình' },
        { status: 400 }
      );
    }

    // Only SUPERADMIN can delete ADMIN or SUPERADMIN
    if (
      (existingUser.role === 'ADMIN' || existingUser.role === 'SUPERADMIN') &&
      session.user.role !== 'SUPERADMIN'
    ) {
      return NextResponse.json(
        { success: false, error: 'Chỉ SUPERADMIN mới có thể xóa tài khoản ADMIN' },
        { status: 403 }
      );
    }

    // Delete user (cascades to related data based on schema)
    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa user thành công',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
