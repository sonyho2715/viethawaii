'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import {
  FileText,
  Car,
  Home,
  Briefcase,
  CreditCard,
  Phone,
  MapPin,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const GUIDES = [
  {
    id: 'state-id',
    iconName: 'FileText',
    titleVn: 'Làm State ID Hawaii',
    titleEn: 'Get Hawaii State ID',
    descVn: 'Hướng dẫn từng bước để lấy thẻ ID tại Hawaii. Giấy tờ cần thiết, địa điểm và chi phí.',
    descEn: 'Step-by-step guide to getting your Hawaii ID card. Required documents, locations, and fees.',
    steps: [
      { vn: 'Chuẩn bị giấy tờ (hộ chiếu, visa, I-94)', en: 'Prepare documents (passport, visa, I-94)' },
      { vn: 'Đặt lịch hẹn tại DMV', en: 'Schedule appointment at DMV' },
      { vn: 'Mang theo bằng chứng địa chỉ', en: 'Bring proof of address' },
      { vn: 'Phí khoảng $40', en: 'Fee is approximately $40' },
    ],
  },
  {
    id: 'drivers-license',
    iconName: 'Car',
    titleVn: 'Đổi Bằng Lái Xe',
    titleEn: 'Get Driver License',
    descVn: 'Cách đổi bằng lái từ bang khác hoặc từ Việt Nam sang bằng lái Hawaii.',
    descEn: 'How to transfer your license from another state or Vietnam to a Hawaii license.',
    steps: [
      { vn: 'Mang bằng lái cũ + bản dịch (nếu từ VN)', en: 'Bring old license + translation (if from VN)' },
      { vn: 'Thi lý thuyết (có tiếng Việt)', en: 'Take written test (Vietnamese available)' },
      { vn: 'Thi lái xe thực hành', en: 'Take road test' },
      { vn: 'Phí khoảng $40', en: 'Fee is approximately $40' },
    ],
  },
  {
    id: 'housing',
    iconName: 'Home',
    titleVn: 'Tìm Nhà Ở',
    titleEn: 'Find Housing',
    descVn: 'Mẹo tìm nhà thuê giá tốt tại Hawaii. Những khu vực có đông người Việt sinh sống.',
    descEn: 'Tips for finding affordable rentals in Hawaii. Areas with Vietnamese communities.',
    steps: [
      { vn: 'Khu vực: Kalihi, Chinatown, Salt Lake', en: 'Areas: Kalihi, Chinatown, Salt Lake' },
      { vn: 'Giá thuê trung bình: $1,500-$2,500/tháng', en: 'Average rent: $1,500-$2,500/month' },
      { vn: 'Cần deposit 1-2 tháng tiền thuê', en: 'Need 1-2 months deposit' },
      { vn: 'Xem tin đăng tại VietHawaii', en: 'Check listings on VietHawaii' },
    ],
  },
  {
    id: 'jobs',
    iconName: 'Briefcase',
    titleVn: 'Tìm Việc Làm',
    titleEn: 'Find Jobs',
    descVn: 'Các công việc phổ biến cho người Việt mới đến. Resume tips và cách apply.',
    descEn: 'Common jobs for Vietnamese newcomers. Resume tips and application process.',
    steps: [
      { vn: 'Công việc phổ biến: nhà hàng, nail, cleaning', en: 'Common jobs: restaurant, nail, cleaning' },
      { vn: 'Lương tối thiểu: $14/giờ', en: 'Minimum wage: $14/hour' },
      { vn: 'Cần Social Security Number để làm việc', en: 'Need SSN to work legally' },
      { vn: 'Xem việc làm tại VietHawaii', en: 'Check jobs on VietHawaii' },
    ],
  },
  {
    id: 'banking',
    iconName: 'CreditCard',
    titleVn: 'Mở Tài Khoản Ngân Hàng',
    titleEn: 'Open Bank Account',
    descVn: 'Cách mở tài khoản ngân hàng tại Hawaii. Ngân hàng nào phổ biến với người Việt.',
    descEn: 'How to open a bank account in Hawaii. Banks popular with Vietnamese.',
    steps: [
      { vn: 'Ngân hàng phổ biến: Bank of Hawaii, First Hawaiian', en: 'Popular banks: Bank of Hawaii, First Hawaiian' },
      { vn: 'Cần ID + địa chỉ + SSN (hoặc ITIN)', en: 'Need ID + address + SSN (or ITIN)' },
      { vn: 'Có thể mở account không cần SSN', en: 'Can open account without SSN' },
      { vn: 'Miễn phí nếu giữ số dư tối thiểu', en: 'Free if maintain minimum balance' },
    ],
  },
  {
    id: 'phone',
    iconName: 'Phone',
    titleVn: 'Mua SIM Điện Thoại',
    titleEn: 'Get Phone Plan',
    descVn: 'Các gói điện thoại giá rẻ tại Hawaii. Gọi về Việt Nam và dùng data.',
    descEn: 'Affordable phone plans in Hawaii. International calls to Vietnam and data.',
    steps: [
      { vn: 'T-Mobile, AT&T, Verizon có gói prepaid', en: 'T-Mobile, AT&T, Verizon have prepaid plans' },
      { vn: 'Gói rẻ từ $25-40/tháng', en: 'Cheap plans from $25-40/month' },
      { vn: 'Mua SIM tại Target, Walmart, Best Buy', en: 'Buy SIM at Target, Walmart, Best Buy' },
      { vn: 'Viber/Zalo miễn phí gọi về VN qua wifi', en: 'Viber/Zalo free calls to VN via wifi' },
    ],
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  Car,
  Home,
  Briefcase,
  CreditCard,
  Phone,
};

export default function GuidesPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {language === 'vn' ? 'Hướng Dẫn Cho Người Mới' : 'Newcomer Guides'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === 'vn'
            ? 'Tổng hợp các hướng dẫn cần thiết cho người Việt mới đến Hawaii. Từ giấy tờ, nhà ở đến việc làm.'
            : 'Essential guides for Vietnamese newcomers to Hawaii. From documents, housing to jobs.'}
        </p>
      </div>

      {/* Quick Links */}
      <div className="bg-teal-50 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-teal-800 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          {language === 'vn' ? 'Địa Điểm Quan Trọng' : 'Important Locations'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-teal-700">DMV Honolulu:</strong>
            <p className="text-gray-600">1199 Dillingham Blvd</p>
          </div>
          <div>
            <strong className="text-teal-700">Social Security Office:</strong>
            <p className="text-gray-600">300 Ala Moana Blvd #1-225</p>
          </div>
          <div>
            <strong className="text-teal-700">Vietnamese Consulate:</strong>
            <p className="text-gray-600">(Nearest in San Francisco)</p>
          </div>
          <div>
            <strong className="text-teal-700">Kalihi (Khu Viet):</strong>
            <p className="text-gray-600">North King Street area</p>
          </div>
        </div>
      </div>

      {/* Guides */}
      <div className="space-y-6">
        {GUIDES.map((guide) => {
          const IconComponent = ICON_MAP[guide.iconName] || FileText;
          return (
            <div
              key={guide.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-100 rounded-xl">
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {language === 'vn' ? guide.titleVn : guide.titleEn}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === 'vn' ? guide.descVn : guide.descEn}
                    </p>
                    <div className="space-y-2">
                      {guide.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {language === 'vn' ? step.vn : step.en}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">
          {language === 'vn' ? 'Cần Thêm Trợ Giúp?' : 'Need More Help?'}
        </h2>
        <p className="text-teal-100 mb-6">
          {language === 'vn'
            ? 'Đăng câu hỏi trên diễn đàn hoặc xem tin đăng việc làm và nhà ở.'
            : 'Post questions on the forum or browse job and housing listings.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/rao-vat?category=viec-lam"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-teal-700 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
          >
            {language === 'vn' ? 'Xem Việc Làm' : 'Browse Jobs'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/rao-vat?category=nha-o"
            className="inline-flex items-center justify-center px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-400 transition-colors"
          >
            {language === 'vn' ? 'Tìm Nhà Ở' : 'Find Housing'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
