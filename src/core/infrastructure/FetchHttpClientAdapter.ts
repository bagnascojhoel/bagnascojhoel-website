import { inject, injectable } from 'inversify';
import type { HttpClient } from '@/core/domain/HttpClient';
import type { Logger } from '@/core/domain/Logger';
import { LoggerToken } from '@/core/domain/Logger';

/**
 * HTTP client adapter using native fetch with automatic request/response logging.
 *
 * Logs:
 * - Request initiation (URL, method, operation name)
 * - Response success (status code, duration)
 * - Response errors (status code, status text, duration)
 * - Network failures (connection errors, timeouts)
 *
 * This provides centralized observability for all outbound HTTP calls.
 */
@injectable()
export class FetchHttpClientAdapter implements HttpClient {
  private readonly sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'api-key'];
  constructor(@inject(LoggerToken) private logger: Logger) {}
  async fetch(url: string, options?: RequestInit): Promise<Response> {
    const startTime = Date.now();
    const method = options?.method || 'GET';
    const operationName = `${method} ${this.getUrlPath(url)}`;
    const logContext = {
      url,
      method,
      headers: this.sanitizeHeaders(options?.headers),
    };
    this.logger.addBreadcrumb(`${operationName}: ${method} ${url}`, {
      type: 'http',
      category: 'request',
      ...logContext,
    });
    try {
      const response = await fetch(url, options);
      const duration = Date.now() - startTime;
      if (response.ok) {
        this.logger.addBreadcrumb(`${operationName} succeeded`, {
          type: 'http',
          category: 'response',
          status: response.status,
          duration,
          ...logContext,
        });
      } else {
        this.logger.warn(`${operationName} returned non-OK status`, {
          status: response.status,
          statusText: response.statusText,
          duration,
          ...logContext,
        });
      }
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown network error';
      this.logger.error(
        error instanceof Error
          ? error
          : new Error(`${operationName} network failure: ${errorMessage}`),
        {
          duration,
          ...logContext,
        }
      );
      throw error;
    }
  }
  private sanitizeHeaders(headers?: HeadersInit): Record<string, string> {
    if (!headers) return {};
    const headerRecord: Record<string, string> = {};
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        if (!this.sensitiveHeaders.includes(key.toLowerCase())) {
          headerRecord[key] = value;
        }
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        if (!this.sensitiveHeaders.includes(key.toLowerCase())) {
          headerRecord[key] = value;
        }
      });
    } else {
      Object.entries(headers).forEach(([key, value]) => {
        if (!this.sensitiveHeaders.includes(key.toLowerCase())) {
          headerRecord[key] = value;
        }
      });
    }
    return headerRecord;
  }
  private getUrlPath(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  }
}
