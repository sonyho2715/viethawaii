'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DollarSign, ArrowLeft, Calculator, Info, TrendingUp, Home, Car, Utensils, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/i18n';

// Hawaii cost data (monthly averages in USD)
const hawaiiCosts = {
  housing: {
    studio: 1800,
    oneBed: 2200,
    twoBed: 2800,
    threeBed: 3500,
    house: 4500,
  },
  utilities: 250, // Electric, water, internet
  food: {
    groceries: 600,
    diningOut: 400,
  },
  transportation: {
    carPayment: 400,
    insurance: 150,
    gas: 200,
    maintenance: 100,
  },
  healthcare: 300, // Insurance premium average
  phone: 80,
  entertainment: 200,
};

// Cost comparison multipliers (relative to US average)
const locationMultipliers: Record<string, { name: string; nameVi: string; multiplier: number }> = {
  vietnam: { name: 'Vietnam', nameVi: 'Việt Nam', multiplier: 0.25 },
  california: { name: 'California', nameVi: 'California', multiplier: 0.85 },
  texas: { name: 'Texas', nameVi: 'Texas', multiplier: 0.65 },
  florida: { name: 'Florida', nameVi: 'Florida', multiplier: 0.70 },
  washington: { name: 'Washington State', nameVi: 'Washington', multiplier: 0.80 },
  newYork: { name: 'New York', nameVi: 'New York', multiplier: 0.90 },
  usAverage: { name: 'US Average', nameVi: 'TB Nước Mỹ', multiplier: 0.70 },
};

export default function CostOfLivingCalculator() {
  const { language } = useLanguage();

  const [housing, setHousing] = useState<keyof typeof hawaiiCosts.housing>('twoBed');
  const [location, setLocation] = useState('usAverage');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [hasCar, setHasCar] = useState(true);
  const [diningOutFrequency, setDiningOutFrequency] = useState<'rarely' | 'sometimes' | 'often'>('sometimes');

  // Calculate Hawaii costs
  const housingCost = hawaiiCosts.housing[housing];
  const utilitiesCost = hawaiiCosts.utilities * (housing === 'house' ? 1.5 : 1);
  const groceryCost = hawaiiCosts.food.groceries * (adults * 1 + children * 0.5);
  const diningCost = diningOutFrequency === 'rarely' ? 150 : diningOutFrequency === 'sometimes' ? 400 : 700;
  const transportCost = hasCar
    ? hawaiiCosts.transportation.carPayment + hawaiiCosts.transportation.insurance +
      hawaiiCosts.transportation.gas + hawaiiCosts.transportation.maintenance
    : 150; // Bus pass
  const healthcareCost = hawaiiCosts.healthcare * adults;
  const phoneCost = hawaiiCosts.phone * adults;
  const entertainmentCost = hawaiiCosts.entertainment * (adults + children * 0.3);

  const totalHawaii = housingCost + utilitiesCost + groceryCost + diningCost +
                      transportCost + healthcareCost + phoneCost + entertainmentCost;

  const comparisonLocation = locationMultipliers[location];
  const totalComparison = totalHawaii * comparisonLocation.multiplier;
  const difference = totalHawaii - totalComparison;
  const percentDiff = ((difference / totalComparison) * 100).toFixed(0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount * 24500);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Link
              href="/cong-cu"
              className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-4 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'vi' ? 'Quay lại Công Cụ' : 'Back to Tools'}
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'vi' ? 'Chi Phí Sinh Hoạt Hawaii' : 'Hawaii Cost of Living Calculator'}
                </h1>
                <p className="text-green-100">
                  {language === 'vi'
                    ? 'So sánh chi phí sinh hoạt và lập ngân sách'
                    : 'Compare costs and plan your budget'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-600" />
                  {language === 'vi' ? 'Thông Tin Của Bạn' : 'Your Information'}
                </h2>

                {/* Family Size */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Số người lớn' : 'Number of adults'}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          onClick={() => setAdults(n)}
                          className={`flex-1 py-2 rounded-lg font-medium transition ${
                            adults === n
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Số trẻ em' : 'Number of children'}
                    </label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((n) => (
                        <button
                          key={n}
                          onClick={() => setChildren(n)}
                          className={`flex-1 py-2 rounded-lg font-medium transition ${
                            children === n
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Housing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Loại nhà ở' : 'Housing type'}
                    </label>
                    <select
                      value={housing}
                      onChange={(e) => setHousing(e.target.value as keyof typeof hawaiiCosts.housing)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="studio">Studio ({formatCurrency(hawaiiCosts.housing.studio)}/mo)</option>
                      <option value="oneBed">1 {language === 'vi' ? 'phòng ngủ' : 'Bedroom'} ({formatCurrency(hawaiiCosts.housing.oneBed)}/mo)</option>
                      <option value="twoBed">2 {language === 'vi' ? 'phòng ngủ' : 'Bedrooms'} ({formatCurrency(hawaiiCosts.housing.twoBed)}/mo)</option>
                      <option value="threeBed">3 {language === 'vi' ? 'phòng ngủ' : 'Bedrooms'} ({formatCurrency(hawaiiCosts.housing.threeBed)}/mo)</option>
                      <option value="house">{language === 'vi' ? 'Nhà riêng' : 'House'} ({formatCurrency(hawaiiCosts.housing.house)}/mo)</option>
                    </select>
                  </div>

                  {/* Transportation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Phương tiện đi lại' : 'Transportation'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setHasCar(true)}
                        className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                          hasCar
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Car className="w-4 h-4" />
                        {language === 'vi' ? 'Có xe' : 'Own car'}
                      </button>
                      <button
                        onClick={() => setHasCar(false)}
                        className={`flex-1 py-2 rounded-lg font-medium transition ${
                          !hasCar
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {language === 'vi' ? 'Xe buýt' : 'Bus'}
                      </button>
                    </div>
                  </div>

                  {/* Dining */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Tần suất ăn ngoài' : 'Dining out frequency'}
                    </label>
                    <div className="flex gap-2">
                      {(['rarely', 'sometimes', 'often'] as const).map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setDiningOutFrequency(freq)}
                          className={`flex-1 py-2 rounded-lg font-medium transition text-sm ${
                            diningOutFrequency === freq
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {freq === 'rarely'
                            ? (language === 'vi' ? 'Hiếm khi' : 'Rarely')
                            : freq === 'sometimes'
                            ? (language === 'vi' ? 'Đôi khi' : 'Sometimes')
                            : (language === 'vi' ? 'Thường xuyên' : 'Often')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Compare Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'So sánh với' : 'Compare with'}
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      {Object.entries(locationMultipliers).map(([key, loc]) => (
                        <option key={key} value={key}>
                          {language === 'vi' ? loc.nameVi : loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Summary Card */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                <h2 className="text-lg font-semibold mb-4">
                  {language === 'vi' ? 'Chi Phí Hàng Tháng Tại Hawaii' : 'Monthly Cost in Hawaii'}
                </h2>
                <div className="text-4xl font-bold mb-2">
                  {formatCurrency(totalHawaii)}
                  <span className="text-lg font-normal text-green-100">/month</span>
                </div>
                <p className="text-green-100 text-sm mb-4">
                  {formatVND(totalHawaii)}
                </p>

                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-green-100">
                      {language === 'vi' ? 'So với' : 'Compared to'} {language === 'vi' ? comparisonLocation.nameVi : comparisonLocation.name}
                    </span>
                    <span className="text-xl font-bold text-yellow-300">
                      +{percentDiff}%
                    </span>
                  </div>
                  <p className="text-sm text-green-100 mt-1">
                    {language === 'vi'
                      ? `Cao hơn ${formatCurrency(difference)}/tháng`
                      : `${formatCurrency(difference)}/month more`}
                  </p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'vi' ? 'Chi Tiết Chi Phí' : 'Cost Breakdown'}
                </h3>
                <div className="space-y-4">
                  <CostRow
                    icon={<Home className="w-5 h-5" />}
                    label={language === 'vi' ? 'Nhà ở' : 'Housing'}
                    amount={housingCost}
                    color="bg-blue-100 text-blue-600"
                  />
                  <CostRow
                    icon={<Zap className="w-5 h-5" />}
                    label={language === 'vi' ? 'Tiện ích' : 'Utilities'}
                    amount={utilitiesCost}
                    color="bg-yellow-100 text-yellow-600"
                  />
                  <CostRow
                    icon={<Utensils className="w-5 h-5" />}
                    label={language === 'vi' ? 'Thực phẩm' : 'Food'}
                    amount={groceryCost + diningCost}
                    color="bg-orange-100 text-orange-600"
                  />
                  <CostRow
                    icon={<Car className="w-5 h-5" />}
                    label={language === 'vi' ? 'Di chuyển' : 'Transportation'}
                    amount={transportCost}
                    color="bg-purple-100 text-purple-600"
                  />
                  <CostRow
                    icon={<TrendingUp className="w-5 h-5" />}
                    label={language === 'vi' ? 'Y tế & Khác' : 'Healthcare & Other'}
                    amount={healthcareCost + phoneCost + entertainmentCost}
                    color="bg-green-100 text-green-600"
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      {language === 'vi' ? 'Tổng cộng' : 'Total'}
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalHawaii)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Annual Estimate */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900">
                      {language === 'vi' ? 'Thu Nhập Cần Thiết' : 'Required Income'}
                    </h4>
                    <p className="text-amber-800 mt-1">
                      {language === 'vi'
                        ? `Bạn cần thu nhập tối thiểu ${formatCurrency(totalHawaii * 12)}/năm (trước thuế khoảng ${formatCurrency(totalHawaii * 12 * 1.35)}) để sống thoải mái tại Hawaii.`
                        : `You need a minimum income of ${formatCurrency(totalHawaii * 12)}/year (about ${formatCurrency(totalHawaii * 12 * 1.35)} gross) to live comfortably in Hawaii.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'vi' ? 'Mẹo Tiết Kiệm Tại Hawaii' : 'Money-Saving Tips in Hawaii'}
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    {language === 'vi'
                      ? 'Ở xa Waikiki/Honolulu để giảm tiền thuê nhà (Kapolei, Ewa Beach, Mililani)'
                      : 'Live away from Waikiki/Honolulu for lower rent (Kapolei, Ewa Beach, Mililani)'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    {language === 'vi'
                      ? 'Mua sắm tại Costco hoặc Don Quijote thay vì Safeway'
                      : 'Shop at Costco or Don Quijote instead of Safeway'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    {language === 'vi'
                      ? 'Sử dụng năng lượng mặt trời nếu thuê nhà riêng'
                      : 'Use solar power if renting a house'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    {language === 'vi'
                      ? 'Tận dụng các chợ nông sản địa phương vào cuối tuần'
                      : 'Take advantage of local farmers markets on weekends'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CostRow({
  icon,
  label,
  amount,
  color
}: {
  icon: React.ReactNode;
  label: string;
  amount: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <span className="font-bold text-gray-900">
        ${amount.toLocaleString()}
      </span>
    </div>
  );
}
