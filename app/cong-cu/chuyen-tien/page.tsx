'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Send, ArrowLeft, Info, DollarSign, Clock, Star, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/i18n';

// Remittance service data (approximate rates - will need to be updated)
const remittanceServices = [
  {
    id: 'remitly',
    name: 'Remitly',
    logo: '💸',
    exchangeRate: 24850, // VND per USD
    fee: 0, // First transfer often free
    feeType: 'flat',
    minAmount: 1,
    maxAmount: 10000,
    deliveryTime: '1-3',
    deliveryTimeUnit: 'days',
    payoutMethods: ['Bank', 'Cash', 'Mobile Wallet'],
    rating: 4.7,
    promoVi: 'Miễn phí chuyển lần đầu',
    promoEn: 'First transfer free',
    popular: true,
  },
  {
    id: 'wise',
    name: 'Wise',
    logo: '🌐',
    exchangeRate: 24950, // Usually mid-market rate
    fee: 0.0065, // ~0.65% of transfer
    feeType: 'percent',
    minFee: 3,
    minAmount: 1,
    maxAmount: 50000,
    deliveryTime: '1-2',
    deliveryTimeUnit: 'days',
    payoutMethods: ['Bank'],
    rating: 4.8,
    promoVi: 'Tỷ giá trung bình thị trường',
    promoEn: 'Mid-market exchange rate',
    popular: true,
  },
  {
    id: 'worldremit',
    name: 'WorldRemit',
    logo: '🌍',
    exchangeRate: 24750,
    fee: 3.99,
    feeType: 'flat',
    minAmount: 1,
    maxAmount: 10000,
    deliveryTime: 'instant',
    deliveryTimeUnit: 'minutes',
    payoutMethods: ['Bank', 'Cash', 'Mobile Wallet'],
    rating: 4.5,
    promoVi: 'Nhận tiền trong vài phút',
    promoEn: 'Receive in minutes',
    popular: false,
  },
  {
    id: 'xoom',
    name: 'Xoom (PayPal)',
    logo: '💳',
    exchangeRate: 24600,
    fee: 0,
    feeType: 'flat',
    minAmount: 10,
    maxAmount: 10000,
    deliveryTime: 'instant',
    deliveryTimeUnit: 'minutes',
    payoutMethods: ['Bank', 'Cash'],
    rating: 4.3,
    promoVi: 'Nhận tiền mặt tại Việt Nam',
    promoEn: 'Cash pickup in Vietnam',
    popular: false,
  },
  {
    id: 'westernunion',
    name: 'Western Union',
    logo: '🏦',
    exchangeRate: 24400,
    fee: 5,
    feeType: 'flat',
    minAmount: 1,
    maxAmount: 5000,
    deliveryTime: 'instant',
    deliveryTimeUnit: 'minutes',
    payoutMethods: ['Cash', 'Bank'],
    rating: 4.0,
    promoVi: 'Nhận tiền mặt toàn quốc',
    promoEn: 'Cash pickup nationwide',
    popular: false,
  },
  {
    id: 'ria',
    name: 'Ria Money Transfer',
    logo: '📨',
    exchangeRate: 24700,
    fee: 2.99,
    feeType: 'flat',
    minAmount: 1,
    maxAmount: 7500,
    deliveryTime: '1-3',
    deliveryTimeUnit: 'days',
    payoutMethods: ['Bank', 'Cash'],
    rating: 4.2,
    promoVi: 'Phí thấp nhất',
    promoEn: 'Lowest fees',
    popular: false,
  },
];

export default function RemittanceCalculator() {
  const { language } = useLanguage();
  const [sendAmount, setSendAmount] = useState(500);
  const [sortBy, setSortBy] = useState<'best' | 'rate' | 'speed' | 'fee'>('best');

  const calculatedServices = useMemo(() => {
    return remittanceServices.map(service => {
      const fee = service.feeType === 'percent'
        ? Math.max(service.minFee || 0, sendAmount * (service.fee as number))
        : service.fee;
      const netAmount = sendAmount - fee;
      const receiveAmount = netAmount * service.exchangeRate;
      const effectiveRate = receiveAmount / sendAmount;

      return {
        ...service,
        fee,
        netAmount,
        receiveAmount,
        effectiveRate,
      };
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rate':
          return b.exchangeRate - a.exchangeRate;
        case 'speed':
          const speedA = a.deliveryTime === 'instant' ? 0 : parseInt(a.deliveryTime);
          const speedB = b.deliveryTime === 'instant' ? 0 : parseInt(b.deliveryTime);
          return speedA - speedB;
        case 'fee':
          return a.fee - b.fee;
        default: // 'best' - by effective rate (what you actually receive)
          return b.effectiveRate - a.effectiveRate;
      }
    });
  }, [sendAmount, sortBy]);

  const bestService = calculatedServices[0];
  const worstService = calculatedServices[calculatedServices.length - 1];
  const savings = bestService.receiveAmount - worstService.receiveAmount;

  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);

  const formatUSD = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Link
              href="/cong-cu"
              className="inline-flex items-center gap-2 text-orange-100 hover:text-white mb-4 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'vi' ? 'Quay lại Công Cụ' : 'Back to Tools'}
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Send className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'vi' ? 'Chuyển Tiền Về Việt Nam' : 'Send Money to Vietnam'}
                </h1>
                <p className="text-orange-100">
                  {language === 'vi'
                    ? 'So sánh tỷ giá và phí từ các dịch vụ khác nhau'
                    : 'Compare rates and fees from different services'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Amount Input */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'vi' ? 'Số tiền gửi (USD)' : 'Send Amount (USD)'}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(Math.max(1, Number(e.target.value)))}
                    className="w-full pl-10 pr-4 py-3 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {[100, 200, 500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setSendAmount(amt)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                        sendAmount === amt
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-orange-500 rotate-90 md:rotate-0" />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'vi' ? 'Người nhận sẽ nhận được (VND)' : 'Recipient Gets (VND)'}
                </label>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-700">
                    {formatVND(bestService.receiveAmount)}
                  </p>
                  <p className="text-sm text-green-600">
                    {language === 'vi' ? 'với dịch vụ tốt nhất' : 'with best service'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Banner */}
          {savings > 100000 && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {language === 'vi' ? 'Tiết kiệm tới' : 'Save up to'}
                  </p>
                  <p className="text-2xl font-bold">{formatVND(savings)}</p>
                </div>
                <p className="text-green-100 text-sm max-w-xs">
                  {language === 'vi'
                    ? 'Chênh lệch giữa dịch vụ tốt nhất và kém nhất'
                    : 'Difference between best and worst service'}
                </p>
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-gray-500 py-2">
              {language === 'vi' ? 'Sắp xếp theo:' : 'Sort by:'}
            </span>
            {[
              { value: 'best', label: language === 'vi' ? 'Tốt nhất' : 'Best Value' },
              { value: 'rate', label: language === 'vi' ? 'Tỷ giá cao' : 'Best Rate' },
              { value: 'speed', label: language === 'vi' ? 'Nhanh nhất' : 'Fastest' },
              { value: 'fee', label: language === 'vi' ? 'Phí thấp' : 'Lowest Fee' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as typeof sortBy)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  sortBy === option.value
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Service Cards */}
          <div className="space-y-4">
            {calculatedServices.map((service, index) => (
              <div
                key={service.id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                  index === 0 ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {index === 0 && (
                  <div className="bg-green-500 text-white text-sm font-semibold px-4 py-1 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {language === 'vi' ? 'Lựa chọn tốt nhất' : 'Best Choice'}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Service Info */}
                    <div className="flex items-center gap-4 md:w-48">
                      <span className="text-3xl">{service.logo}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{service.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{service.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rate & Fee */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === 'vi' ? 'Tỷ giá' : 'Rate'}
                        </p>
                        <p className="font-bold text-gray-900">
                          1 USD = {service.exchangeRate.toLocaleString()} VND
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === 'vi' ? 'Phí' : 'Fee'}
                        </p>
                        <p className="font-bold text-gray-900">
                          {service.fee === 0 ? (
                            <span className="text-green-600">
                              {language === 'vi' ? 'Miễn phí' : 'Free'}
                            </span>
                          ) : (
                            formatUSD(service.fee)
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === 'vi' ? 'Thời gian' : 'Delivery'}
                        </p>
                        <p className="font-bold text-gray-900 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-orange-500" />
                          {service.deliveryTime === 'instant'
                            ? (language === 'vi' ? 'Tức thì' : 'Instant')
                            : `${service.deliveryTime} ${service.deliveryTimeUnit === 'days'
                              ? (language === 'vi' ? 'ngày' : 'days')
                              : (language === 'vi' ? 'phút' : 'min')}`
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === 'vi' ? 'Người nhận được' : 'Recipient Gets'}
                        </p>
                        <p className="font-bold text-green-600">
                          {formatVND(service.receiveAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Promo & Methods */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-orange-600 font-medium">
                      {language === 'vi' ? service.promoVi : service.promoEn}
                    </p>
                    <div className="flex gap-2">
                      {service.payoutMethods.map((method) => (
                        <span
                          key={method}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {method === 'Bank'
                            ? (language === 'vi' ? 'Ngân hàng' : 'Bank')
                            : method === 'Cash'
                            ? (language === 'vi' ? 'Tiền mặt' : 'Cash')
                            : method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900">
                  {language === 'vi' ? 'Lưu Ý Khi Chuyển Tiền' : 'Remittance Tips'}
                </h4>
                <ul className="text-amber-800 mt-2 text-sm space-y-1">
                  <li>• {language === 'vi'
                    ? 'Tỷ giá thay đổi liên tục. Kiểm tra trước khi gửi.'
                    : 'Exchange rates change constantly. Check before sending.'}
                  </li>
                  <li>• {language === 'vi'
                    ? 'Chuyển số lượng lớn ($1000+) thường có tỷ giá tốt hơn'
                    : 'Larger amounts ($1000+) often get better rates'}
                  </li>
                  <li>• {language === 'vi'
                    ? 'Chuyển vào tài khoản ngân hàng an toàn hơn nhận tiền mặt'
                    : 'Bank deposits are safer than cash pickup'}
                  </li>
                  <li>• {language === 'vi'
                    ? 'Một số dịch vụ yêu cầu xác minh danh tính cho số tiền lớn'
                    : 'Some services require ID verification for large amounts'}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Popular Banks in Vietnam */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'vi' ? 'Ngân Hàng Phổ Biến Tại Việt Nam' : 'Popular Banks in Vietnam'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Vietcombank', 'Techcombank', 'VietinBank', 'BIDV', 'ACB', 'MB Bank', 'Sacombank', 'VPBank'].map((bank) => (
                <div key={bank} className="bg-gray-50 rounded-lg p-3 text-center">
                  <span className="font-medium text-gray-700">{bank}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {language === 'vi'
                ? 'Tất cả các dịch vụ trên đều hỗ trợ chuyển tiền đến các ngân hàng này'
                : 'All services above support transfers to these banks'}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
