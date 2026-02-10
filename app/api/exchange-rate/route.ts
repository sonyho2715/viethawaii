import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Exchange rate API unavailable' },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data.rates?.VND) {
      return NextResponse.json(
        { success: false, error: 'VND rate not available' },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        rate: Math.round(data.rates.VND),
        lastUpdated: data.time_last_updated
          ? new Date(data.time_last_updated * 1000).toISOString()
          : new Date().toISOString(),
      },
    });

    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=1800'
    );

    return response;
  } catch (error) {
    console.error('Exchange rate proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exchange rate' },
      { status: 500 }
    );
  }
}
