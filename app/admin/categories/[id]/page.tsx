import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { CategoryForm } from '../CategoryForm';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const session = await auth();
  if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    redirect('/dang-nhap');
  }

  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    notFound();
  }

  const category = await db.contentCategory.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chinh sua danh muc</h1>
        <p className="text-gray-600 mt-1">ID: {category.id}</p>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
