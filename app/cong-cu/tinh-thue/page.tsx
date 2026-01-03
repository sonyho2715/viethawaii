'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calculator, ArrowLeft, Info, DollarSign, PieChart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/i18n';

// 2024 Federal Tax Brackets (Single)
const federalBracketsSingle = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

// 2024 Federal Tax Brackets (Married Filing Jointly)
const federalBracketsMarried = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
];

// Hawaii State Tax Brackets (2024)
const hawaiiBracketsSingle = [
  { min: 0, max: 2400, rate: 0.014 },
  { min: 2400, max: 4800, rate: 0.032 },
  { min: 4800, max: 9600, rate: 0.055 },
  { min: 9600, max: 14400, rate: 0.064 },
  { min: 14400, max: 19200, rate: 0.068 },
  { min: 19200, max: 24000, rate: 0.072 },
  { min: 24000, max: 36000, rate: 0.076 },
  { min: 36000, max: 48000, rate: 0.079 },
  { min: 48000, max: 150000, rate: 0.0825 },
  { min: 150000, max: 175000, rate: 0.09 },
  { min: 175000, max: 200000, rate: 0.10 },
  { min: 200000, max: Infinity, rate: 0.11 },
];

const hawaiiBracketsMarried = [
  { min: 0, max: 4800, rate: 0.014 },
  { min: 4800, max: 9600, rate: 0.032 },
  { min: 9600, max: 19200, rate: 0.055 },
  { min: 19200, max: 28800, rate: 0.064 },
  { min: 28800, max: 38400, rate: 0.068 },
  { min: 38400, max: 48000, rate: 0.072 },
  { min: 48000, max: 72000, rate: 0.076 },
  { min: 72000, max: 96000, rate: 0.079 },
  { min: 96000, max: 300000, rate: 0.0825 },
  { min: 300000, max: 350000, rate: 0.09 },
  { min: 350000, max: 400000, rate: 0.10 },
  { min: 400000, max: Infinity, rate: 0.11 },
];

// Standard deductions
const standardDeductions = {
  single: 14600,
  married: 29200,
};

// FICA rates
const ficaRates = {
  socialSecurity: 0.062, // 6.2% up to $168,600
  socialSecurityCap: 168600,
  medicare: 0.0145, // 1.45%
  medicareAdditional: 0.009, // Additional 0.9% over $200k
};

function calculateTax(income: number, brackets: typeof federalBracketsSingle): number {
  let tax = 0;
  let remaining = income;

  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const taxableInBracket = Math.min(remaining, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
  }

  return tax;
}

export default function TaxCalculator() {
  const { language } = useLanguage();

  const [grossIncome, setGrossIncome] = useState(100000);
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [pretrax401k, setPretrax401k] = useState(0);
  const [healthInsurance, setHealthInsurance] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [useStandardDeduction, setUseStandardDeduction] = useState(true);
  const [itemizedDeductions, setItemizedDeductions] = useState(0);

  const calculations = useMemo(() => {
    // Pre-tax deductions reduce taxable income
    const pretaxDeductions = pretrax401k + healthInsurance;
    const adjustedGrossIncome = grossIncome - pretaxDeductions;

    // Deduction amount
    const deduction = useStandardDeduction
      ? standardDeductions[filingStatus]
      : itemizedDeductions + otherDeductions;

    // Taxable income for federal and state
    const federalTaxableIncome = Math.max(0, adjustedGrossIncome - deduction);
    const stateTaxableIncome = Math.max(0, adjustedGrossIncome - deduction);

    // Federal tax
    const federalBrackets = filingStatus === 'single' ? federalBracketsSingle : federalBracketsMarried;
    const federalTax = calculateTax(federalTaxableIncome, federalBrackets);

    // Hawaii state tax
    const hawaiiBrackets = filingStatus === 'single' ? hawaiiBracketsSingle : hawaiiBracketsMarried;
    const hawaiiTax = calculateTax(stateTaxableIncome, hawaiiBrackets);

    // FICA taxes (Social Security + Medicare)
    const socialSecurityTax = Math.min(grossIncome, ficaRates.socialSecurityCap) * ficaRates.socialSecurity;
    const medicareTax = grossIncome * ficaRates.medicare +
      (grossIncome > 200000 ? (grossIncome - 200000) * ficaRates.medicareAdditional : 0);
    const ficaTax = socialSecurityTax + medicareTax;

    // Total taxes
    const totalTax = federalTax + hawaiiTax + ficaTax;

    // Net income
    const netIncome = grossIncome - totalTax - pretaxDeductions;

    // Effective rates
    const effectiveFederalRate = (federalTax / grossIncome) * 100;
    const effectiveStateRate = (hawaiiTax / grossIncome) * 100;
    const effectiveTotalRate = (totalTax / grossIncome) * 100;

    // Marginal rates
    let marginalFederal = 0;
    for (const bracket of federalBrackets) {
      if (federalTaxableIncome <= bracket.max) {
        marginalFederal = bracket.rate * 100;
        break;
      }
    }

    let marginalState = 0;
    for (const bracket of hawaiiBrackets) {
      if (stateTaxableIncome <= bracket.max) {
        marginalState = bracket.rate * 100;
        break;
      }
    }

    return {
      adjustedGrossIncome,
      federalTaxableIncome,
      federalTax,
      hawaiiTax,
      ficaTax,
      socialSecurityTax,
      medicareTax,
      totalTax,
      netIncome,
      monthlyNet: netIncome / 12,
      effectiveFederalRate,
      effectiveStateRate,
      effectiveTotalRate,
      marginalFederal,
      marginalState,
      deduction,
    };
  }, [grossIncome, filingStatus, pretrax401k, healthInsurance, otherDeductions, useStandardDeduction, itemizedDeductions]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-r from-purple-500 to-violet-600 text-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Link
              href="/cong-cu"
              className="inline-flex items-center gap-2 text-purple-100 hover:text-white mb-4 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'vi' ? 'Quay lại Công Cụ' : 'Back to Tools'}
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Calculator className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'vi' ? 'Tính Thuế Thu Nhập Hawaii' : 'Hawaii Income Tax Calculator'}
                </h1>
                <p className="text-purple-100">
                  {language === 'vi'
                    ? 'Ước tính thuế liên bang và tiểu bang Hawaii'
                    : 'Estimate federal and Hawaii state taxes'}
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
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  {language === 'vi' ? 'Thu Nhập Của Bạn' : 'Your Income'}
                </h2>

                <div className="space-y-5">
                  {/* Gross Income */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Thu nhập gộp hàng năm' : 'Annual Gross Income'}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={grossIncome}
                        onChange={(e) => setGrossIncome(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Filing Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Tình trạng khai thuế' : 'Filing Status'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilingStatus('single')}
                        className={`flex-1 py-2 rounded-lg font-medium transition ${
                          filingStatus === 'single'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {language === 'vi' ? 'Độc thân' : 'Single'}
                      </button>
                      <button
                        onClick={() => setFilingStatus('married')}
                        className={`flex-1 py-2 rounded-lg font-medium transition ${
                          filingStatus === 'married'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {language === 'vi' ? 'Kết hôn' : 'Married'}
                      </button>
                    </div>
                  </div>

                  {/* 401k */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Đóng góp 401(k) hàng năm' : '401(k) Contribution'}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={pretrax401k}
                        onChange={(e) => setPretrax401k(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'vi' ? 'Giới hạn 2024: $23,000' : '2024 limit: $23,000'}
                    </p>
                  </div>

                  {/* Health Insurance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Bảo hiểm y tế (trước thuế)' : 'Health Insurance (pre-tax)'}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={healthInsurance}
                        onChange={(e) => setHealthInsurance(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Deductions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'vi' ? 'Loại khấu trừ' : 'Deduction Type'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUseStandardDeduction(true)}
                        className={`flex-1 py-2 rounded-lg font-medium transition text-sm ${
                          useStandardDeduction
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {language === 'vi' ? 'Tiêu chuẩn' : 'Standard'}
                        <span className="block text-xs opacity-80">
                          {formatCurrency(standardDeductions[filingStatus])}
                        </span>
                      </button>
                      <button
                        onClick={() => setUseStandardDeduction(false)}
                        className={`flex-1 py-2 rounded-lg font-medium transition text-sm ${
                          !useStandardDeduction
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {language === 'vi' ? 'Chi tiết' : 'Itemized'}
                      </button>
                    </div>
                    {!useStandardDeduction && (
                      <div className="mt-3">
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={itemizedDeductions}
                            onChange={(e) => setItemizedDeductions(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Itemized deductions"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Summary Card */}
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg p-6 text-white">
                <h2 className="text-lg font-semibold mb-4">
                  {language === 'vi' ? 'Thu Nhập Thực Nhận' : 'Take-Home Pay'}
                </h2>
                <div className="text-4xl font-bold mb-2">
                  {formatCurrency(calculations.netIncome)}
                  <span className="text-lg font-normal opacity-80">/year</span>
                </div>
                <p className="text-purple-100 text-lg">
                  {formatCurrency(calculations.monthlyNet)}/month
                </p>

                <div className="pt-4 border-t border-white/20 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="opacity-80">
                      {language === 'vi' ? 'Thuế suất thực tế' : 'Effective Tax Rate'}
                    </span>
                    <span className="text-xl font-bold">
                      {calculations.effectiveTotalRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Tax Breakdown */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-600" />
                  {language === 'vi' ? 'Chi Tiết Thuế' : 'Tax Breakdown'}
                </h3>

                <div className="space-y-4">
                  <TaxRow
                    label={language === 'vi' ? 'Thuế Liên Bang' : 'Federal Income Tax'}
                    amount={calculations.federalTax}
                    rate={calculations.effectiveFederalRate}
                    color="bg-blue-500"
                  />
                  <TaxRow
                    label={language === 'vi' ? 'Thuế Tiểu Bang Hawaii' : 'Hawaii State Tax'}
                    amount={calculations.hawaiiTax}
                    rate={calculations.effectiveStateRate}
                    color="bg-purple-500"
                  />
                  <TaxRow
                    label="Social Security (FICA)"
                    amount={calculations.socialSecurityTax}
                    rate={(calculations.socialSecurityTax / grossIncome) * 100}
                    color="bg-green-500"
                  />
                  <TaxRow
                    label="Medicare"
                    amount={calculations.medicareTax}
                    rate={(calculations.medicareTax / grossIncome) * 100}
                    color="bg-orange-500"
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      {language === 'vi' ? 'Tổng Thuế' : 'Total Taxes'}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-red-600">
                        {formatCurrency(calculations.totalTax)}
                      </span>
                      <span className="text-sm text-gray-500 block">
                        {calculations.effectiveTotalRate.toFixed(1)}% {language === 'vi' ? 'tổng thu nhập' : 'of income'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marginal Rates */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'vi' ? 'Thuế Suất Biên' : 'Marginal Tax Rates'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {language === 'vi'
                    ? 'Thuế suất cho đồng đô la tiếp theo bạn kiếm được:'
                    : 'Tax rate on your next dollar earned:'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-blue-600 mb-1">
                      {language === 'vi' ? 'Liên Bang' : 'Federal'}
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {calculations.marginalFederal}%
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-purple-600 mb-1">Hawaii</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {calculations.marginalState.toFixed(2)}%
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
                      {language === 'vi' ? 'Lưu Ý Về Thuế Hawaii' : 'Hawaii Tax Notes'}
                    </h4>
                    <ul className="text-amber-800 mt-2 text-sm space-y-1">
                      <li>• {language === 'vi'
                        ? 'Hawaii có 12 bậc thuế thu nhập, cao nhất 11%'
                        : 'Hawaii has 12 income tax brackets, up to 11%'}
                      </li>
                      <li>• {language === 'vi'
                        ? 'GET (General Excise Tax) 4.5% áp dụng cho mọi giao dịch, không phải thuế thu nhập'
                        : 'GET (General Excise Tax) of 4.5% applies to transactions, not income'}
                      </li>
                      <li>• {language === 'vi'
                        ? 'Không có thuế thành phố, chỉ có thuế tiểu bang'
                        : 'No city tax, only state tax'}
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

function TaxRow({
  label,
  amount,
  rate,
  color
}: {
  label: string;
  amount: number;
  rate: number;
  color: string;
}) {
  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amt);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-gray-700">{label}</span>
      </div>
      <div className="text-right">
        <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
        <span className="text-sm text-gray-500 ml-2">({rate.toFixed(1)}%)</span>
      </div>
    </div>
  );
}
