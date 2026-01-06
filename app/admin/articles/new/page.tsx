import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { ArticleForm } from '../ArticleForm';

export default async function NewArticlePage() {
  const session = await auth();
  if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    redirect('/dang-nhap');
  }

  const categories = await db.contentCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tạo bài viết mới</h1>
        <p className="text-gray-600 mt-1">Thêm tin tức hoặc bài viết mới vào hệ thống</p>
      </div>

      <ArticleForm categories={categories} />
    </div>
  );
}
