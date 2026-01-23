# HTTP Client Architecture Diagram

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Application Layer                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │         PublicWorkApplicationService                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          Domain Layer                                │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │               GithubRepository (Port)                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                HttpClient (Port) ⭐ NEW                      │   │
│  │  - fetch(url, options, metadata)                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                            │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │        GithubRepositoryRestAdapter (Adapter)                 │   │
│  │          Uses: HttpClient ───────────────┐                   │   │
│  └──────────────────────────────────────────┼───────────────────┘   │
│                                              │                       │
│                                              ▼                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │       FetchHttpClientAdapter (Adapter) ⭐ NEW               │   │
│  │                                                              │   │
│  │  ┌────────────────────────────────────────────────────────┐ │   │
│  │  │  Interceptor Pattern (Logging)                         │ │   │
│  │  │                                                         │ │   │
│  │  │  1. Log request (breadcrumb)                           │ │   │
│  │  │     - URL, method, operation name                      │ │   │
│  │  │     - Custom context                                   │ │   │
│  │  │                                                         │ │   │
│  │  │  2. Execute native fetch()                             │ │   │
│  │  │                                                         │ │   │
│  │  │  3. Log response (breadcrumb/warning/error)            │ │   │
│  │  │     - Status code                                      │ │   │
│  │  │     - Duration                                         │ │   │
│  │  │     - Success/failure                                  │ │   │
│  │  └────────────────────────────────────────────────────────┘ │   │
│  │          Uses: Logger                                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                              │                       │
│                                              ▼                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │           LoggerSentryAdapter / LoggerConsoleAdapter         │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │     External Services        │
                    │   - GitHub API               │
                    │   - Other REST APIs          │
                    └──────────────────────────────┘
```

## Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  GithubRepositoryRestAdapter.fetchRepositories()                    │
│                                                                      │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  httpClient.fetch(url, options, {                                   │
│    operation: 'Fetch GitHub repositories',                          │
│    context: { username: 'bagnascojhoel' }                           │
│  })                                                                  │
│                                                                      │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  FetchHttpClientAdapter                              │
│                                                                      │
│  Step 1: logger.addBreadcrumb()                                     │
│    ├─ "Fetch GitHub repositories: GET https://api.github.com/..."  │
│    └─ { type: 'http', category: 'request', url, method, ... }      │
│                                                                      │
│  Step 2: const response = await fetch(url, options)                │
│    └─ Duration tracking starts                                      │
│                                                                      │
│  Step 3a (if response.ok):                                          │
│    └─ logger.addBreadcrumb("Fetch GitHub repositories succeeded")  │
│        └─ { status: 200, duration: 234ms, ... }                    │
│                                                                      │
│  Step 3b (if !response.ok):                                         │
│    └─ logger.warn("Fetch GitHub repositories returned non-OK")     │
│        └─ { status: 404, statusText: 'Not Found', duration, ... }  │
│                                                                      │
│  Step 3c (if network error):                                        │
│    └─ logger.error(error)                                           │
│        └─ { duration, url, method, ... }                            │
│        └─ throw error                                               │
│                                                                      │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Return Response object to caller                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Dependency Injection Graph

```
Container (InversifyJS)
├── HttpClient ──────────► FetchHttpClientAdapter
│                              │
│                              └──► Logger
│
├── GithubRepository ────► GithubRepositoryRestAdapter
│                              │
│                              ├──► Logger
│                              └──► HttpClient ⭐
│
├── Logger ──────────────► LoggerSentryAdapter (production)
│                      └──► LoggerConsoleAdapter (development)
│
└── ...other services
```

## Benefits Visualization

```
Before:                          After:
┌──────────────────┐            ┌──────────────────┐
│  Repository      │            │  Repository      │
│                  │            │                  │
│  fetch() ────────┼───────►    │  httpClient ─────┼────┐
│                  │  No logs   │                  │    │
└──────────────────┘            └──────────────────┘    │
                                                         │
                                                         ▼
                                              ┌──────────────────┐
                                              │  HttpClient      │
                                              │  ✅ Logs all     │
                                              │  ✅ Measures     │
                                              │  ✅ Tracks errors│
                                              └──────────────────┘
```
