import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AccountSidebar from './AccountSidebar';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/dang-nhap?callbackUrl=/tai-khoan');
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar user={session.user} />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
