/**
 * HttpClient interface - Domain port for HTTP requests with centralized logging.
 *
 * This abstraction provides a single point for outbound HTTP calls, ensuring
 * all external API requests are logged consistently. Implementations should
 * automatically log request/response details, errors, and performance metrics.
 */
export interface HttpClient {
  /**
   * Execute an HTTP request with automatic logging.
   * Logs request start, success/failure, status codes, and duration.
   * Automatically logs: HTTP method, URL, and non-sensitive headers.
   *
   * @param url - The URL to request
   * @param options - Fetch API options (method, headers, body, etc.)
   * @returns Promise resolving to the Response object
   * @throws Error if the network request fails
   */
  fetch(url: string, options?: RequestInit): Promise<Response>;
}

/**
 * Dependency injection token for HttpClient.
 * Use this symbol when binding/injecting the HttpClient interface.
 */
export const HttpClientToken = Symbol.for('HttpClient');
