import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function SavedItemsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/dang-nhap?callbackUrl=/tai-khoan/da-luu');
  }

  // TODO: Fetch saved items from database
  const savedItems: Array<{
    id: string;
    title: string;
    price: number;
    location: string;
  }> = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tin đã lưu</h1>
        <p className="text-gray-600">Saved Items</p>
      </div>

      {savedItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có tin đã lưu
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Lưu những tin đăng bạn quan tâm để xem lại sau. Nhấn vào biểu tượng trái tim
            trên mỗi tin để lưu.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Save listings you&apos;re interested in to view later. Click the heart icon on any listing to save it.
          </p>
          <Button asChild>
            <Link href="/rao-vat">
              <Search className="h-4 w-4 mr-2" />
              Tìm tin đăng
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">${item.price} • {item.location}</p>
              </div>
              <Button variant="ghost" size="sm">
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-teal-50 rounded-xl border border-teal-100 p-4">
        <h3 className="font-semibold text-teal-800 mb-2">Mẹo sử dụng</h3>
        <ul className="text-sm text-teal-700 space-y-1">
          <li>• Lưu tin để so sánh nhiều lựa chọn</li>
          <li>• Tin đã lưu sẽ được giữ lại khi bạn đăng nhập lại</li>
          <li>• Bạn sẽ nhận thông báo nếu tin đã lưu có cập nhật</li>
        </ul>
      </div>
    </div>
  );
}
