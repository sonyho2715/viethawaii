import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import AdminUsersClient from '@/components/admin/AdminUsersClient';

export const metadata = {
  title: 'User Management | VietHawaii Admin',
  description: 'Manage platform users, OAuth connections, and permissions',
};

export default async function AdminUsersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  // Fetch all users with OAuth details
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      verified: true,
      avatar: true,
      phone: true,
      provider: true,
      providerId: true,
      emailVerified: true,
      savedBusinesses: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          reviews: true,
          businesses: true,
          savedSearches: true,
          photos: true,
        }
      },
      reviews: {
        select: {
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.verified).length,
    oauth: users.filter(u => u.provider && u.provider !== 'email').length,
    businessOwners: users.filter(u => u.role === 'BUSINESS_OWNER').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    recentLogins: users.filter(u => {
      const lastActivity = u.reviews[0]?.createdAt;
      if (!lastActivity) return false;
      const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince <= 7;
    }).length,
  };

  return <AdminUsersClient users={users} stats={stats} />;
}
