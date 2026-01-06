import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { ArticleActions } from './ArticleActions';

export default async function AdminArticlesPage() {
  const session = await auth();
  if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    redirect('/dang-nhap');
  }

  const articles = await db.article.findMany({
    include: {
      category: true,
      author: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    PUBLISHED: 'bg-green-100 text-green-700',
    ARCHIVED: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    DRAFT: 'Nháp',
    PUBLISHED: 'Đã đăng',
    ARCHIVED: 'Lưu trữ',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tin tức / Bài viết</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả bài viết trên hệ thống</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Tạo bài viết
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tiêu đề</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Danh mục</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tác giả</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Trạng thái</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Lượt xem</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Ngày tạo</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Chưa có bài viết nào
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{article.titleVn}</p>
                      <p className="text-sm text-gray-500">/tin-tuc/{article.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: `${article.category.color}20`, color: article.category.color || '#666' }}
                    >
                      {article.category.nameVn}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.author.name || article.author.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusColors[article.status]}`}>
                      {statusLabels[article.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4">
                    <ArticleActions articleId={article.id} status={article.status} slug={article.slug} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Tổng cộng: {articles.length} bài viết
      </p>
    </div>
  );
}
