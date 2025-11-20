import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import DashboardClient from '@/components/DashboardClient';

export const metadata = {
  title: 'My Dashboard | VietHawaii',
  description: 'Manage your favorites and saved searches',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  // Fetch user's favorite businesses
  const favoriteBusinesses = await prisma.business.findMany({
    where: {
      id: {
        in: user.savedBusinesses
      },
      status: 'active'
    },
    select: {
      id: true,
      name: true,
      nameVi: true,
      slug: true,
      image: true,
      images: true,
      rating: true,
      reviewCount: true,
      priceRange: true,
      category: true,
      subcategory: true,
      address: true,
      city: true,
      island: true,
      phone: true,
      website: true,
    },
    orderBy: {
      rating: 'desc'
    }
  });

  // Fetch user's saved searches
  const savedSearches = await prisma.savedSearch.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Fetch user's reviews
  const userReviews = await prisma.review.findMany({
    where: {
      userId: user.id
    },
    include: {
      business: {
        select: {
          name: true,
          slug: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  });

  return (
    <DashboardClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      }}
      favorites={favoriteBusinesses}
      savedSearches={savedSearches}
      reviews={userReviews}
    />
  );
}
