'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Calculator, Info, TrendingUp, DollarSign } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/i18n';

// Hawaii-specific data
const hawaiiData = {
  averageHomePrice: 850000,
  medianPrice: 750000,
  propertyTaxRate: 0.0028, // 0.28% for owner-occupied
  insuranceRate: 0.0035, // ~0.35% of home value
  hoaAverage: 600, // Monthly HOA for condos
  pmiRate: 0.005, // 0.5% annual if down payment < 20%
};

export default function MortgageCalculator() {
  const { language } = useLanguage();

  const [homePrice, setHomePrice] = useState(hawaiiData.medianPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [includeHOA, setIncludeHOA] = useState(true);
  const [annualIncome, setAnnualIncome] = useState(150000);

  const calculations = useMemo(() => {
    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Monthly principal & interest
    const monthlyPI = loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Monthly property tax
    const monthlyPropertyTax = (homePrice * hawaiiData.propertyTaxRate) / 12;

    // Monthly insurance
    const monthlyInsurance = (homePrice * hawaiiData.insuranceRate) / 12;

    // PMI if down payment < 20%
    const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * hawaiiData.pmiRate) / 12 : 0;

    // HOA
    const monthlyHOA = includeHOA ? hawaiiData.hoaAverage : 0;

    const totalMonthly = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyPMI + monthlyHOA;

    // Total interest over life of loan
    const totalInterest = (monthlyPI * numberOfPayments) - loanAmount;

    // DTI (Debt-to-Income) ratio
    const monthlyIncome = annualIncome / 12;
    const dti = (totalMonthly / monthlyIncome) * 100;

    // Affordability check
    const maxAffordable = monthlyIncome * 0.28; // 28% housing ratio guideline

    return {
      downPayment,
      loanAmount,
      monthlyPI: isNaN(monthlyPI) ? 0 : monthlyPI,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyPMI,
      monthlyHOA,
      totalMonthly: isNaN(totalMonthly) ? 0 : totalMonthly,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
      dti: isNaN(dti) ? 0 : dti,
      maxAffordable,
      canAfford: totalMonthly <= maxAffordable,
    };
  }, [homePrice, downPaymentPercent, interestRate, loanTerm, includeHOA, annualIncome]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Link
              href="/cong-cu"
              className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-4 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'vi' ? 'Quay lại Công Cụ' : 'Back to Tools'}
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Home className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'vi' ? 'Tính Vay Mua Nhà Hawaii' : 'Hawaii Mortgage Calculator'}
                </h1>
                <p className="text-blue-100">
                  {language === 'vi'
                    ? 'Tính toán khoản vay và xem bạn có đủ điều kiện'
                    : 'Calculate your loan and check affordability'}
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
                  <Calculator className="w-5 h-5 text-blue-600" />
                  {language === 'vi' ? 'Thông Tin Vay' : 'Loan Details'}
                </h2>

                <div className="space-y-5">
                  {/* Home Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Giá nhà' : 'Home Price'}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={homePrice}
                        onChange={(e) => setHomePrice(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'vi' ? 'Giá trung bình Hawaii:' : 'Hawaii median:'} {formatCurrency(hawaiiData.medianPrice)}
                    </p>
                  </div>

                  {/* Down Payment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Tiền đặt cọc' : 'Down Payment'}: {downPaymentPercent}%
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="50"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>3%</span>
                      <span className="font-medium text-blue-600">{formatCurrency(calculations.downPayment)}</span>
                      <span>50%</span>
                    </div>
                    {downPaymentPercent < 20 && (
                      <p className="text-xs text-amber-600 mt-2">
                        ⚠️ {language === 'vi' ? 'Cần PMI nếu đặt cọc dưới 20%' : 'PMI required if down payment < 20%'}
                      </p>
                    )}
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Lãi suất' : 'Interest Rate'}: {interestRate}%
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="10"
                      step="0.125"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>3%</span>
                      <span>10%</span>
                    </div>
                  </div>

                  {/* Loan Term */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Thời hạn vay' : 'Loan Term'}
                    </label>
                    <div className="flex gap-2">
                      {[15, 20, 30].map((term) => (
                        <button
                          key={term}
                          onClick={() => setLoanTerm(term)}
                          className={`flex-1 py-2 rounded-lg font-medium transition ${
                            loanTerm === term
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {term} {language === 'vi' ? 'năm' : 'yrs'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* HOA */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {language === 'vi' ? 'Bao gồm HOA' : 'Include HOA'} ({formatCurrency(hawaiiData.hoaAverage)}/mo)
                    </label>
                    <button
                      onClick={() => setIncludeHOA(!includeHOA)}
                      className={`relative w-12 h-6 rounded-full transition ${
                        includeHOA ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                          includeHOA ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Annual Income */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Thu nhập hàng năm' : 'Annual Income'}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Summary Card */}
              <div className={`rounded-xl shadow-lg p-6 text-white ${
                calculations.canAfford
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  : 'bg-gradient-to-br from-red-500 to-rose-600'
              }`}>
                <h2 className="text-lg font-semibold mb-4">
                  {language === 'vi' ? 'Khoản Thanh Toán Hàng Tháng' : 'Monthly Payment'}
                </h2>
                <div className="text-4xl font-bold mb-2">
                  {formatCurrency(calculations.totalMonthly)}
                  <span className="text-lg font-normal opacity-80">/month</span>
                </div>

                <div className="pt-4 border-t border-white/20 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="opacity-80">
                      {language === 'vi' ? 'Tỷ lệ nợ/thu nhập' : 'Debt-to-Income'}
                    </span>
                    <span className={`text-xl font-bold ${calculations.dti > 28 ? 'text-yellow-300' : ''}`}>
                      {calculations.dti.toFixed(1)}%
                    </span>
                  </div>
                  {calculations.canAfford ? (
                    <p className="text-sm opacity-80">
                      ✅ {language === 'vi'
                        ? 'Trong phạm vi khuyến nghị (dưới 28%)'
                        : 'Within recommended range (under 28%)'}
                    </p>
                  ) : (
                    <p className="text-sm text-yellow-200">
                      ⚠️ {language === 'vi'
                        ? 'Cao hơn mức khuyến nghị 28%. Cân nhắc nhà rẻ hơn hoặc đặt cọc nhiều hơn.'
                        : 'Above 28% guideline. Consider a cheaper home or higher down payment.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'vi' ? 'Chi Tiết Thanh Toán' : 'Payment Breakdown'}
                </h3>
                <div className="space-y-3">
                  <PaymentRow
                    label={language === 'vi' ? 'Gốc & Lãi' : 'Principal & Interest'}
                    amount={calculations.monthlyPI}
                    color="bg-blue-500"
                    total={calculations.totalMonthly}
                  />
                  <PaymentRow
                    label={language === 'vi' ? 'Thuế nhà đất' : 'Property Tax'}
                    amount={calculations.monthlyPropertyTax}
                    color="bg-purple-500"
                    total={calculations.totalMonthly}
                  />
                  <PaymentRow
                    label={language === 'vi' ? 'Bảo hiểm' : 'Insurance'}
                    amount={calculations.monthlyInsurance}
                    color="bg-green-500"
                    total={calculations.totalMonthly}
                  />
                  {calculations.monthlyPMI > 0 && (
                    <PaymentRow
                      label="PMI"
                      amount={calculations.monthlyPMI}
                      color="bg-amber-500"
                      total={calculations.totalMonthly}
                    />
                  )}
                  {calculations.monthlyHOA > 0 && (
                    <PaymentRow
                      label="HOA"
                      amount={calculations.monthlyHOA}
                      color="bg-red-500"
                      total={calculations.totalMonthly}
                    />
                  )}
                </div>
              </div>

              {/* Loan Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  {language === 'vi' ? 'Tóm Tắt Khoản Vay' : 'Loan Summary'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      {language === 'vi' ? 'Số tiền vay' : 'Loan Amount'}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(calculations.loanAmount)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      {language === 'vi' ? 'Tiền đặt cọc' : 'Down Payment'}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(calculations.downPayment)}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-600">
                      {language === 'vi' ? 'Tổng lãi phải trả' : 'Total Interest'}
                    </p>
                    <p className="text-xl font-bold text-red-700">
                      {formatCurrency(calculations.totalInterest)}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600">
                      {language === 'vi' ? 'Tổng thanh toán' : 'Total Payment'}
                    </p>
                    <p className="text-xl font-bold text-blue-700">
                      {formatCurrency(calculations.loanAmount + calculations.totalInterest)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hawaii Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900">
                      {language === 'vi' ? 'Lưu Ý Về Bất Động Sản Hawaii' : 'Hawaii Real Estate Notes'}
                    </h4>
                    <ul className="text-amber-800 mt-2 text-sm space-y-1">
                      <li>• {language === 'vi'
                        ? 'Thuế nhà đất Hawaii thấp nhất nước (0.28% cho chủ sở hữu)'
                        : 'Hawaii has the lowest property tax in the US (0.28% for owner-occupied)'}
                      </li>
                      <li>• {language === 'vi'
                        ? 'Phần lớn căn hộ có HOA cao ($400-$1000/tháng)'
                        : 'Most condos have high HOA fees ($400-$1000/month)'}
                      </li>
                      <li>• {language === 'vi'
                        ? 'Cân nhắc bảo hiểm bão và động đất riêng'
                        : 'Consider separate hurricane and earthquake insurance'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PaymentRow({
  label,
  amount,
  color,
  total
}: {
  label: string;
  amount: number;
  color: string;
  total: number;
}) {
  const percentage = (amount / total) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">${amount.toFixed(0)}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
