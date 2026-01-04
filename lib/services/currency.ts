// Currency API service using ExchangeRate-API (free tier)
// Alternative: frankfurter.app (completely free, no key needed)

interface CurrencyData {
  usdToVnd: number;
  usdToVndFormatted: string;
  lastUpdated: string;
  change24h: number; // percentage change
}

// Cache currency data for 1 hour
let cachedCurrency: { data: CurrencyData; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Store previous rate to calculate change
let previousRate: number | null = null;

export async function getUsdToVnd(): Promise<CurrencyData> {
  // Check cache first
  if (cachedCurrency && Date.now() - cachedCurrency.timestamp < CACHE_DURATION) {
    return cachedCurrency.data;
  }

  try {
    // Using frankfurter.app - completely free, no API key needed
    const response = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=VND',
      {
        next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
      }
    );

    if (!response.ok) {
      throw new Error('Currency API failed');
    }

    const data = await response.json();
    const rate = data.rates.VND;

    // Calculate 24h change (approximate based on cached value)
    let change24h = 0;
    if (previousRate) {
      change24h = ((rate - previousRate) / previousRate) * 100;
    }
    previousRate = rate;

    const currencyData: CurrencyData = {
      usdToVnd: rate,
      usdToVndFormatted: formatVndRate(rate),
      lastUpdated: new Date().toLocaleString('vi-VN', {
        timeZone: 'Pacific/Honolulu',
        hour: '2-digit',
        minute: '2-digit',
      }),
      change24h: Math.round(change24h * 100) / 100,
    };

    // Cache the result
    cachedCurrency = { data: currencyData, timestamp: Date.now() };

    return currencyData;
  } catch (error) {
    console.error('Currency fetch error:', error);
    // Return fallback data (approximate current rate)
    return {
      usdToVnd: 25350,
      usdToVndFormatted: '25.350 ₫',
      lastUpdated: '--:--',
      change24h: 0,
    };
  }
}

function formatVndRate(rate: number): string {
  // Format: 25.350 ₫
  return rate.toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + ' ₫';
}

// Helper function to convert USD amount to VND
export function convertUsdToVnd(usdAmount: number, rate: number): string {
  const vnd = usdAmount * rate;
  return vnd.toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + ' ₫';
}

// Helper function to convert VND amount to USD
export function convertVndToUsd(vndAmount: number, rate: number): string {
  const usd = vndAmount / rate;
  return '$' + usd.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
