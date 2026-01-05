'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Calculator } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// 2024 Tax brackets (simplified)
const FEDERAL_TAX_BRACKETS = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: Infinity, rate: 0.32 },
];

// Hawaii state tax brackets (2024, single)
const HAWAII_TAX_BRACKETS = [
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

const SOCIAL_SECURITY_RATE = 0.062;
const SOCIAL_SECURITY_WAGE_CAP = 168600;
const MEDICARE_RATE = 0.0145;

function calculateBracketTax(income: number, brackets: typeof FEDERAL_TAX_BRACKETS) {
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

export default function PaycheckCalculatorPage() {
  const { language } = useLanguage();
  const [payType, setPayType] = useState<'hourly' | 'salary'>('hourly');
  const [hourlyRate, setHourlyRate] = useState<string>('20');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [annualSalary, setAnnualSalary] = useState<string>('50000');
  const [payFrequency, setPayFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('biweekly');

  // Calculate annual gross
  const annualGross = payType === 'hourly'
    ? parseFloat(hourlyRate || '0') * parseFloat(hoursPerWeek || '0') * 52
    : parseFloat(annualSalary || '0');

  // Calculate taxes
  const federalTax = calculateBracketTax(annualGross, FEDERAL_TAX_BRACKETS);
  const hawaiiTax = calculateBracketTax(annualGross, HAWAII_TAX_BRACKETS);
  const socialSecurity = Math.min(annualGross, SOCIAL_SECURITY_WAGE_CAP) * SOCIAL_SECURITY_RATE;
  const medicare = annualGross * MEDICARE_RATE;

  const totalTax = federalTax + hawaiiTax + socialSecurity + medicare;
  const annualNet = annualGross - totalTax;

  // Per paycheck amounts
  const periodsPerYear = payFrequency === 'weekly' ? 52 : payFrequency === 'biweekly' ? 26 : 12;
  const grossPerPeriod = annualGross / periodsPerYear;
  const netPerPeriod = annualNet / periodsPerYear;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const taxItems = [
    { label: language === 'vn' ? 'Thuế Liên Bang' : 'Federal Tax', amount: federalTax / periodsPerYear },
    { label: language === 'vn' ? 'Thuế Hawaii' : 'Hawaii State Tax', amount: hawaiiTax / periodsPerYear },
    { label: 'Social Security (6.2%)', amount: socialSecurity / periodsPerYear },
    { label: 'Medicare (1.45%)', amount: medicare / periodsPerYear },
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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 mb-4">
          <Briefcase className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vn' ? 'Tính Lương Thực Nhận' : 'Paycheck Calculator'}
        </h1>
        <p className="text-gray-600">
          {language === 'vn'
            ? 'Tính lương sau thuế tại Hawaii'
            : 'Calculate take-home pay in Hawaii'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Pay Type Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPayType('hourly')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              payType === 'hourly'
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent'
            }`}
          >
            {language === 'vn' ? 'Lương theo giờ' : 'Hourly'}
          </button>
          <button
            onClick={() => setPayType('salary')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              payType === 'salary'
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent'
            }`}
          >
            {language === 'vn' ? 'Lương năm' : 'Salary'}
          </button>
        </div>

        {/* Inputs */}
        {payType === 'hourly' ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vn' ? 'Lương/giờ ($)' : 'Hourly Rate ($)'}
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vn' ? 'Giờ/tuần' : 'Hours/Week'}
              </label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="40"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'vn' ? 'Lương năm ($)' : 'Annual Salary ($)'}
            </label>
            <input
              type="number"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="50000"
            />
          </div>
        )}

        {/* Pay Frequency */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'vn' ? 'Kỳ trả lương' : 'Pay Frequency'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'weekly', labelVn: 'Hàng tuần', labelEn: 'Weekly' },
              { value: 'biweekly', labelVn: '2 tuần/lần', labelEn: 'Bi-weekly' },
              { value: 'monthly', labelVn: 'Hàng tháng', labelEn: 'Monthly' },
            ].map((freq) => (
              <button
                key={freq.value}
                onClick={() => setPayFrequency(freq.value as typeof payFrequency)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  payFrequency === freq.value
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                }`}
              >
                {language === 'vn' ? freq.labelVn : freq.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">{language === 'vn' ? 'Lương gộp' : 'Gross Pay'}</span>
            <span className="font-semibold">{formatCurrency(grossPerPeriod)}</span>
          </div>
          {taxItems.map((item) => (
            <div key={item.label} className="flex justify-between py-1 text-sm">
              <span className="text-gray-500">- {item.label}</span>
              <span className="text-red-600">-{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>

        {/* Net Pay Result */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {language === 'vn' ? 'Lương thực nhận mỗi kỳ' : 'Take-Home Pay Per Period'}
          </p>
          <p className="text-4xl font-bold text-gray-900">
            {formatCurrency(netPerPeriod)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {language === 'vn' ? 'Lương năm thực nhận:' : 'Annual Take-Home:'} {formatCurrency(annualNet)}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        {language === 'vn'
          ? '* Ước tính. Không bao gồm các khoản khấu trừ khác như 401k, bảo hiểm.'
          : '* Estimate only. Does not include other deductions like 401k, insurance.'}
      </p>
    </div>
  );
}
