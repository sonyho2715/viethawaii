import { Metadata } from 'next';
import Link from 'next/link';
import { DollarSign, Home, Calculator, Send, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Công Cụ Hữu Ích | Useful Tools | VietHawaii',
  description: 'Các công cụ tính toán giúp bạn chuẩn bị cho cuộc sống Hawaii. Calculators to help prepare for Hawaii life.',
  openGraph: {
    title: 'Công Cụ Hữu Ích - VietHawaii Tools',
    description: 'Các công cụ tính toán cho cuộc sống Hawaii',
  },
};

const tools = [
  {
    slug: 'chi-phi-sinh-hoat',
    name: 'Chi Phí Sinh Hoạt',
    nameEn: 'Cost of Living Calculator',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    description: 'So sánh chi phí sinh hoạt giữa Hawaii và nơi bạn đang sống. Tính toán ngân sách hàng tháng cần thiết.',
    descriptionEn: 'Compare cost of living between Hawaii and your current location.',
    features: ['So sánh giá thuê nhà', 'Chi phí thực phẩm', 'Chi phí di chuyển', 'Tiện ích & internet'],
  },
  {
    slug: 'tinh-vay-nha',
    name: 'Tính Vay Nhà',
    nameEn: 'Mortgage Calculator',
    icon: Home,
    color: 'from-blue-500 to-indigo-600',
    description: 'Tính toán khoản vay mua nhà và lãi suất hàng tháng. Xem bạn có đủ điều kiện vay bao nhiêu.',
    descriptionEn: 'Calculate home loan payments and monthly interest.',
    features: ['Tính số tiền trả hàng tháng', 'So sánh lãi suất', 'Xem tổng chi phí', 'Lịch trả nợ'],
  },
  {
    slug: 'tinh-thue',
    name: 'Tính Thuế',
    nameEn: 'Tax Calculator',
    icon: Calculator,
    color: 'from-purple-500 to-violet-600',
    description: 'Ước tính thuế thu nhập liên bang và tiểu bang Hawaii. Hiểu rõ nghĩa vụ thuế của bạn.',
    descriptionEn: 'Estimate federal and Hawaii state income taxes.',
    features: ['Thuế liên bang', 'Thuế tiểu bang Hawaii', 'GET Tax (4.5%)', 'Khấu trừ phổ biến'],
  },
  {
    slug: 'chuyen-tien',
    name: 'Chuyển Tiền Về VN',
    nameEn: 'Remittance Calculator',
    icon: Send,
    color: 'from-orange-500 to-red-600',
    description: 'So sánh phí và tỷ giá chuyển tiền về Việt Nam từ các dịch vụ khác nhau.',
    descriptionEn: 'Compare fees and rates for sending money to Vietnam.',
    features: ['So sánh tỷ giá', 'So sánh phí chuyển', 'Thời gian nhận tiền', 'Đề xuất dịch vụ tốt nhất'],
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-600 via-red-700 to-yellow-500 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Công Cụ Hữu Ích
              </h1>
              <p className="text-xl text-red-100 mb-2">
                Useful Tools for Hawaii Life
              </p>
              <p className="text-lg text-red-100 max-w-2xl mx-auto">
                Các công cụ tính toán miễn phí giúp bạn chuẩn bị và quản lý cuộc sống tại Hawaii
              </p>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={`/cong-cu/${tool.slug}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                  >
                    <div className={`bg-gradient-to-r ${tool.color} p-6 text-white`}>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{tool.name}</h2>
                          <p className="text-white/80">{tool.nameEn}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{tool.description}</p>
                      <ul className="space-y-2 mb-6">
                        {tool.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-2 text-red-600 font-semibold group-hover:gap-4 transition-all">
                        <span>Sử Dụng Ngay</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                💡 Lời Khuyên Tài Chính
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Chuẩn Bị Trước Khi Đến Hawaii</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Tiết kiệm ít nhất 6 tháng chi phí sinh hoạt</li>
                    <li>• Nghiên cứu giá thuê nhà ở khu vực bạn muốn sống</li>
                    <li>• Tính toán chi phí di chuyển (xe hơi là cần thiết)</li>
                    <li>• Hiểu về thuế tiểu bang Hawaii (GET 4.5%)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Sau Khi Định Cư</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Mở tài khoản ngân hàng địa phương (Bank of Hawaii, First Hawaiian)</li>
                    <li>• Đăng ký điện thoại với gói phù hợp</li>
                    <li>• Tìm hiểu về chương trình hỗ trợ (SNAP, WIC nếu đủ điều kiện)</li>
                    <li>• Tham gia cộng đồng người Việt địa phương</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
