# Sentry Quick Start Guide

## ✅ What's Done

Sentry has been fully integrated with:

- Logger abstraction (no direct Sentry usage in domain code)
- Automatic environment-based configuration (dev uses console, prod uses Sentry)
- Error boundaries for client-side errors
- Error handling in middleware
- Comprehensive test coverage

## 🚀 Getting Started

### 1. Create a Sentry Account (if you don't have one)

Visit https://sentry.io and sign up for free.

### 2. Create a Project

1. Click "Create Project"
2. Select "Next.js" as the platform
3. Choose an alert frequency
4. Name your project (e.g., "portfolio-website")
5. Copy the DSN provided

### 3. Configure Environment Variables

Create or update your `.env.local` file:

```bash
# Required for Sentry to work
SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/123456
NEXT_PUBLIC_SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/123456

# Required for source map uploads (get from Sentry settings)
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token

# Optional: Performance monitoring (0.0 to 1.0)
SENTRY_TRACES_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1

# Optional: Session replay (0.0 to 1.0)
NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0
```

### 4. Get Your Auth Token

To upload source maps:

1. Go to Sentry → Settings → Account → Auth Tokens
2. Create new token with scopes: `project:releases`, `project:write`
3. Add to `.env.local` as `SENTRY_AUTH_TOKEN`

### 5. Test in Development

Start your dev server:

```bash
npm run dev
```

In development, errors are logged to console (not sent to Sentry). This is intentional.

### 6. Test in Production Mode

Build and start in production mode:

```bash
npm run build
npm start
```

Errors will now be sent to Sentry. To test, trigger an error in your app.

### 7. Deploy

When deploying to Vercel/production:

1. Add all environment variables to your deployment platform
2. Build will automatically upload source maps to Sentry
3. Errors will be captured with full stack traces

## 📊 Viewing Errors in Sentry

1. Go to your Sentry dashboard
2. Click on your project
3. View "Issues" tab to see captured errors
4. Each error includes:
   - Stack trace with source maps
   - User context (if set)
   - Breadcrumbs (actions leading to error)
   - Request context
   - Device/browser info

## 🎯 How It Works

### In Your Code

The logger is automatically injected via dependency injection:

```typescript
// In any service
@injectable()
export class MyService {
  constructor(@inject(LoggerToken) private logger: Logger) {}

  async doSomething() {
    try {
      this.logger.addBreadcrumb('Starting operation');
      // ... your code
    } catch (error) {
      this.logger.error(error as Error, { context: 'extra info' });
      throw error;
    }
  }
}
```

### Automatic Error Capture

- **Client errors**: Caught by React Error Boundaries
- **Server errors**: Caught in try-catch blocks
- **Middleware errors**: Caught in middleware wrapper
- **Service errors**: Logged via injected logger

## 🧪 Testing

Run tests to verify everything works:

```bash
npm test
```

All 83 tests should pass ✅

## 📚 Learn More

For detailed information, see:

- [.ai/sentry-integration.md](sentry-integration.md) - Complete integration guide
- [.ai/sentry-implementation-summary.md](sentry-implementation-summary.md) - What was implemented

## 🔧 Troubleshooting

### Errors not appearing in Sentry?

1. Check `NODE_ENV=production` (dev mode uses console)
2. Verify `SENTRY_DSN` is set correctly
3. Check Sentry project settings
4. Look at browser console for Sentry initialization messages

### Source maps not working?

1. Verify `SENTRY_AUTH_TOKEN` has correct permissions
2. Check `SENTRY_ORG` and `SENTRY_PROJECT` match your Sentry account
3. Look at build output for source map upload logs

### Too many errors?

Adjust sample rates in `.env.local`:

```bash
SENTRY_TRACES_SAMPLE_RATE=0.05  # 5% instead of 10%
```

## 💡 Best Practices

1. **Add user context** when a user logs in:

   ```typescript
   logger.setUser({ id: user.id, email: user.email });
   ```

2. **Add breadcrumbs** for important actions:

   ```typescript
   logger.addBreadcrumb('User clicked checkout button', { cartTotal: 99.99 });
   ```

3. **Use tags** for filtering:

   ```typescript
   logger.setTags({ feature: 'checkout', locale: 'pt-br' });
   ```

4. **Don't log sensitive data** - passwords, tokens, credit cards, etc.

## ✨ That's It!

You're all set! Sentry is now capturing errors with full context, breadcrumbs, and user information
while keeping your domain code clean and testable.
