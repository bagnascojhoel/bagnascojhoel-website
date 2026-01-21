import { injectable } from 'inversify';
import { Logger } from '@/core/domain/Logger';

/**
 * Console implementation of the Logger interface.
 * This adapter logs to the console and is intended for development and testing.
 *
 * Should be used in non-production environments or tests.
 */
@injectable()
export class LoggerConsoleAdapter implements Logger {
  private breadcrumbs: Array<{
    message: string;
    data?: Record<string, unknown>;
    timestamp: number;
  }> = [];
  private tags: Record<string, string> = {};
  private user: { id: string; email?: string; username?: string } | null = null;

  error(error: Error, context?: Record<string, unknown>): void {
    console.error('[ERROR]', error.message, {
      error,
      context,
      tags: this.tags,
      user: this.user,
      stack: error.stack,
    });
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn('[WARN]', message, {
      context,
      tags: this.tags,
      user: this.user,
    });
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.info('[INFO]', message, {
      context,
      tags: this.tags,
      user: this.user,
    });
  }

  captureException(error: Error, context?: Record<string, unknown>): void {
    console.error('[EXCEPTION CAPTURED]', error.message, {
      error,
      context,
      tags: this.tags,
      user: this.user,
      breadcrumbs: this.breadcrumbs,
      stack: error.stack,
    });
  }

  setUser(user: { id: string; email?: string; username?: string } | null): void {
    this.user = user;
    if (user) {
      console.debug('[USER SET]', user);
    } else {
      console.debug('[USER CLEARED]');
    }
  }

  setTags(tags: Record<string, string>): void {
    this.tags = { ...this.tags, ...tags };
    console.debug('[TAGS SET]', this.tags);
  }

  addBreadcrumb(message: string, data?: Record<string, unknown>): void {
    this.breadcrumbs.push({
      message,
      data,
      timestamp: Date.now(),
    });
    console.debug('[BREADCRUMB]', message, data);
  }

  /**
   * Clear breadcrumbs (useful for testing).
   */
  clearBreadcrumbs(): void {
    this.breadcrumbs = [];
  }

  /**
   * Clear tags (useful for testing).
   */
  clearTags(): void {
    this.tags = {};
  }
}
