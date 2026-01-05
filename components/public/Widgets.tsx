'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Sun, Cloud, CloudRain, DollarSign, TrendingUp, Mail, Loader2 } from 'lucide-react';

const TRENDING_TOPICS = [
  { tag: '#TuyenNhanVien', labelVn: 'Tuyển nhân viên', labelEn: 'Hiring' },
  { tag: '#NhaChoThue', labelVn: 'Nhà cho thuê', labelEn: 'For Rent' },
  { tag: '#XeCu', labelVn: 'Xe cũ', labelEn: 'Used Cars' },
  { tag: '#ViecLam', labelVn: 'Việc làm', labelEn: 'Jobs' },
];

// Honolulu coordinates
const HONOLULU_LAT = 21.3069;
const HONOLULU_LON = -157.8583;

interface WeatherData {
  temp: number;
  weatherCode: number;
}

interface ExchangeData {
  rate: number;
}

export default function Widgets() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [exchangeRate, setExchangeRate] = useState<ExchangeData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingExchange, setLoadingExchange] = useState(true);

  // Fetch weather data from Open-Meteo (free, no API key)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${HONOLULU_LAT}&longitude=${HONOLULU_LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=Pacific%2FHonolulu`
        );
        const data = await res.json();
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
          });
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, []);

  // Fetch exchange rate from exchangerate-api (free tier)
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data.rates?.VND) {
          setExchangeRate({ rate: Math.round(data.rates.VND) });
        }
      } catch (error) {
        console.error('Exchange rate fetch error:', error);
      } finally {
        setLoadingExchange(false);
      }
    };
    fetchExchangeRate();
  }, []);

  // Get weather icon based on WMO weather code
  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun size={24} className="mb-1" />;
    if (code >= 2 && code <= 3) return <Cloud size={24} className="mb-1" />;
    if (code >= 51 && code <= 67) return <CloudRain size={24} className="mb-1" />;
    if (code >= 80 && code <= 82) return <CloudRain size={24} className="mb-1" />;
    return <Sun size={24} className="mb-1" />;
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Integrate with newsletter API
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Weather & Exchange Rate */}
      <div className="grid grid-cols-2 gap-3">
        {/* Weather Widget - Live from Open-Meteo */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-3 text-white shadow-sm">
          {loadingWeather ? (
            <Loader2 size={24} className="mb-1 animate-spin" />
          ) : weather ? (
            getWeatherIcon(weather.weatherCode)
          ) : (
            <Sun size={24} className="mb-1" />
          )}
          <div className="flex flex-col">
            <span className="text-2xl font-bold">
              {loadingWeather ? '...' : weather ? `${weather.temp}°F` : '82°F'}
            </span>
            <span className="text-xs opacity-90">Honolulu</span>
          </div>
        </div>

        {/* Exchange Rate Widget - Live from ExchangeRate API */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-3 text-white shadow-sm">
          <DollarSign size={24} className="mb-1" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">
              {loadingExchange ? '...' : exchangeRate ? `$1 = ${exchangeRate.rate.toLocaleString()}₫` : '$1 = 25,000₫'}
            </span>
            <span className="text-xs opacity-90">
              {language === 'vn' ? 'Tỷ giá' : 'Live Rate'}
            </span>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <TrendingUp size={16} className="mr-2 text-teal-600" />
          {language === 'vn' ? 'Chủ Đề Hot' : 'Trending Topics'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic.tag}
              onClick={() => {
                window.location.href = `/tim-kiem?q=${encodeURIComponent(topic.tag)}`;
              }}
              className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full hover:bg-teal-50 hover:text-teal-600 cursor-pointer transition-colors"
            >
              {topic.tag}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-xl shadow-md p-5 text-white">
        <h3 className="font-bold text-lg mb-2 flex items-center">
          <Mail size={20} className="mr-2" />
          {language === 'vn' ? 'Nhận bản tin' : 'Newsletter'}
        </h3>
        <p className="text-teal-100 text-sm mb-3">
          {language === 'vn'
            ? 'Đăng ký nhận thông tin mới nhất về việc làm và nhà ở.'
            : 'Subscribe for the latest jobs and housing updates.'}
        </p>
        <form onSubmit={handleSubscribe}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={language === 'vn' ? 'Nhập email của bạn' : 'Enter your email'}
            className="w-full px-3 py-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 mb-2"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-white text-teal-700 rounded-lg text-sm font-bold hover:bg-teal-50 transition-colors"
          >
            {subscribed
              ? (language === 'vn' ? 'Đã đăng ký!' : 'Subscribed!')
              : (language === 'vn' ? 'Đăng Ký' : 'Subscribe')}
          </button>
        </form>
      </div>
    </div>
  );
}
