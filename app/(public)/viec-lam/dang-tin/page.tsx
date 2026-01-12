import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import PostJobClient, { type Category, type Neighborhood } from './PostJobClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng tin tuyển dụng - VietHawaii',
  description: 'Đăng tin tuyển dụng miễn phí. Tìm nhân viên trong cộng đồng Việt Hawaii.',
};

async function getJobCategories(): Promise<Category[]> {
  // Get viec-lam parent and its children
  const parent = await db.category.findUnique({
    where: { slug: 'viec-lam' },
  });

  if (!parent) return [];

  const categories = await db.category.findMany({
    where: {
      OR: [
        { id: parent.id },
        { parentId: parent.id },
      ],
      isActive: true,
    },
    orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
  });

  return serializeArray(categories) as unknown as Category[];
}

async function getNeighborhoods(): Promise<Neighborhood[]> {
  const neighborhoods = await db.neighborhood.findMany({
    orderBy: { name: 'asc' },
  });
  return serializeArray(neighborhoods) as unknown as Neighborhood[];
}

export default async function PostJobPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/dang-nhap?callbackUrl=/viec-lam/dang-tin');
  }

  const [categories, neighborhoods] = await Promise.all([
    getJobCategories(),
    getNeighborhoods(),
  ]);

  return (
    <PostJobClient
      categories={categories}
      neighborhoods={neighborhoods}
      userId={session.user.id!}
    />
  );
}
