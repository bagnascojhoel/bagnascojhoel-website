/**
 * Logger interface - Domain port for error tracking and logging.
 * 
 * This abstraction ensures domain and application layers remain framework-agnostic.
 * Implementations (adapters) should be provided in the infrastructure layer.
 */
export interface Logger {
  /**
   * Log an error with optional context.
   * @param error - The error object to log
   * @param context - Additional metadata about the error
   */
  error(error: Error, context?: Record<string, unknown>): void;

  /**
   * Log a warning message with optional context.
   * @param message - The warning message
   * @param context - Additional metadata
   */
  warn(message: string, context?: Record<string, unknown>): void;

  /**
   * Log an informational message with optional context.
   * @param message - The info message
   * @param context - Additional metadata
   */
  info(message: string, context?: Record<string, unknown>): void;

  /**
   * Capture and report an exception to the error tracking service.
   * This should be used for unexpected errors that need to be monitored.
   * @param error - The exception to capture
   * @param context - Additional context about the error
   */
  captureException(error: Error, context?: Record<string, unknown>): void;

  /**
   * Set the current user context for error tracking.
   * @param user - User information to attach to error reports
   */
  setUser(user: { id: string; email?: string; username?: string } | null): void;

  /**
   * Add contextual tags to all subsequent logs.
   * Useful for adding request-specific or session-specific context.
   * @param tags - Key-value pairs to tag logs with
   */
  setTags(tags: Record<string, string>): void;

  /**
   * Add a breadcrumb - a log of an action that led up to an error.
   * @param message - Description of the action
   * @param data - Additional data about the action
   */
  addBreadcrumb(message: string, data?: Record<string, unknown>): void;
}

/**
 * Dependency injection token for Logger.
 * Use this symbol when binding/injecting the Logger interface.
 */
export const LoggerToken = Symbol.for('Logger');
