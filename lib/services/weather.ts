// Weather API service using Open-Meteo (free, no API key required)
// Docs: https://open-meteo.com/

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

// Hawaii weather codes mapping
const weatherCodes: Record<number, { description: string; icon: string }> = {
  0: { description: 'Trời Quang', icon: '☀️' },
  1: { description: 'Ít Mây', icon: '🌤️' },
  2: { description: 'Có Mây', icon: '⛅' },
  3: { description: 'Nhiều Mây', icon: '☁️' },
  45: { description: 'Sương Mù', icon: '🌫️' },
  48: { description: 'Sương Mù Đóng Băng', icon: '🌫️' },
  51: { description: 'Mưa Phùn Nhẹ', icon: '🌦️' },
  53: { description: 'Mưa Phùn', icon: '🌦️' },
  55: { description: 'Mưa Phùn Dày', icon: '🌧️' },
  61: { description: 'Mưa Nhẹ', icon: '🌧️' },
  63: { description: 'Mưa Vừa', icon: '🌧️' },
  65: { description: 'Mưa Lớn', icon: '🌧️' },
  80: { description: 'Mưa Rào', icon: '🌦️' },
  81: { description: 'Mưa Rào Vừa', icon: '🌧️' },
  82: { description: 'Mưa Rào Lớn', icon: '⛈️' },
  95: { description: 'Dông', icon: '⛈️' },
};

// Honolulu coordinates
const HONOLULU = {
  lat: 21.3069,
  lng: -157.8583,
  name: 'Honolulu, HI',
};

// Cache weather data for 30 minutes
let cachedWeather: { data: WeatherData; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function getHawaiiWeather(): Promise<WeatherData> {
  // Check cache first
  if (cachedWeather && Date.now() - cachedWeather.timestamp < CACHE_DURATION) {
    return cachedWeather.data;
  }

  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.append('latitude', HONOLULU.lat.toString());
    url.searchParams.append('longitude', HONOLULU.lng.toString());
    url.searchParams.append('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m');
    url.searchParams.append('temperature_unit', 'fahrenheit');
    url.searchParams.append('wind_speed_unit', 'mph');
    url.searchParams.append('timezone', 'Pacific/Honolulu');

    const response = await fetch(url.toString(), {
      next: { revalidate: 1800 }, // Cache for 30 minutes in Next.js
    });

    if (!response.ok) {
      throw new Error('Weather API failed');
    }

    const data = await response.json();
    const current = data.current;
    const weatherCode = current.weather_code;
    const weatherInfo = weatherCodes[weatherCode] || { description: 'Không Xác Định', icon: '🌡️' };

    const weatherData: WeatherData = {
      temperature: Math.round(current.temperature_2m),
      description: weatherInfo.description,
      icon: weatherInfo.icon,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      location: HONOLULU.name,
    };

    // Cache the result
    cachedWeather = { data: weatherData, timestamp: Date.now() };

    return weatherData;
  } catch (error) {
    console.error('Weather fetch error:', error);
    // Return fallback data
    return {
      temperature: 78,
      description: 'Ít Mây',
      icon: '🌤️',
      humidity: 65,
      windSpeed: 12,
      location: HONOLULU.name,
    };
  }
}
