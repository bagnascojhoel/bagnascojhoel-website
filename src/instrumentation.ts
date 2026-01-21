export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side initialization
    const Sentry = await import('@sentry/nextjs');

    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      integrations: [
        // Add any server-side specific integrations here
        Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
      ],
      enableLogs: true,

      // Performance Monitoring
      tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE
        ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE)
        : 0.1, // Capture 10% of transactions by default

      // Environment and release info
      environment: process.env.NODE_ENV,
      release: process.env.SENTRY_RELEASE,

      debug: process.env.NODE_ENV === 'development',

      // Only enable in production
      enabled: process.env.NODE_ENV === 'production',

      beforeSend(event, hint) {
        // Don't send events in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Sentry Server Event (not sent):', event);
          console.log('Sentry Server Hint (not sent):', hint);
          return null;
        }
        return event;
      },
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime initialization
    const Sentry = await import('@sentry/nextjs');

    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      // Performance Monitoring
      tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE
        ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE)
        : 0.1, // Capture 10% of transactions by default

      // Environment and release info
      environment: process.env.NODE_ENV,
      release: process.env.SENTRY_RELEASE,

      debug: process.env.NODE_ENV === 'development',

      // Only enable in production
      enabled: process.env.NODE_ENV === 'production',

      beforeSend(event, hint) {
        // Don't send events in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Sentry Edge Event (not sent):', event);
          console.log('Sentry Edge Hint (not sent):', hint);
          return null;
        }
        return event;
      },
    });
  }
}
