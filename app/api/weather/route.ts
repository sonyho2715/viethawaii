import { NextResponse } from 'next/server';

// Honolulu coordinates
const HONOLULU_LAT = 21.3069;
const HONOLULU_LON = -157.8583;

export async function GET() {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${HONOLULU_LAT}&longitude=${HONOLULU_LON}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=Pacific%2FHonolulu`,
      { next: { revalidate: 600 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Weather API unavailable' },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data.current) {
      return NextResponse.json(
        { success: false, error: 'No weather data available' },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        temp: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
      },
    });

    response.headers.set(
      'Cache-Control',
      'public, s-maxage=600, stale-while-revalidate=300'
    );

    return response;
  } catch (error) {
    console.error('Weather proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather' },
      { status: 500 }
    );
  }
}
