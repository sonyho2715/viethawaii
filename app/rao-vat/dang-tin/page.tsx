import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingForm from '@/components/classifieds/ListingForm';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Đăng Tin | Post Listing | VietHawaii',
  description: 'Đăng tin rao vặt miễn phí trên VietHawaii. Post free classifieds on VietHawaii.',
};

async function getCategories() {
  const categories = await db.classifiedCategory.findMany({
    orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
    include: {
      parent: true,
    },
  });
  return categories;
}

export default async function PostListingPage() {
  const session = await getSession();
  const categories = await getCategories();

  // If not logged in, show login prompt
  if (!session.isLoggedIn || !session.userId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-rose-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Vui Lòng Đăng Nhập
              </h1>
              <p className="text-gray-600 mb-6">
                Bạn cần đăng nhập để đăng tin rao vặt
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/auth/signin"
                  className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg transition"
                >
                  Đăng Nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Đăng Ký
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-rose-600 to-orange-500 text-white py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Đăng Tin Rao Vặt</h1>
            <p className="text-rose-100">Miễn phí, nhanh chóng, dễ dàng</p>
          </div>
        </section>

        {/* Form */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            {/* Guidelines */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
              <h3 className="font-bold text-amber-800 mb-2">Lưu Ý Khi Đăng Tin</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Tin đăng sẽ được kiểm duyệt trước khi hiển thị</li>
                <li>• Không đăng nội dung vi phạm pháp luật hoặc lừa đảo</li>
                <li>• Tin đăng có hiệu lực trong 30 ngày</li>
                <li>• Có thể gia hạn miễn phí sau 7 ngày</li>
              </ul>
            </div>

            <ListingForm categories={categories} mode="create" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
