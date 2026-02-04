import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import PostHousingClient, { type Category, type Neighborhood } from './PostHousingClient';
import type { Metadata } from 'next';

// Prevent static generation since this page requires authentication
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Đăng tin cho thuê nhà - VietHawaii',
  description: 'Đăng tin cho thuê phòng, căn hộ, nhà nguyên căn trong cộng đồng Việt Hawaii.',
};

async function getHousingCategories(): Promise<Category[]> {
  const parent = await db.category.findUnique({
    where: { slug: 'nha-o' },
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

export default async function PostHousingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/dang-nhap?callbackUrl=/nha-o/dang-tin');
  }

  const [categories, neighborhoods] = await Promise.all([
    getHousingCategories(),
    getNeighborhoods(),
  ]);

  return (
    <PostHousingClient
      categories={categories}
      neighborhoods={neighborhoods}
      userId={session.user.id!}
    />
  );
}
