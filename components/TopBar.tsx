import { getHawaiiWeather } from '@/lib/services/weather';
import { getUsdToVnd } from '@/lib/services/currency';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';

export default async function TopBar() {
  // Fetch data server-side with caching
  const [weather, currency] = await Promise.all([
    getHawaiiWeather(),
    getUsdToVnd(),
  ]);

  // Get current Hawaii time
  const hawaiiTime = new Date().toLocaleString('vi-VN', {
    timeZone: 'Pacific/Honolulu',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-10 text-sm">
          {/* Left: Time and Location */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 opacity-80" />
              <span className="font-medium">{hawaiiTime}</span>
            </div>
            <span className="opacity-50">|</span>
            <span className="opacity-90">Hawaii, USA</span>
          </div>

          {/* Center: Weather Widget */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
              <span className="text-lg">{weather.icon}</span>
              <span className="font-bold">{weather.temperature}°F</span>
              <span className="opacity-80 hidden sm:inline">{weather.description}</span>
            </div>
          </div>

          {/* Right: Currency Exchange */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
              <span className="font-medium">$1 USD</span>
              <span className="opacity-60">=</span>
              <span className="font-bold text-success-300">{currency.usdToVndFormatted}</span>
              {currency.change24h !== 0 && (
                <span className={`flex items-center text-xs ${
                  currency.change24h > 0 ? 'text-success-300' : 'text-red-300'
                }`}>
                  {currency.change24h > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : currency.change24h < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
