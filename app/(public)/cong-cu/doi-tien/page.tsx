'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';

export default function CurrencyConverterPage() {
  const { language } = useLanguage();
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<'USD' | 'VND'>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(25000);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(EXCHANGE_RATE_API);
      const data = await res.json();
      if (data.rates?.VND) {
        setExchangeRate(data.rates.VND);
        setLastUpdated(new Date().toLocaleString('vi-VN'));
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertedAmount = fromCurrency === 'USD'
    ? parseFloat(amount || '0') * exchangeRate
    : parseFloat(amount || '0') / exchangeRate;

  const formatNumber = (num: number, currency: 'USD' | 'VND') => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' ₫';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const quickAmounts = fromCurrency === 'USD'
    ? [50, 100, 500, 1000, 5000]
    : [1000000, 5000000, 10000000, 25000000, 50000000];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vn' ? 'Đổi Tiền USD ↔ VND' : 'Currency Converter'}
        </h1>
        <p className="text-gray-600">
          {language === 'vn'
            ? 'Quy đổi nhanh giữa đô la Mỹ và đồng Việt Nam'
            : 'Quick conversion between USD and Vietnamese Dong'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Exchange Rate Display */}
        <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm">
            <span className="text-gray-600">
              {language === 'vn' ? 'Tỷ giá:' : 'Rate:'}
            </span>
            <span className="ml-2 font-semibold text-gray-900">
              1 USD = {new Intl.NumberFormat('vi-VN').format(Math.round(exchangeRate))} VND
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchExchangeRate}
            disabled={isLoading}
            className="text-gray-600"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* From Currency */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {fromCurrency === 'USD' ? 'US Dollar (USD)' : 'Việt Nam Đồng (VND)'}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
              {fromCurrency === 'USD' ? '$' : '₫'}
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-2xl font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt.toString())}
              className="px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-teal-100 hover:text-teal-700 rounded-lg transition-colors"
            >
              {fromCurrency === 'USD'
                ? `$${amt.toLocaleString()}`
                : `${amt.toLocaleString()}₫`}
            </button>
          ))}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={() => setFromCurrency(fromCurrency === 'USD' ? 'VND' : 'USD')}
            className="rounded-full"
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            {language === 'vn' ? 'Đổi chiều' : 'Swap'}
          </Button>
        </div>

        {/* To Currency (Result) */}
        <div className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            {fromCurrency === 'USD' ? 'Việt Nam Đồng (VND)' : 'US Dollar (USD)'}
          </label>
          <p className="text-3xl font-bold text-gray-900">
            {formatNumber(convertedAmount, fromCurrency === 'USD' ? 'VND' : 'USD')}
          </p>
        </div>

        {lastUpdated && (
          <p className="text-xs text-gray-500 text-center mt-4">
            {language === 'vn' ? 'Cập nhật:' : 'Updated:'} {lastUpdated}
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-2">
          {language === 'vn' ? 'Lưu ý khi gửi tiền về Việt Nam' : 'Remittance Tips'}
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• {language === 'vn' ? 'Tỷ giá ngân hàng có thể khác tỷ giá thị trường' : 'Bank rates may differ from market rates'}</li>
          <li>• {language === 'vn' ? 'So sánh phí chuyển tiền giữa các dịch vụ' : 'Compare transfer fees between services'}</li>
          <li>• {language === 'vn' ? 'Western Union, Remitly, Wise có tỷ giá cạnh tranh' : 'Western Union, Remitly, Wise offer competitive rates'}</li>
        </ul>
      </div>
    </div>
  );
}
