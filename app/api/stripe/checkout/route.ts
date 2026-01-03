import { NextRequest, NextResponse } from 'next/server';
import { getStripe, STRIPE_PRODUCTS, ProductType } from '@/lib/stripe';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const checkoutSchema = z.object({
  productType: z.enum(['BUSINESS_PREMIUM', 'CLASSIFIED_BOOST', 'EVENT_SPONSOR', 'ORG_VERIFICATION']),
  targetId: z.string().optional(), // businessId, classifiedId, eventId, or organizationId
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập để tiếp tục' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = checkoutSchema.parse(body);

    const product = STRIPE_PRODUCTS[validated.productType as ProductType];
    if (!product.priceId) {
      return NextResponse.json(
        { success: false, error: 'Sản phẩm chưa được cấu hình' },
        { status: 400 }
      );
    }

    // Get user info
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Người dùng không tồn tại' },
        { status: 404 }
      );
    }

    // Determine mode based on product type
    const isSubscription = validated.productType === 'BUSINESS_PREMIUM';

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://viethawaii.com';
    const successUrl = validated.successUrl || `${baseUrl}/thanh-toan/thanh-cong?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = validated.cancelUrl || `${baseUrl}/thanh-toan/huy`;

    // Create Stripe checkout session
    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      customer_email: user.email,
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: session.userId,
        productType: validated.productType,
        targetId: validated.targetId || '',
        productName: product.name,
      },
      locale: 'vi',
      payment_method_types: ['card'],
      ...(isSubscription && {
        subscription_data: {
          metadata: {
            userId: session.userId,
            productType: validated.productType,
            targetId: validated.targetId || '',
          },
        },
      }),
    });

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tạo phiên thanh toán' },
      { status: 500 }
    );
  }
}
