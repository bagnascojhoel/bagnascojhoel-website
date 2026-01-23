# Centralized HTTP Client Logging Implementation

## Overview

This document describes the implementation of centralized logging for all outbound HTTP calls using
a custom `HttpClient` abstraction with interceptor-like functionality.

## Problem Statement

The application was making HTTP requests to external APIs (GitHub) directly using the native `fetch`
API without consistent logging. This made it difficult to:

- Debug API integration issues
- Monitor API performance and latency
- Track rate limiting and errors
- Understand the flow of external requests in production

## Solution

Implemented a centralized HTTP client wrapper that automatically logs all outbound requests and
responses. This follows the project's clean architecture pattern using the Port-Adapter pattern.

## Architecture

### Domain Layer (Port)

**File:** [src/core/domain/HttpClient.ts](../src/core/domain/HttpClient.ts)

```typescript
export interface HttpClient {
  fetch(url: string, options?: RequestInit, operation?: string): Promise<Response>;
}

export const HttpClientToken = Symbol.for('HttpClient');
```

**Design Decisions:**

- Follows the native `fetch` API signature for easy adoption
- Adds optional `operation` parameter for descriptive logging
- Returns native `Response` object to maintain compatibility
- Automatically logs HTTP method, URL, and non-sensitive headers

### Infrastructure Layer (Adapter)

**File:**
[src/core/infrastructure/FetchHttpClientAdapter.ts](../src/core/infrastructure/FetchHttpClientAdapter.ts)

**Features:**

1. **Request Logging**: Logs request initiation with URL, method, and operation name
2. **Response Logging**: Logs success with status code and duration
3. **Error Handling**: Logs non-OK status codes and network failures
4. **Performance Tracking**: Measures and logs request duration
5. **Header Sanitization**: Automatically filters out sensitive headers (Authorization, Cookie,
   API-Key)

**Logged Information:**

- Request: URL, HTTP method, operation name, non-sensitive headers
- Response: Status code, status text, duration
- Errors: Error message, duration, full context

## Integration Points

### Updated Components

1. **[GithubRepositoryRestAdapter](../src/core/infrastructure/GithubRepositoryRestAdapter.ts)**
   - Replaced direct `fetch` calls with `httpClient.fetch()`
   - Added operation names: "Fetch GitHub repositories", "Fetch extra portfolio description"
   - Simplified API by removing context parameter

2. **[ContainerConfig](../src/core/ContainerConfig.ts)**
   - Added `HttpClient` binding to `FetchHttpClientAdapter`
   - Registered as singleton to maintain consistent state

### Dependency Injection

```typescript
container.bind<HttpClient>(HttpClientToken).to(FetchHttpClientAdapter).inSingletonScope();
```

## Usage Example

### Before (Direct fetch)

```typescript
const response = await fetch(url, {
  headers: { Authorization: `Bearer ${token}` },
});
```

### After (Centralized logging)

```typescript
const response = await this.httpClient.fetch(
  url,
  {
    headers: { Authorization: `Bearer ${token}` },
  },
  'Fetch GitHub repositories'
);
```

**What gets logged automatically:**

- HTTP method (GET, POST, etc.)
- Full URL
- Non-sensitive headers (Content-Type, Accept, etc.)
- Authorization and Cookie headers are filtered out

## Logging Output

The HttpClient produces three types of logs:

1. **Breadcrumbs** (via `logger.addBreadcrumb()`):
   - Request initiation with method, URL, and sanitized headers
   - Successful responses with status code and duration

2. **Warnings** (via `logger.warn()`):
   - Non-OK HTTP status codes (4xx, 5xx)

3. **Errors** (via `logger.error()`):
   - Network failures
   - Connection timeouts

## Testing

### Unit Tests

**File:**
[tests/infrastructure/FetchHttpClientAdapter.test.ts](../tests/infrastructure/FetchHttpClientAdapter.test.ts)

**Test Coverage:**

- ✅ Logs breadcrumb with method and URL
- ✅ Sanitizes sensitive headers (Authorization, Cookie, API-Key)
- ✅ Logs success breadcrumb with duration
- ✅ Defaults operation name to "HTTP Request"
- ✅ Logs warning for 4xx status codes
- ✅ Logs warning for 5xx status codes
- ✅ Logs error and rethrows on network failure
- ✅ Handles non-Error thrown values
- ✅ Handles requests without headers

### Integration Tests

Updated
[tests/integration/PublicWorkApplicationService.integration.test.ts](../tests/integration/PublicWorkApplicationService.integration.test.ts)
to include HttpClient binding in the test container.

## Benefits

1. **Observability**: All HTTP requests are visible in logs with important details
2. **Security**: Sensitive headers are automatically filtered from logs
3. **Debugging**: Request/response details help identify API integration issues
4. **Performance Monitoring**: Request duration tracking helps identify slow endpoints
5. **Centralized Control**: Single point to add features like retry logic, rate limiting, or caching
6. **Type Safety**: TypeScript interfaces ensure consistent usage across the codebase
7. **Testability**: Easy to mock for unit tests

## Future Enhancements

Potential improvements that could be added to the HttpClient:

- **Automatic Retry Logic**: Retry failed requests with exponential backoff
- **Rate Limiting**: Track and respect API rate limits
- **Request Caching**: Cache GET requests to reduce API calls
- **Circuit Breaker**: Stop calling failing services temporarily
- **Request/Response Interceptors**: Transform requests/responses globally
- **Timeout Configuration**: Configurable timeouts per request
- **Metrics Collection**: Aggregate statistics (success rate, average duration, etc.)

## Migration Guide

To use HttpClient in a new repository adapter:

1. Import the HttpClient interface and token:

   ```typescript
   import type { HttpClient } from '@/core/domain/HttpClient';
   import { HttpClientToken } from '@/core/domain/HttpClient';
   ```

2. Inject it in the constructor:

   ```typescript
   constructor(
     @inject(LoggerToken) private logger: Logger,
     @inject(HttpClientToken) private httpClient: HttpClient
   ) {}
   ```

3. Replace `fetch` calls:

   ```typescript
   const response = await this.httpClient.fetch(
     url,
     options,
     'Descriptive operation name' // Optional
   );
   ```

   The HttpClient automatically logs:
   - HTTP method and URL
   - Non-sensitive headers (Authorization, Cookie filtered out)
   - Response status and duration
   - Errors with full context

4. Update tests to include HttpClient mock:
   ```typescript
   const httpClient = new FetchHttpClientAdapter(mockLogger);
   const repository = new YourRepository(mockLogger, httpClient);
   ```

## References

- [HttpClient.ts](../src/core/domain/HttpClient.ts) - Domain interface
- [FetchHttpClientAdapter.ts](../src/core/infrastructure/FetchHttpClientAdapter.ts) - Implementation
- [ContainerConfig.ts](../src/core/ContainerConfig.ts) - DI configuration
- [Test file](../tests/infrastructure/FetchHttpClientAdapter.test.ts) - Unit tests
