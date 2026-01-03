import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventForm from './EventForm';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thêm Sự Kiện Mới | VietHawaii',
  description: 'Đăng sự kiện cộng đồng Việt tại Hawaii',
};

export default async function AddEventPage() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    redirect('/auth/signin?callbackUrl=/cong-dong/su-kien/them-moi');
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
              <Link href="/cong-dong/su-kien" className="text-gray-500 hover:text-rose-600">
                Sự Kiện
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">Thêm Mới</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Thêm Sự Kiện Mới
            </h1>
            <p className="text-gray-600 mb-8">
              Chia sẻ sự kiện cộng đồng với người Việt tại Hawaii. Sự kiện sẽ được duyệt trước khi hiển thị.
            </p>

            <EventForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
