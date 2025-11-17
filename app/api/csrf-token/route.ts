import { NextResponse } from 'next/server';
import { getCsrfToken } from '@/lib/csrf';

/**
 * GET /api/csrf-token
 * Returns a CSRF token for the current session
 */
export async function GET() {
  try {
    const token = await getCsrfToken();

    return NextResponse.json({
      success: true,
      csrfToken: token
    });
  } catch (error) {
    console.error('CSRF token error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate CSRF token'
      },
      { status: 500 }
    );
  }
}
