import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrganizationForm from './OrganizationForm';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thêm Tổ Chức Mới | VietHawaii',
  description: 'Đăng ký tổ chức cộng đồng Việt tại Hawaii',
};

export default async function AddOrganizationPage() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    redirect('/auth/signin?callbackUrl=/cong-dong/to-chuc/them-moi');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/cong-dong" className="text-gray-500 hover:text-rose-600">
                Cộng Đồng
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link href="/cong-dong/to-chuc" className="text-gray-500 hover:text-rose-600">
                Tổ Chức
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">Thêm Mới</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Đăng Ký Tổ Chức
            </h1>
            <p className="text-gray-600 mb-8">
              Thêm thông tin về tổ chức, hội đoàn, nhà thờ, chùa, hoặc nhóm cộng đồng Việt tại Hawaii.
            </p>

            <OrganizationForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
