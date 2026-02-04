import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // You can remove this option if you're not planning to use the Session Replay feature
  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Don't send errors in development unless explicitly enabled
  enabled: process.env.NODE_ENV === 'production' || process.env.SENTRY_ENABLED === 'true',

  // Filter out known non-critical errors
  beforeSend(event) {
    // Don't send network errors that are expected
    if (event.exception?.values?.[0]?.value?.includes('NetworkError')) {
      return null;
    }
    return event;
  },

  // Set environment
  environment: process.env.NODE_ENV,
});
