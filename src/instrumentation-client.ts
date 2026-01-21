import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  integrations: [
    // Add any server-side specific integrations here
    Sentry.consoleLoggingIntegration({ levels: ['error'] }),
  ],
  enableLogs: true,

  // Performance Monitoring
  tracesSampleRate: process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE
    ? parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE)
    : 0.1, // Capture 10% of transactions by default

  // Session Replay
  replaysSessionSampleRate: process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE
    ? parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE)
    : 0.1, // Capture 10% of sessions by default

  replaysOnErrorSampleRate: process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE
    ? parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE)
    : 1.0, // Capture 100% of sessions with errors

  // Environment and release info
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing
  // Adjust this value in production
  debug: process.env.NODE_ENV === 'development',

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Filter out browser extension errors and other noise
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'chrome-extension',
    'moz-extension',
    // Random plugins/extensions
    "Can't find variable: ZiteReader",
    'jigsaw is not defined',
    'ComboSearch is not defined',
    // Facebook blocked
    'fb_xd_fragment',
    // Other
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
  ],

  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry Event (not sent):', event);
      console.log('Sentry Hint (not sent):', hint);
      return null;
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
