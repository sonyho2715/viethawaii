import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { ArticleForm } from '../ArticleForm';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const session = await auth();
  if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    redirect('/dang-nhap');
  }

  const { id } = await params;
  const articleId = parseInt(id);

  if (isNaN(articleId)) {
    notFound();
  }

  const [article, categories] = await Promise.all([
    db.article.findUnique({
      where: { id: articleId },
    }),
    db.contentCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
        <p className="text-gray-600 mt-1">ID: {article.id}</p>
      </div>

      <ArticleForm categories={categories} article={article} />
    </div>
  );
}
