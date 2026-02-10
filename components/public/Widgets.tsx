'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Sun, Cloud, CloudRain, CloudSnow, DollarSign, TrendingUp, Mail, Loader2, Clock, Droplets, Wind, CheckCircle, Shield } from 'lucide-react';
import Link from 'next/link';

const TRENDING_TOPICS = [
  { tag: '#TuyenNhanVien', labelVn: 'Tuyển nhân viên', labelEn: 'Hiring' },
  { tag: '#NhaChoThue', labelVn: 'Nhà cho thuê', labelEn: 'For Rent' },
  { tag: '#XeCu', labelVn: 'Xe cũ', labelEn: 'Used Cars' },
  { tag: '#ViecLam', labelVn: 'Việc làm', labelEn: 'Jobs' },
];

interface WeatherData {
  temp: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
}

interface ExchangeData {
  rate: number;
  lastUpdated: string;
}

interface TimeData {
  hawaii: Date;
  vietnam: Date;
}

export default function Widgets() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [exchangeRate, setExchangeRate] = useState<ExchangeData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingExchange, setLoadingExchange] = useState(true);
  const [times, setTimes] = useState<TimeData | null>(null);
  const [weatherFetchedAt, setWeatherFetchedAt] = useState<Date | null>(null);

  // Fetch weather from local API proxy
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather');
        const data = await res.json();
        if (data.success && data.data) {
          setWeather(data.data);
          setWeatherFetchedAt(new Date());
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, []);

  // Fetch exchange rate from local API proxy
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const res = await fetch('/api/exchange-rate');
        const data = await res.json();
        if (data.success && data.data) {
          setExchangeRate(data.data);
        }
      } catch (error) {
        console.error('Exchange rate fetch error:', error);
      } finally {
        setLoadingExchange(false);
      }
    };
    fetchExchangeRate();
  }, []);

  // Update time every second
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const hawaiiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));
      const vietnamTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
      setTimes({ hawaii: hawaiiTime, vietnam: vietnamTime });
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDateEn = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateVn = (date: Date) => {
    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const weekday = weekdays[date.getDay()];
    return `${weekday}, ${day}/${month}`;
  };

  // Get "X min ago" for weather freshness
  const getWeatherAge = () => {
    if (!weatherFetchedAt) return '';
    const diffMs = Date.now() - weatherFetchedAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return language === 'vn' ? 'Vừa cập nhật' : 'Just now';
    return language === 'vn' ? `${diffMins} phút trước` : `${diffMins}m ago`;
  };

  // Get weather description text
  const getWeatherDesc = (code: number) => {
    if (code === 0) return language === 'vn' ? 'Trời nắng' : 'Clear sky';
    if (code === 1) return language === 'vn' ? 'Ít mây' : 'Mostly clear';
    if (code === 2) return language === 'vn' ? 'Có mây' : 'Partly cloudy';
    if (code === 3) return language === 'vn' ? 'Nhiều mây' : 'Overcast';
    if (code >= 51 && code <= 55) return language === 'vn' ? 'Mưa phùn' : 'Drizzle';
    if (code >= 61 && code <= 67) return language === 'vn' ? 'Mưa' : 'Rain';
    if (code >= 80 && code <= 82) return language === 'vn' ? 'Mưa rào' : 'Showers';
    return language === 'vn' ? 'Nắng đẹp' : 'Fair';
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun size={28} className="text-yellow-300" />;
    if (code >= 2 && code <= 3) return <Cloud size={28} className="text-white/80" />;
    if (code >= 51 && code <= 67) return <CloudRain size={28} className="text-blue-200" />;
    if (code >= 80 && code <= 82) return <CloudRain size={28} className="text-blue-200" />;
    if (code >= 71 && code <= 77) return <CloudSnow size={28} className="text-white" />;
    return <Sun size={28} className="text-yellow-300" />;
  };

  // Call-time indicator for timezone widget
  const getCallIndicator = (hawaiiDate: Date) => {
    const hour = hawaiiDate.getHours();
    if (hour >= 8 && hour < 18) {
      return { text: language === 'vn' ? 'Giờ tốt để gọi' : 'Good time to call', color: 'text-emerald-400' };
    }
    if (hour >= 18 && hour < 22) {
      return { text: language === 'vn' ? 'Giờ tối' : 'Evening', color: 'text-amber-400' };
    }
    return { text: language === 'vn' ? 'Đang ngủ' : 'Sleeping hours', color: 'text-red-400' };
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      } else {
        setError(data.error || 'Đã xảy ra lỗi');
      }
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Weather Widget */}
      <div className="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Honolulu, HI</p>
              {loadingWeather ? (
                <div className="flex items-center gap-2 mt-1">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-sm text-white/70">Loading...</span>
                </div>
              ) : weather ? (
                <div className="mt-1">
                  <span className="text-4xl font-bold tracking-tight">{weather.temp}°F</span>
                  <p className="text-sm text-white/80 mt-0.5">{getWeatherDesc(weather.weatherCode)}</p>
                </div>
              ) : (
                <span className="text-4xl font-bold">--°F</span>
              )}
            </div>
            <div className="mt-1">
              {loadingWeather ? (
                <Loader2 size={28} className="animate-spin text-white/50" />
              ) : weather ? (
                getWeatherIcon(weather.weatherCode)
              ) : (
                <Sun size={28} className="text-yellow-300" />
              )}
            </div>
          </div>
          {weather && (
            <div className="flex items-center gap-4 text-xs text-white/70 border-t border-white/10 pt-2">
              <span className="flex items-center gap-1">
                <Droplets size={12} />
                {weather.humidity}%
              </span>
              <span className="flex items-center gap-1">
                <Wind size={12} />
                {weather.windSpeed} mph
              </span>
              {weatherFetchedAt && (
                <span className="ml-auto">{getWeatherAge()}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Exchange Rate Widget */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-4 translate-x-4" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider">USD / VND</p>
            </div>
          </div>
          {loadingExchange ? (
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm text-white/70">Loading...</span>
            </div>
          ) : exchangeRate ? (
            <div>
              <p className="text-xl font-bold">
                $1 = {exchangeRate.rate.toLocaleString()}₫
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-white/60">
                  1,000,000₫ = ${(1000000 / exchangeRate.rate).toFixed(2)}
                </p>
                <Link
                  href="/cong-cu/doi-tien"
                  className="text-xs text-white/80 underline underline-offset-2 hover:text-white"
                >
                  {language === 'vn' ? 'Đổi tiền' : 'Convert'}
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-xl font-bold">$1 = 25,000₫</p>
          )}
        </div>
      </div>

      {/* Time Zone Widget */}
      <Link href="/cong-cu/gio-viet-nam" className="block">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-sm">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">
                {language === 'vn' ? 'Giờ Việt Nam' : 'Vietnam Time'}
              </h3>
              {times && (
                <p className={`text-xs ${getCallIndicator(times.hawaii).color}`}>
                  {getCallIndicator(times.hawaii).text}
                </p>
              )}
            </div>
          </div>

          {times && (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-lg">🌺</span>
                  <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">Hawaii</span>
                </div>
                <div className="text-lg font-bold text-gray-900">{formatTime(times.hawaii)}</div>
                <div className="text-[10px] text-gray-500">{formatDateEn(times.hawaii)}</div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-3 border border-red-100/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-lg">🇻🇳</span>
                  <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">Việt Nam</span>
                </div>
                <div className="text-lg font-bold text-gray-900">{formatTime(times.vietnam)}</div>
                <div className="text-[10px] text-gray-500">{formatDateVn(times.vietnam)}</div>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Trending Topics */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center text-sm">
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
              className="bg-gray-50 text-gray-600 text-xs px-3 py-1.5 rounded-full hover:bg-teal-50 hover:text-teal-600 cursor-pointer transition-all hover:shadow-sm border border-transparent hover:border-teal-100"
            >
              {topic.tag}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 rounded-2xl shadow-lg p-5 text-white relative overflow-hidden">
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 rounded-full" />
        <div className="relative">
          <h3 className="font-bold text-lg mb-1 flex items-center">
            <Mail size={20} className="mr-2" />
            {language === 'vn' ? 'Nhận bản tin' : 'Newsletter'}
          </h3>
          <p className="text-teal-100 text-sm mb-3">
            {language === 'vn'
              ? 'Đăng ký nhận thông tin mới nhất về việc làm và nhà ở.'
              : 'Subscribe for the latest jobs and housing updates.'}
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2 py-3 text-emerald-200 animate-scale-in">
              <CheckCircle size={20} />
              <span className="font-medium">
                {language === 'vn' ? 'Đã đăng ký thành công!' : 'Successfully subscribed!'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'vn' ? 'Nhập email của bạn' : 'Enter your email'}
                className="w-full px-4 py-2.5 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 mb-2 text-sm"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-white text-teal-700 rounded-xl text-sm font-bold hover:bg-teal-50 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin mx-auto" />
                ) : (
                  language === 'vn' ? 'Đăng Ký' : 'Subscribe'
                )}
              </button>
            </form>
          )}
          <p className="text-[10px] text-white/40 mt-2 flex items-center gap-1">
            <Shield size={10} />
            {language === 'vn' ? 'Không spam. Hủy bất cứ lúc nào.' : 'No spam. Unsubscribe anytime.'}
          </p>
        </div>
      </div>
    </div>
  );
}
