import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import PostServiceClient, { type Category, type Neighborhood } from './PostServiceClient';
import type { Metadata } from 'next';

// Prevent static generation since this page requires authentication
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Đăng dịch vụ - VietHawaii',
  description: 'Đăng dịch vụ của bạn để tiếp cận cộng đồng Việt Hawaii.',
};

async function getServiceCategories(): Promise<Category[]> {
  const parent = await db.category.findUnique({
    where: { slug: 'dich-vu' },
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

export default async function PostServicePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/dang-nhap?callbackUrl=/dich-vu/dang-tin');
  }

  const [categories, neighborhoods] = await Promise.all([
    getServiceCategories(),
    getNeighborhoods(),
  ]);

  return (
    <PostServiceClient
      categories={categories}
      neighborhoods={neighborhoods}
      userId={session.user.id!}
    />
  );
}
