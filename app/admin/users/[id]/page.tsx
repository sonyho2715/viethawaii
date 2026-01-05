import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import EditUserForm from './EditUserForm';

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/admin/users"
        className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Quay lại danh sách users
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-teal-100 rounded-lg">
            <User className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Chỉnh sửa User</h1>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{user._count.listings}</p>
            <p className="text-xs text-gray-500">Tin đăng</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{user._count.articles}</p>
            <p className="text-xs text-gray-500">Bài viết</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{user._count.reviews}</p>
            <p className="text-xs text-gray-500">Đánh giá</p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="mb-6 text-sm text-gray-600 space-y-1">
          <p>
            Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
          </p>
          <p>
            Đăng nhập cuối:{' '}
            {user.lastLogin
              ? new Date(user.lastLogin).toLocaleDateString('vi-VN')
              : 'Chưa đăng nhập'}
          </p>
          <div className="flex gap-2 mt-2">
            {user.emailVerified && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                Email đã xác thực
              </span>
            )}
            {user.phoneVerified && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                SĐT đã xác thực
              </span>
            )}
          </div>
        </div>

        <EditUserForm user={user} />
      </div>
    </div>
  );
}
