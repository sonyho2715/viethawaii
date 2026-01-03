import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }
  return stripeInstance;
}

// Backward compatibility - alias for existing code
export const stripe = {
  get checkout() { return getStripe().checkout; },
  get customers() { return getStripe().customers; },
  get subscriptions() { return getStripe().subscriptions; },
  get paymentIntents() { return getStripe().paymentIntents; },
  get webhooks() { return getStripe().webhooks; },
};

// Product/Price IDs for different offerings
export const STRIPE_PRODUCTS = {
  // Business Premium Listing (monthly subscription)
  BUSINESS_PREMIUM: {
    name: 'Doanh Nghiệp Cao Cấp',
    priceId: process.env.STRIPE_BUSINESS_PREMIUM_PRICE_ID || '',
    price: 29.99,
    interval: 'month',
  },
  // Featured Classified (one-time boost)
  CLASSIFIED_BOOST: {
    name: 'Tin Nổi Bật',
    priceId: process.env.STRIPE_CLASSIFIED_BOOST_PRICE_ID || '',
    price: 9.99,
    duration: 7, // days
  },
  // Sponsored Event (one-time)
  EVENT_SPONSOR: {
    name: 'Sự Kiện Tài Trợ',
    priceId: process.env.STRIPE_EVENT_SPONSOR_PRICE_ID || '',
    price: 19.99,
    duration: 30, // days
  },
  // Organization Verification (one-time)
  ORG_VERIFICATION: {
    name: 'Xác Thực Tổ Chức',
    priceId: process.env.STRIPE_ORG_VERIFICATION_PRICE_ID || '',
    price: 49.99,
    lifetime: true,
  },
} as const;

export type ProductType = keyof typeof STRIPE_PRODUCTS;
