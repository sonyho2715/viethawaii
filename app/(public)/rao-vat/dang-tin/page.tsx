import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import PostListingClient from './PostListingClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng tin - VietHawaii',
  description: 'Đăng tin rao vặt miễn phí. Bán đồ, tìm việc, cho thuê nhà và nhiều hơn nữa.',
};

async function getCategories() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
  });
  // Serialize to plain objects to avoid Prisma type issues
  return JSON.parse(JSON.stringify(categories));
}

async function getNeighborhoods() {
  const neighborhoods = await db.neighborhood.findMany({
    orderBy: { name: 'asc' },
  });
  // Serialize to plain objects (Decimal types don't serialize properly)
  return JSON.parse(JSON.stringify(neighborhoods));
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
