import { NextRequest, NextResponse } from 'next/server';
import { getStripe, STRIPE_PRODUCTS } from '@/lib/stripe';
import { db } from '@/lib/db';
import Stripe from 'stripe';

// Disable body parsing, need raw body for webhook signature verification
export const dynamic = 'force-dynamic';

// Helper to safely extract subscription period dates
function getSubscriptionDates(subscription: Stripe.Subscription) {
  // Handle both camelCase (newer API) and snake_case (older API) property names
  const sub = subscription as unknown as Record<string, unknown>;
  const currentPeriodStart = sub.currentPeriodStart || sub.current_period_start;
  const currentPeriodEnd = sub.currentPeriodEnd || sub.current_period_end;
  const cancelAtPeriodEnd = sub.cancelAtPeriodEnd ?? sub.cancel_at_period_end ?? false;

  return {
    currentPeriodStart: new Date((currentPeriodStart as number) * 1000),
    currentPeriodEnd: new Date((currentPeriodEnd as number) * 1000),
    cancelAtPeriodEnd: cancelAtPeriodEnd as boolean,
  };
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, productType, targetId, productName } = session.metadata || {};

  if (!userId || !productType) {
    console.error('Missing metadata in checkout session');
    return;
  }

  // Create payment record
  await db.payment.create({
    data: {
      userId,
      stripePaymentId: (session.payment_intent as string) || session.id,
      stripeCustomerId: session.customer as string,
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      status: 'succeeded',
      productType,
      productName: productName || productType,
      metadata: session.metadata || undefined,
      businessId: productType === 'BUSINESS_PREMIUM' ? targetId : null,
      classifiedId: productType === 'CLASSIFIED_BOOST' ? targetId : null,
      eventId: productType === 'EVENT_SPONSOR' ? targetId : null,
      organizationId: productType === 'ORG_VERIFICATION' ? targetId : null,
    },
  });

  // Handle one-time purchases
  if (productType === 'CLASSIFIED_BOOST' && targetId) {
    const boostDays = STRIPE_PRODUCTS.CLASSIFIED_BOOST.duration;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + boostDays);

    await db.boostPurchase.create({
      data: {
        userId,
        productType,
        classifiedId: targetId,
        endDate,
        active: true,
      },
    });

    // Update classified to be featured
    await db.classifiedListing.update({
      where: { id: targetId },
      data: { featured: true },
    });
  }

  if (productType === 'EVENT_SPONSOR' && targetId) {
    const boostDays = STRIPE_PRODUCTS.EVENT_SPONSOR.duration;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + boostDays);

    await db.boostPurchase.create({
      data: {
        userId,
        productType,
        eventId: targetId,
        endDate,
        active: true,
      },
    });

    // Update event to be featured
    await db.communityEvent.update({
      where: { id: targetId },
      data: { featured: true },
    });
  }

  if (productType === 'ORG_VERIFICATION' && targetId) {
    // Mark organization as verified
    await db.communityOrganization.update({
      where: { id: targetId },
      data: { verified: true },
    });

    await db.boostPurchase.create({
      data: {
        userId,
        productType,
        organizationId: targetId,
        endDate: new Date('2099-12-31'), // Lifetime
        active: true,
      },
    });
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const { userId, productType, targetId } = subscription.metadata || {};

  if (!userId || !productType) {
    console.error('Missing metadata in subscription');
    return;
  }

  const dates = getSubscriptionDates(subscription);

  await db.subscription.create({
    data: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0]?.price.id || '',
      status: subscription.status,
      productType,
      currentPeriodStart: dates.currentPeriodStart,
      currentPeriodEnd: dates.currentPeriodEnd,
      cancelAtPeriodEnd: dates.cancelAtPeriodEnd,
      businessId: targetId || null,
    },
  });

  // If business premium, update business
  if (productType === 'BUSINESS_PREMIUM' && targetId) {
    await db.business.update({
      where: { id: targetId },
      data: { featured: true },
    });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const existingSub = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!existingSub) {
    // Try to create if it doesn't exist
    await handleSubscriptionCreated(subscription);
    return;
  }

  const dates = getSubscriptionDates(subscription);

  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: dates.currentPeriodStart,
      currentPeriodEnd: dates.currentPeriodEnd,
      cancelAtPeriodEnd: dates.cancelAtPeriodEnd,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const existingSub = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    include: { user: true },
  });

  if (!existingSub) return;

  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'canceled' },
  });

  // Remove premium status from business
  if (existingSub.businessId) {
    await db.business.update({
      where: { id: existingSub.businessId },
      data: { featured: false },
    });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
