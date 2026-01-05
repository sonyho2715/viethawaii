'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Receipt, Users, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const TIP_PERCENTAGES = [15, 18, 20, 25];

export default function TipCalculatorPage() {
  const { language } = useLanguage();
  const [billAmount, setBillAmount] = useState<string>('50');
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [splitCount, setSplitCount] = useState<number>(1);
  const [customTip, setCustomTip] = useState<string>('');

  const bill = parseFloat(billAmount || '0');
  const effectiveTip = customTip ? parseFloat(customTip) : tipPercent;
  const tipAmount = (bill * effectiveTip) / 100;
  const total = bill + tipAmount;
  const perPerson = total / splitCount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const tipGuide = [
    {
      serviceVn: 'Nhà hàng (ngồi ăn)',
      serviceEn: 'Restaurant (sit-down)',
      tipVn: '18-20%',
      tipEn: '18-20%',
    },
    {
      serviceVn: 'Quán bar',
      serviceEn: 'Bar/Drinks',
      tipVn: '$1-2/ly hoặc 15-20%',
      tipEn: '$1-2/drink or 15-20%',
    },
    {
      serviceVn: 'Giao hàng',
      serviceEn: 'Delivery',
      tipVn: '15-20% hoặc $3-5',
      tipEn: '15-20% or $3-5',
    },
    {
      serviceVn: 'Cắt tóc',
      serviceEn: 'Haircut',
      tipVn: '15-20%',
      tipEn: '15-20%',
    },
    {
      serviceVn: 'Taxi/Uber',
      serviceEn: 'Taxi/Uber',
      tipVn: '15-20%',
      tipEn: '15-20%',
    },
    {
      serviceVn: 'Spa/Massage',
      serviceEn: 'Spa/Massage',
      tipVn: '18-20%',
      tipEn: '18-20%',
    },
  ];

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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 mb-4">
          <Receipt className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vn' ? 'Tính Tiền Tip' : 'Tip Calculator'}
        </h1>
        <p className="text-gray-600">
          {language === 'vn'
            ? 'Tính tip và chia bill khi đi ăn'
            : 'Calculate tips and split bills'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Bill Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'vn' ? 'Tổng bill' : 'Bill Amount'}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">$</span>
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-4 text-2xl font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="50.00"
            />
          </div>
        </div>

        {/* Tip Percentage */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {language === 'vn' ? 'Mức tip' : 'Tip Percentage'}
          </label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {TIP_PERCENTAGES.map((pct) => (
              <button
                key={pct}
                onClick={() => {
                  setTipPercent(pct);
                  setCustomTip('');
                }}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  tipPercent === pct && !customTip
                    ? 'bg-pink-100 text-pink-700 border-2 border-pink-500'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {language === 'vn' ? 'Hoặc nhập:' : 'Or enter:'}
            </span>
            <div className="relative flex-1">
              <input
                type="number"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder={language === 'vn' ? 'Tip tùy chọn %' : 'Custom %'}
              />
            </div>
          </div>
        </div>

        {/* Split Bill */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {language === 'vn' ? 'Chia bill' : 'Split Between'}
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
            >
              -
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-xl font-semibold text-gray-900 w-8 text-center">
                {splitCount}
              </span>
              <span className="text-gray-500">
                {language === 'vn' ? 'người' : splitCount === 1 ? 'person' : 'people'}
              </span>
            </div>
            <button
              onClick={() => setSplitCount(splitCount + 1)}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">{language === 'vn' ? 'Bill gốc' : 'Subtotal'}</span>
            <span className="font-medium">{formatCurrency(bill)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">
              Tip ({effectiveTip}%)
            </span>
            <span className="font-medium text-pink-600">+{formatCurrency(tipAmount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="text-gray-900 font-semibold">{language === 'vn' ? 'Tổng cộng' : 'Total'}</span>
            <span className="font-bold text-lg">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Per Person */}
        {splitCount > 1 && (
          <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {language === 'vn' ? 'Mỗi người trả' : 'Per Person'}
            </p>
            <p className="text-4xl font-bold text-gray-900">
              {formatCurrency(perPerson)}
            </p>
          </div>
        )}
      </div>

      {/* Tipping Guide */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-teal-600" />
          {language === 'vn' ? 'Hướng dẫn tip ở Mỹ' : 'US Tipping Guide'}
        </h2>
        <div className="space-y-3">
          {tipGuide.map((item, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-600">
                {language === 'vn' ? item.serviceVn : item.serviceEn}
              </span>
              <span className="font-medium text-gray-900">
                {language === 'vn' ? item.tipVn : item.tipEn}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          {language === 'vn'
            ? '* Tip là văn hóa bắt buộc ở Mỹ. Nhân viên phục vụ phụ thuộc vào tip như thu nhập chính.'
            : '* Tipping is customary in the US. Service workers rely on tips as a major part of their income.'}
        </p>
      </div>
    </div>
  );
}
