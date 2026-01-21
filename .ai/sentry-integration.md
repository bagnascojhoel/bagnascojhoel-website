# Sentry Integration Documentation

This document describes the error logging and monitoring setup using Sentry in this Next.js
application.

## Architecture Overview

The project follows **Clean Architecture** principles with a clear separation between:

- **Domain Layer**: Business logic and interfaces (ports)
- **Infrastructure Layer**: External services and adapters
- **Application Layer**: Use cases and orchestration
- **Presentation Layer**: Next.js components and pages

### Logger Abstraction

To keep the domain layer framework-agnostic, we use the **Port-Adapter pattern**:

```
┌─────────────────────────────────────────────────┐
│         Domain Layer (Port)                     │
│  ┌─────────────────────────────────┐            │
│  │  Logger Interface (Port)        │            │
│  └─────────────────────────────────┘            │
└─────────────────────────────────────────────────┘
                     ↑
                     │ implements
                     │
┌────────────────────┴────────────────────────────┐
│    Infrastructure Layer (Adapters)              │
│  ┌─────────────────┐  ┌─────────────────┐      │
│  │  LoggerSentry   │  │  LoggerConsole  │      │
│  │  (Production)   │  │  (Dev/Test)     │      │
│  └─────────────────┘  └─────────────────┘      │
└─────────────────────────────────────────────────┘
```

## File Structure

```
src/core/
├── domain/
│   └── Logger.ts                    # Port (interface)
├── infrastructure/
│   ├── LoggerSentry.ts              # Sentry adapter
│   └── LoggerConsole.ts             # Console adapter (dev/test)
└── ContainerConfig.ts               # DI container configuration

src/app/
├── global-error.tsx                 # Root-level error boundary
└── [locale]/
    └── error.tsx                    # Route-level error boundary

src/middleware.ts                    # Edge middleware with error handling

sentry.client.config.ts              # Client-side Sentry config
sentry.server.config.ts              # Server-side Sentry config
sentry.edge.config.ts                # Edge runtime Sentry config

tests/fixtures/
└── mockLogger.ts                    # Mock logger for testing
```

## Logger Interface

### Methods

```typescript
interface Logger {
  // Log an error with optional context
  error(error: Error, context?: Record<string, unknown>): void;

  // Log a warning message
  warn(message: string, context?: Record<string, unknown>): void;

  // Log an informational message
  info(message: string, context?: Record<string, unknown>): void;

  // Capture and report an exception to error tracking
  captureException(error: Error, context?: Record<string, unknown>): void;

  // Set user context for error reports
  setUser(user: { id: string; email?: string; username?: string } | null): void;

  // Add tags for filtering errors
  setTags(tags: Record<string, string>): void;

  // Add breadcrumbs (action trail leading to error)
  addBreadcrumb(message: string, data?: Record<string, unknown>): void;
}
```

### Usage in Application Services

```typescript
import { inject, injectable } from 'inversify';
import { Logger, LoggerToken } from '@/core/domain/Logger';

@injectable()
export class MyApplicationService {
  constructor(@inject(LoggerToken) private logger: Logger) {}

  async doSomething() {
    try {
      this.logger.addBreadcrumb('Starting operation', { userId: '123' });
      // ... operation logic
    } catch (error) {
      this.logger.error(error instanceof Error ? error : new Error('Operation failed'), {
        operation: 'doSomething',
        userId: '123',
      });
      throw error;
    }
  }
}
```

## Configuration

### Environment Variables

Required for production:

```bash
# Sentry DSN (Data Source Name)
SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# For source map uploads
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token
```

Optional configuration:

```bash
# Performance monitoring (0.0 to 1.0)
SENTRY_TRACES_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1

# Session replay (0.0 to 1.0)
NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0

# Release version
SENTRY_RELEASE=v1.0.0
NEXT_PUBLIC_SENTRY_RELEASE=v1.0.0
```

### Dependency Injection

The logger is automatically bound in the DI container based on environment:

```typescript
// src/core/ContainerConfig.ts
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

container
  .bind<Logger>(LoggerToken)
  .to(isProduction && !isTest ? LoggerSentry : LoggerConsole)
  .inSingletonScope();
```

## Error Boundaries

### Client-Side Error Boundaries

#### Global Error (Root Level)

Located at `src/app/global-error.tsx` - catches errors at the application root level.

#### Route Error (Page Level)

Located at `src/app/[locale]/error.tsx` - catches errors within specific routes.

Both error boundaries automatically capture exceptions to Sentry.

### Server-Side Error Handling

Server components should wrap risky operations in try-catch blocks:

```typescript
// src/app/[locale]/page.tsx
export default async function HomePage() {
  let data;
  let error = false;

  try {
    const service = container.get<MyService>(MyServiceToken);
    data = await service.getData();
  } catch (err) {
    // Error is automatically logged via injected logger in service
    error = true;
  }

  if (error) {
    return <ErrorFallback />;
  }

  return <MyComponent data={data} />;
}
```

## Middleware Error Handling

The middleware uses Sentry directly (can't use DI in edge runtime):

```typescript
import * as Sentry from '@sentry/nextjs';

export default function middleware(req: NextRequest) {
  try {
    // ... middleware logic
    Sentry.addBreadcrumb({
      message: 'Middleware action',
      data: { pathname: req.nextUrl.pathname },
    });
  } catch (error) {
    Sentry.captureException(error, {
      contexts: {
        middleware: {
          pathname: req.nextUrl.pathname,
          method: req.method,
        },
      },
    });
    throw error;
  }
}
```

## Testing

### Mock Logger

Use `MockLogger` in tests to verify logging behavior:

```typescript
import { MockLogger } from '../fixtures/mockLogger';

describe('MyService', () => {
  it('should log errors', async () => {
    const mockLogger = new MockLogger();
    const container = new Container();
    container.bind<Logger>(LoggerToken).toConstantValue(mockLogger);
    container.bind<MyService>(MyService).toSelf();

    const service = container.get(MyService);

    try {
      await service.riskyOperation();
    } catch (err) {
      // Expected
    }

    // Verify error was logged
    expect(mockLogger.hasError('Expected error message')).toBe(true);
    expect(mockLogger.errors[0].context).toEqual({ someKey: 'someValue' });
  });
});
```

### MockLogger API

```typescript
class MockLogger {
  // Captured logs
  errors: Array<{ error: Error; context?: Record<string, unknown> }>;
  warnings: Array<{ message: string; context?: Record<string, unknown> }>;
  infos: Array<{ message: string; context?: Record<string, unknown> }>;
  breadcrumbs: Array<{ message: string; data?: Record<string, unknown> }>;

  // Helper methods
  hasError(messageSubstring: string): boolean;
  hasWarning(messageSubstring: string): boolean;
  hasBreadcrumb(messageSubstring: string): boolean;
  clear(): void;
}
```

## Best Practices

### 1. Use Breadcrumbs for Context

```typescript
this.logger.addBreadcrumb('User clicked button', { buttonId: 'submit' });
this.logger.addBreadcrumb('Validating form data');
this.logger.addBreadcrumb('Sending API request', { endpoint: '/api/users' });
// ... if error occurs, all breadcrumbs are included in the report
```

### 2. Add Contextual Information

```typescript
this.logger.error(error, {
  userId: user.id,
  action: 'checkout',
  cartItems: cart.length,
  locale: currentLocale,
});
```

### 3. Set User Context

```typescript
// When user logs in
this.logger.setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});

// When user logs out
this.logger.setUser(null);
```

### 4. Use Tags for Filtering

```typescript
this.logger.setTags({
  feature: 'checkout',
  version: '2.0',
  locale: 'pt-br',
});
```

### 5. Distinguish Error Types

- Use `logger.error()` for expected errors (validation, not found, etc.)
- Use `logger.captureException()` for unexpected errors that need immediate attention
- Use `logger.warn()` for concerning but non-critical issues

### 6. Don't Log Sensitive Data

Avoid logging:

- Passwords
- Credit card numbers
- Personal identification numbers
- Authentication tokens

### 7. Log at the Right Level

- **Infrastructure Layer**: API failures, external service errors
- **Application Layer**: Business logic failures, orchestration errors
- **Domain Layer**: Validation failures, business rule violations

## Monitoring and Alerts

### Sentry Dashboard

1. **Issues**: View all captured errors grouped by type
2. **Performance**: Monitor transaction performance and slow operations
3. **Releases**: Track errors by release version
4. **Alerts**: Set up notifications for critical errors

### Recommended Alerts

- High error rate (> 1% of requests)
- New error types
- Critical errors in production
- Performance degradation

## Troubleshooting

### Logger Not Working in Tests

Make sure to bind `MockLogger` in your test container:

```typescript
container.bind<Logger>(LoggerToken).toConstantValue(new MockLogger());
```

### Sentry Not Capturing Errors in Development

This is expected. Check console logs instead. To test Sentry in development, temporarily set
`NODE_ENV=production`.

### Source Maps Not Uploading

1. Verify `SENTRY_AUTH_TOKEN` is set
2. Check `SENTRY_ORG` and `SENTRY_PROJECT` are correct
3. Ensure you have permissions to upload source maps in your Sentry project

### High Volume of Errors

Adjust sample rates to reduce noise:

```bash
SENTRY_TRACES_SAMPLE_RATE=0.05  # 5% instead of 10%
```

## Further Reading

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Best Practices](https://docs.sentry.io/product/best-practices/)
- [InversifyJS Documentation](https://inversify.io/)
