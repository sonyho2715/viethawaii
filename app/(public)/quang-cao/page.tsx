import Link from 'next/link';
import { Megaphone, Users, Eye, BarChart, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quảng Cáo | VietHawaii',
  description: 'Quảng cáo doanh nghiệp của bạn đến cộng đồng người Việt tại Hawaii.',
};

const benefits = [
  {
    icon: Users,
    title: 'Đối tượng mục tiêu',
    titleEn: 'Target Audience',
    desc: 'Tiếp cận trực tiếp cộng đồng người Việt tại Hawaii',
  },
  {
    icon: Eye,
    title: 'Hiển thị nổi bật',
    titleEn: 'Premium Visibility',
    desc: 'Vị trí quảng cáo được đặt ở các vị trí đẹp nhất',
  },
  {
    icon: BarChart,
    title: 'Báo cáo chi tiết',
    titleEn: 'Detailed Reports',
    desc: 'Theo dõi hiệu quả quảng cáo với số liệu cụ thể',
  },
];

const packages = [
  {
    name: 'Tin nổi bật',
    nameEn: 'Featured Listing',
    price: 'Miễn phí (MVP)',
    priceEn: 'Free (MVP)',
    features: [
      'Hiển thị ở đầu danh sách',
      'Nhãn "Nổi bật" màu vàng',
      'Thời gian: 7 ngày',
    ],
    featuresEn: [
      'Top of listing results',
      'Yellow "Featured" badge',
      'Duration: 7 days',
    ],
    popular: true,
  },
  {
    name: 'Banner quảng cáo',
    nameEn: 'Banner Ad',
    price: 'Liên hệ',
    priceEn: 'Contact Us',
    features: [
      'Banner trên trang chủ',
      'Click-through tracking',
      'Thiết kế theo yêu cầu',
    ],
    featuresEn: [
      'Homepage banner placement',
      'Click-through tracking',
      'Custom design',
    ],
    popular: false,
  },
  {
    name: 'Đối tác chiến lược',
    nameEn: 'Strategic Partner',
    price: 'Liên hệ',
    priceEn: 'Contact Us',
    features: [
      'Logo trên trang chủ',
      'Bài viết PR trên tin tức',
      'Ưu tiên trong kết quả tìm kiếm',
    ],
    featuresEn: [
      'Homepage logo placement',
      'PR article in news section',
      'Priority in search results',
    ],
    popular: false,
  },
];

export default function AdvertisePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 mb-4">
          <Megaphone className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Quảng Cáo Trên VietHawaii
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tiếp cận hàng nghìn người Việt tại Hawaii đang tìm kiếm nhà ở, việc làm, và dịch vụ
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="bg-white rounded-xl border border-gray-200 p-6 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
              <benefit.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{benefit.titleEn}</p>
            <p className="text-gray-600 text-sm">{benefit.desc}</p>
          </div>
        ))}
      </div>

      {/* Packages */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Gói Quảng Cáo
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative bg-white rounded-xl border-2 p-6 ${
                pkg.popular ? 'border-teal-500 shadow-lg' : 'border-gray-200'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 bg-teal-500 text-white text-xs font-medium rounded-full">
                    <Star className="h-3 w-3 mr-1" />
                    Phổ biến
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                <p className="text-sm text-gray-500">{pkg.nameEn}</p>
                <p className="text-2xl font-bold text-teal-600 mt-3">{pkg.price}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="h-5 w-5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={pkg.popular ? 'default' : 'outline'}
                className={`w-full ${pkg.popular ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
              >
                <Link href="/lien-he">
                  Liên hệ
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">
          Sẵn sàng quảng bá doanh nghiệp?
        </h2>
        <p className="text-teal-100 mb-6 max-w-xl mx-auto">
          Liên hệ với chúng tôi để nhận tư vấn miễn phí và báo giá chi tiết cho nhu cầu quảng cáo của bạn.
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link href="/lien-he">
            Liên hệ ngay
          </Link>
        </Button>
      </div>
    </div>
  );
}
