import * as Sentry from '@sentry/nextjs';
import { injectable } from 'inversify';
import { Logger } from '@/core/domain/Logger';

/**
 * Sentry implementation of the Logger interface.
 * This adapter integrates Sentry for error tracking and logging.
 *
 * Should be used in production environments.
 */
@injectable()
export class LoggerSentry implements Logger {
  error(error: Error, context?: Record<string, unknown>): void {
    if (context) {
      Sentry.setContext('error_context', context);
    }
    Sentry.logger.error(error.message, context);
    Sentry.captureException(error, {
      level: 'error',
      ...(context && { contexts: { custom: context } }),
    });
  }

  warn(message: string, context?: Record<string, unknown>): void {
    Sentry.logger.warn(message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    Sentry.logger.info(message, context);
  }

  captureException(error: Error, context?: Record<string, unknown>): void {
    if (context) {
      // Set tags for better filtering in Sentry UI
      const tags = Object.entries(context)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_key, value]) => typeof value === 'string' || typeof value === 'number')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {});

      if (Object.keys(tags).length > 0) {
        Sentry.setTags(tags);
      }

      // Set full context
      Sentry.setContext('exception_context', context);
    }

    Sentry.captureException(error);
  }

  setUser(user: { id: string; email?: string; username?: string } | null): void {
    Sentry.setUser(user);
  }

  setTags(tags: Record<string, string>): void {
    Sentry.setTags(tags);
  }

  addBreadcrumb(message: string, data?: Record<string, unknown>): void {
    Sentry.addBreadcrumb({
      message,
      data,
      level: 'info',
      timestamp: Date.now() / 1000,
    });
  }
}
