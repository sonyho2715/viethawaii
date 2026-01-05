import Link from 'next/link';
import {
  Calculator,
  DollarSign,
  Home,
  Clock,
  Receipt,
  Briefcase,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Công Cụ Hữu Ích | VietHawaii',
  description: 'Các công cụ tiện ích cho cộng đồng Việt Nam tại Hawaii: đổi tiền, tính tiền thuê nhà, tính lương, múi giờ Việt Nam, tính tip.',
};

const tools = [
  {
    id: 'currency',
    href: '/cong-cu/doi-tien',
    icon: DollarSign,
    titleVn: 'Đổi Tiền USD ↔ VND',
    titleEn: 'Currency Converter',
    descVn: 'Quy đổi nhanh giữa đô la Mỹ và đồng Việt Nam với tỷ giá cập nhật.',
    descEn: 'Quick conversion between USD and VND with live exchange rates.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'rent',
    href: '/cong-cu/tinh-tien-thue',
    icon: Home,
    titleVn: 'Tính Tiền Thuê Nhà',
    titleEn: 'Rent Calculator',
    descVn: 'Tính số tiền thuê nhà phù hợp với thu nhập của bạn tại Hawaii.',
    descEn: 'Calculate affordable rent based on your income in Hawaii.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'paycheck',
    href: '/cong-cu/tinh-luong',
    icon: Briefcase,
    titleVn: 'Tính Lương Thực Nhận',
    titleEn: 'Paycheck Calculator',
    descVn: 'Tính lương thực nhận sau thuế liên bang và thuế Hawaii.',
    descEn: 'Calculate take-home pay after federal and Hawaii state taxes.',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'timezone',
    href: '/cong-cu/gio-viet-nam',
    icon: Clock,
    titleVn: 'Giờ Việt Nam',
    titleEn: 'Vietnam Time',
    descVn: 'Xem giờ Việt Nam hiện tại và thời điểm tốt nhất để gọi điện về nhà.',
    descEn: 'Check current Vietnam time and best times to call home.',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'tip',
    href: '/cong-cu/tinh-tip',
    icon: Receipt,
    titleVn: 'Tính Tiền Tip',
    titleEn: 'Tip Calculator',
    descVn: 'Tính tiền tip theo phong cách Mỹ và chia bill khi đi ăn nhóm.',
    descEn: 'Calculate tips and split bills when dining out.',
    color: 'from-pink-500 to-rose-600',
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-4">
          <Calculator className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Công Cụ Hữu Ích
        </h1>
        <p className="text-gray-600">
          Useful Tools for Vietnamese in Hawaii
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-teal-300 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${tool.color} shrink-0`}>
                <tool.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                  {tool.titleVn}
                </h2>
                <p className="text-sm text-gray-500 mb-1">{tool.titleEn}</p>
                <p className="text-gray-600 text-sm">{tool.descVn}</p>
              </div>
              <div className="text-gray-400 group-hover:text-teal-500 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
        <h3 className="font-semibold text-gray-900 mb-2">
          Bạn cần công cụ khác?
        </h3>
        <p className="text-gray-600 text-sm">
          Hãy liên hệ với chúng tôi để đề xuất công cụ mới hữu ích cho cộng đồng.
        </p>
        <Link
          href="/lien-he"
          className="inline-flex items-center mt-3 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          Liên hệ ngay
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
