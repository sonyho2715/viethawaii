import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import PostListingClient, { type Category, type Neighborhood } from './PostListingClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng tin - VietHawaii',
  description: 'Đăng tin rao vặt miễn phí. Bán đồ, tìm việc, cho thuê nhà và nhiều hơn nữa.',
};

async function getCategories(): Promise<Category[]> {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
  });
  // JSON serialization converts Date to string, Decimal to number
  return serializeArray(categories) as unknown as Category[];
}

async function getNeighborhoods(): Promise<Neighborhood[]> {
  const neighborhoods = await db.neighborhood.findMany({
    orderBy: { name: 'asc' },
  });
  // JSON serialization converts Date to string, Decimal to number
  return serializeArray(neighborhoods) as unknown as Neighborhood[];
}

export default async function PostListingPage() {
  const session = await auth();

  // Require authentication
  if (!session?.user) {
    redirect('/dang-nhap?callbackUrl=/rao-vat/dang-tin');
  }

  const [categories, neighborhoods] = await Promise.all([
    getCategories(),
    getNeighborhoods(),
  ]);

  return (
    <PostListingClient
      categories={categories}
      neighborhoods={neighborhoods}
      userId={session.user.id!}
    />
  );
}
