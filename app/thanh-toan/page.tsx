'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Check, Building2, Megaphone, Star, BadgeCheck, Zap, Crown, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PricingTier {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  period?: string;
  description: string;
  features: string[];
  icon: typeof Building2;
  color: string;
  popular?: boolean;
  productType: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'classified-boost',
    name: 'Tin Nổi Bật',
    nameEn: 'Featured Listing',
    price: 9.99,
    period: '7 ngày',
    description: 'Đưa tin rao vặt của bạn lên đầu trang và thu hút nhiều người xem hơn',
    features: [
      'Hiển thị ở vị trí đầu tiên',
      'Nhãn "Nổi Bật" nổi bật',
      'Tăng gấp 3x lượt xem',
      'Thông báo cho người quan tâm',
    ],
    icon: Megaphone,
    color: 'orange',
    productType: 'CLASSIFIED_BOOST',
  },
  {
    id: 'business-premium',
    name: 'Doanh Nghiệp Cao Cấp',
    nameEn: 'Business Premium',
    price: 29.99,
    period: 'tháng',
    description: 'Nâng cấp trang doanh nghiệp với nhiều tính năng độc quyền',
    features: [
      'Hiển thị ưu tiên trong tìm kiếm',
      'Huy hiệu "Cao Cấp" vàng',
      'Ảnh không giới hạn',
      'Thống kê chi tiết',
      'Hỗ trợ ưu tiên',
      'Loại bỏ quảng cáo',
    ],
    icon: Crown,
    color: 'yellow',
    popular: true,
    productType: 'BUSINESS_PREMIUM',
  },
  {
    id: 'event-sponsor',
    name: 'Sự Kiện Tài Trợ',
    nameEn: 'Sponsored Event',
    price: 19.99,
    period: '30 ngày',
    description: 'Quảng bá sự kiện của bạn đến nhiều người hơn trong cộng đồng',
    features: [
      'Banner lớn trên trang chủ',
      'Nhãn "Tài Trợ" nổi bật',
      'Chia sẻ lên mạng xã hội',
      'Email thông báo đến subscribers',
    ],
    icon: Star,
    color: 'purple',
    productType: 'EVENT_SPONSOR',
  },
  {
    id: 'org-verification',
    name: 'Xác Thực Tổ Chức',
    nameEn: 'Organization Verification',
    price: 49.99,
    description: 'Xác thực tổ chức của bạn để tăng độ tin cậy với cộng đồng',
    features: [
      'Huy hiệu xác thực xanh',
      'Hiển thị ưu tiên',
      'Xác thực vĩnh viễn',
      'Trang profile nâng cao',
    ],
    icon: BadgeCheck,
    color: 'green',
    productType: 'ORG_VERIFICATION',
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string; light: string }> = {
  orange: { bg: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-200', light: 'bg-orange-50' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-200', light: 'bg-yellow-50' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-200', light: 'bg-purple-50' },
  green: { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-200', light: 'bg-green-50' },
};

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (productType: string) => {
    setLoading(productType);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productType }),
      });

      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch {
      alert('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 text-white/80 mb-4">
              <Link href="/" className="hover:text-white">Trang Chủ</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Nâng Cấp</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Tăng tốc sự hiện diện của bạn
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nâng Cấp Trải Nghiệm
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Tiếp cận nhiều người hơn trong cộng đồng Việt Hawaii với các gói cao cấp
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingTiers.map((tier) => {
                const Icon = tier.icon;
                const colors = colorClasses[tier.color];
                return (
                  <div
                    key={tier.id}
                    className={`relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden ${
                      tier.popular ? 'ring-2 ring-yellow-400' : ''
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-yellow-900 text-center text-sm font-semibold py-1">
                        Phổ Biến Nhất
                      </div>
                    )}

                    <div className={`p-6 ${tier.popular ? 'pt-10' : ''}`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>

                      {/* Name */}
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {tier.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">{tier.nameEn}</p>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900">
                          ${tier.price}
                        </span>
                        {tier.period && (
                          <span className="text-gray-500">/{tier.period}</span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-6">
                        {tier.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <button
                        onClick={() => handlePurchase(tier.productType)}
                        disabled={loading === tier.productType}
                        className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                          tier.popular
                            ? `${colors.bg} text-white hover:opacity-90`
                            : `border-2 ${colors.border} ${colors.text} hover:${colors.light}`
                        } disabled:opacity-50`}
                      >
                        {loading === tier.productType ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            Chọn Gói Này
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Câu Hỏi Thường Gặp
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tôi có thể hủy đăng ký bất cứ lúc nào không?
                </h3>
                <p className="text-gray-600">
                  Có, bạn có thể hủy đăng ký bất cứ lúc nào. Dịch vụ sẽ tiếp tục cho đến hết kỳ thanh toán hiện tại.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Phương thức thanh toán nào được chấp nhận?
                </h3>
                <p className="text-gray-600">
                  Chúng tôi chấp nhận tất cả thẻ tín dụng và debit chính (Visa, MasterCard, American Express).
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Gói Xác Thực Tổ Chức có hiệu lực bao lâu?
                </h3>
                <p className="text-gray-600">
                  Xác thực tổ chức là vĩnh viễn. Bạn chỉ cần thanh toán một lần và tổ chức của bạn sẽ được xác thực mãi mãi.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tôi có thể nâng cấp hoặc hạ cấp gói không?
                </h3>
                <p className="text-gray-600">
                  Có, bạn có thể thay đổi gói bất cứ lúc nào. Chênh lệch giá sẽ được tính theo tỷ lệ.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex flex-wrap justify-center gap-8 items-center text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                <span className="text-sm">Bảo mật SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
                <span className="text-sm">Stripe Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-sm">Hoàn tiền 7 ngày</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
