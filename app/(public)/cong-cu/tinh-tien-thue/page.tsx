'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, DollarSign, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const BUDGET_RULES = [
  { percent: 25, label: 'Conservative', labelVn: 'An toàn', desc: 'More savings, less stress' },
  { percent: 30, label: 'Standard', labelVn: 'Tiêu chuẩn', desc: 'Common guideline' },
  { percent: 35, label: 'Flexible', labelVn: 'Linh hoạt', desc: 'More housing options' },
];

export default function RentCalculatorPage() {
  const { language } = useLanguage();
  const [income, setIncome] = useState<string>('');
  const [incomeType, setIncomeType] = useState<'monthly' | 'annual'>('monthly');
  const [selectedRule, setSelectedRule] = useState(30);

  const monthlyIncome = incomeType === 'annual'
    ? parseFloat(income || '0') / 12
    : parseFloat(income || '0');

  const maxRent = (monthlyIncome * selectedRule) / 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/cong-cu"
        className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {language === 'vn' ? 'Quay lại công cụ' : 'Back to tools'}
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 mb-4">
          <Home className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vn' ? 'Tính Tiền Thuê Nhà' : 'Rent Calculator'}
        </h1>
        <p className="text-gray-600">
          {language === 'vn'
            ? 'Tính số tiền thuê nhà phù hợp với thu nhập'
            : 'Calculate affordable rent based on your income'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Income Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'vn' ? 'Thu nhập của bạn' : 'Your Income'}
          </label>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setIncomeType('monthly')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                incomeType === 'monthly'
                  ? 'bg-teal-100 text-teal-700 border-2 border-teal-500'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent'
              }`}
            >
              {language === 'vn' ? 'Hàng tháng' : 'Monthly'}
            </button>
            <button
              onClick={() => setIncomeType('annual')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                incomeType === 'annual'
                  ? 'bg-teal-100 text-teal-700 border-2 border-teal-500'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent'
              }`}
            >
              {language === 'vn' ? 'Hàng năm' : 'Annual'}
            </button>
          </div>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-xl font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder={incomeType === 'monthly' ? '5,000' : '60,000'}
            />
          </div>
        </div>

        {/* Budget Rule Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {language === 'vn' ? 'Mức chi tiêu cho nhà ở' : 'Housing Budget Rule'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {BUDGET_RULES.map((rule) => (
              <button
                key={rule.percent}
                onClick={() => setSelectedRule(rule.percent)}
                className={`p-4 rounded-xl text-center transition-all ${
                  selectedRule === rule.percent
                    ? 'bg-teal-50 border-2 border-teal-500 shadow-sm'
                    : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                }`}
              >
                <span className="block text-2xl font-bold text-gray-900">
                  {rule.percent}%
                </span>
                <span className="block text-xs text-gray-600 mt-1">
                  {language === 'vn' ? rule.labelVn : rule.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
          <p className="text-sm font-medium text-gray-600 mb-2">
            {language === 'vn' ? 'Tiền thuê tối đa hàng tháng' : 'Maximum Monthly Rent'}
          </p>
          <p className="text-4xl font-bold text-gray-900">
            {formatCurrency(maxRent)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {language === 'vn'
              ? `${selectedRule}% của thu nhập ${formatCurrency(monthlyIncome)}/tháng`
              : `${selectedRule}% of ${formatCurrency(monthlyIncome)}/month income`}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/rao-vat/nha-o">
              {language === 'vn' ? 'Tìm nhà cho thuê' : 'Browse Rentals'}
            </Link>
          </Button>
        </div>
      </div>

      {/* Hawaii Cost Info */}
      <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {language === 'vn' ? 'Chi phí thuê nhà ở Hawaii' : 'Hawaii Rental Costs'}
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Studio/1BR: $1,500 - $2,200/month</li>
              <li>• 2BR apartment: $2,000 - $3,000/month</li>
              <li>• {language === 'vn' ? 'Khu vực rẻ hơn: Waipahu, Pearl City, Ewa Beach' : 'Affordable areas: Waipahu, Pearl City, Ewa Beach'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
