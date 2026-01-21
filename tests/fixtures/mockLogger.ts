import { Logger } from '@/core/domain/Logger';

/**
 * Mock implementation of Logger for testing purposes.
 * Captures all log calls for assertion in tests.
 */
export class MockLogger implements Logger {
  public errors: Array<{ error: Error; context?: Record<string, unknown> }> = [];
  public warnings: Array<{ message: string; context?: Record<string, unknown> }> = [];
  public infos: Array<{ message: string; context?: Record<string, unknown> }> = [];
  public exceptions: Array<{ error: Error; context?: Record<string, unknown> }> = [];
  public breadcrumbs: Array<{ message: string; data?: Record<string, unknown> }> = [];
  public users: Array<{ id: string; email?: string; username?: string } | null> = [];
  public tags: Record<string, string> = {};

  error(error: Error, context?: Record<string, unknown>): void {
    this.errors.push({ error, context });
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.warnings.push({ message, context });
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.infos.push({ message, context });
  }

  captureException(error: Error, context?: Record<string, unknown>): void {
    this.exceptions.push({ error, context });
  }

  setUser(user: { id: string; email?: string; username?: string } | null): void {
    this.users.push(user);
  }

  setTags(tags: Record<string, string>): void {
    this.tags = { ...this.tags, ...tags };
  }

  addBreadcrumb(message: string, data?: Record<string, unknown>): void {
    this.breadcrumbs.push({ message, data });
  }

  /**
   * Clear all captured logs (useful between tests).
   */
  clear(): void {
    this.errors = [];
    this.warnings = [];
    this.infos = [];
    this.exceptions = [];
    this.breadcrumbs = [];
    this.users = [];
    this.tags = {};
  }

  /**
   * Check if an error with a specific message was logged.
   */
  hasError(messageSubstring: string): boolean {
    return this.errors.some(e => e.error.message.includes(messageSubstring));
  }

  /**
   * Check if a warning with a specific message was logged.
   */
  hasWarning(messageSubstring: string): boolean {
    return this.warnings.some(w => w.message.includes(messageSubstring));
  }

  /**
   * Check if a breadcrumb with a specific message was added.
   */
  hasBreadcrumb(messageSubstring: string): boolean {
    return this.breadcrumbs.some(b => b.message.includes(messageSubstring));
  }
}
