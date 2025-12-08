import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, setUserSession } from '@/lib/auth';
import { loginSchema, validate } from '@/lib/validations';
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';

const loginRateLimit = rateLimit(rateLimitConfigs.auth);

export async function POST(request: NextRequest) {
  return loginRateLimit(request, async (req) => {
    try {
      const body = await req.json();

    // Validate input
    const validation = validate(loginSchema, body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors
      }, { status: 400 });
    }

    const { email, password } = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }

    // Create session
    await setUserSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

      return NextResponse.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        message: 'Login successful'
      });

    } catch (error) {
      console.error('Login error:', error);
      return NextResponse.json({
        success: false,
        error: 'An error occurred during login'
      }, { status: 500 });
    }
  });
}
