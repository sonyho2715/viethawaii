import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import PostEventClient, { type Neighborhood } from './PostEventClient';
import type { Metadata } from 'next';

// Prevent static generation since this page requires authentication
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Đăng sự kiện - VietHawaii',
  description: 'Đăng sự kiện để chia sẻ với cộng đồng Việt Hawaii.',
};

async function getNeighborhoods(): Promise<Neighborhood[]> {
  const neighborhoods = await db.neighborhood.findMany({
    orderBy: { name: 'asc' },
  });
  return serializeArray(neighborhoods) as unknown as Neighborhood[];
}

export default async function PostEventPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/dang-nhap?callbackUrl=/su-kien/dang-tin');
  }

  const neighborhoods = await getNeighborhoods();

  return (
    <PostEventClient
      neighborhoods={neighborhoods}
      userId={session.user.id!}
    />
  );
}
