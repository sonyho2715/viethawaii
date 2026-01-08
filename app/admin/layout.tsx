import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check authentication
  if (!session?.user) {
    redirect('/dang-nhap?callbackUrl=/admin');
  }

  // Check admin role
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
    redirect('/?error=forbidden');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar user={session.user} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Add top padding on mobile for the fixed header */}
          <div className="p-4 pt-20 lg:p-8 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
