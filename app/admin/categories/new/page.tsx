import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { CategoryForm } from '../CategoryForm';

export default async function NewCategoryPage() {
  const session = await auth();
  if (!session?.user || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    redirect('/dang-nhap');
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tao danh muc moi</h1>
        <p className="text-gray-600 mt-1">Them danh muc noi dung moi vao he thong</p>
      </div>

      <CategoryForm />
    </div>
  );
}
