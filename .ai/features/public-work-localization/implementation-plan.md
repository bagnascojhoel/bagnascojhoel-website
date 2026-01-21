# Implementation Plan: Localization for Public Work Items

**Date:** 2026-01-21  
**Status:** Proposed  
**Author:** AI Architect Agent

---

## 📋 Summary

This implementation adds internationalization (i18n) support for all public work items (articles,
certifications, and projects), enabling users to view content in their preferred language with
automatic fallback to English when translations are unavailable.

**Key Architectural Principles:**

- **Mandatory Locale**: All repository methods require a locale parameter for explicit localization
- **Domain Fallback**: Infrastructure throws `LocaleNotSupportedError` for unsupported locales;
  domain layer catches and retries with default locale
- **Separation of Concerns**: Infrastructure is strict (throws on unsupported locale), domain is
  graceful (handles fallback logic)
- **Explicit Naming**: All data files include locale suffix (`_en`, `_pt-br`) with no "default"
  files

---

## 🔍 Analysis

### Current State

- **Repository Interfaces**: [ArticleRepository](../../src/core/domain/ArticleRepository.ts) and
  [CertificationRepository](../../src/core/domain/CertificationRepository.ts) have simple `fetch*()`
  methods without locale parameters
- **JSON Adapters**:
  - [ArticleRepositoryJsonAdapter](../../src/core/infrastructure/ArticleRepositoryJsonAdapter.ts)
    hardcodes `articles.json` import
  - [CertificationRepositoryJsonAdapter](../../src/core/infrastructure/CertificationRepositoryJsonAdapter.ts)
    hardcodes `certifications.json` import
- **GitHub Integration**:
  [GithubRepository.fetchExtraPortfolioDescription](../../src/core/domain/GithubRepository.ts)
  accepts `owner` and `repo` but no locale
- **Project Factory**: [ProjectFactory.create](../../src/core/domain/ProjectFactory.ts) calls
  `fetchExtraPortfolioDescription` without locale
- **UI Layer**: [page.tsx](../../src/app/[locale]/page.tsx) receives locale from Next.js route
  params but doesn't pass it to application services
- **Existing Data Files**:
  - `data/articles.json` (needs rename to `articles_en.json`)
  - `data/articles_pt-br.json` ✅
  - `data/certifications.json` (needs rename to `certifications_en.json`)
  - `data/certifications_pt-br.json` ✅

### Impact Analysis

| Layer                    | Components Affected                                                  | Change Type                       |
| ------------------------ | -------------------------------------------------------------------- | --------------------------------- |
| **Domain**               | Repository interfaces, `GetPublicWorkItemsService`, `ProjectFactory` | Breaking (mandatory locale param) |
| **Application Services** | `PublicWorkApplicationService`                                       | Signature + caching strategy      |
| **Infrastructure**       | All repository adapters (JSON and REST)                              | Implementation change             |
| **UI**                   | `[locale]/page.tsx`                                                  | Pass locale parameter             |
| **Tests**                | All repository/service tests                                         | Update mocks and assertions       |
| **Data Files**           | `articles.json`, `certifications.json`                               | Rename with locale suffix         |

---

## 💡 Proposed Solution

### 1. Domain Layer Changes

#### 1.1 Update Repository Interfaces

**Files to modify:**

- `src/core/domain/ArticleRepository.ts`
- `src/core/domain/CertificationRepository.ts`
- `src/core/domain/GithubRepository.ts`

**Changes:**

- **ArticleRepository**: Add mandatory `locale: string` parameter to `fetchArticles()` method
- **CertificationRepository**: Add mandatory `locale: string` parameter to `fetchCertifications()`
  method
- **GithubRepository**: Add mandatory `locale: string` parameter as third argument to
  `fetchExtraPortfolioDescription()` method after `owner` and `repo`
- All parameters are mandatory (not optional) to force explicit locale handling
- Return types remain unchanged

**Rationale:**

- Locale parameter is mandatory to force explicit locale handling at all call sites
- Infrastructure adapters throw `LocaleNotSupportedError` for unsupported locales
- Domain layer catches this error and implements fallback logic (domain concern)
- Consistent API across all repository types

---

#### 1.2 Update GetPublicWorkItemsService

**File:** `src/core/domain/GetPublicWorkItemsService.ts`

**Required Outcomes:**

- `getAll()` method must accept mandatory `locale: string` parameter
- Locale must be propagated to all repository fetch calls and `ProjectFactory.create()`
- Service must implement graceful fallback to `DEFAULT_LOCALE` when `LocaleNotSupportedError` occurs
- Fallback events must be logged for observability
- Non-locale errors must propagate unchanged
- Existing parallel fetching pattern with `Promise.allSettled()` must be preserved

**Constraints:**

- Domain layer owns fallback logic—infrastructure throws `LocaleNotSupportedError`
- Fallback behavior is a domain concern (business logic), not infrastructure concern
- All locale-related errors must be caught and handled; other errors must propagate

---

#### 1.3 Update ProjectFactory

**File:** `src/core/domain/ProjectFactory.ts`

**Required Outcomes:**

- `create()` method must accept mandatory `locale: string` as second parameter
- Locale must be passed to `fetchExtraPortfolioDescription()` repository call
- Factory must implement fallback to `DEFAULT_LOCALE` when `LocaleNotSupportedError` occurs
- If both requested and default locales fail (404/file not found), factory must continue without
  extras
- Fallback attempts must be logged for debugging
- Existing project creation logic must be preserved (supports with/without extras)

**Constraints:**

- Domain fallback pattern: catch `LocaleNotSupportedError`, retry with default, silently handle
  missing files
- 404 errors after fallback indicate missing extra description file (expected behavior)
- Non-locale errors should propagate through existing error handling

---

### 2. Infrastructure Layer Changes

#### 2.1 ArticleRepositoryJsonAdapter

**File:** `src/core/infrastructure/ArticleRepositoryJsonAdapter.ts`

**Required Outcomes:**

- `fetchArticles()` must accept mandatory `locale: string` parameter
- Adapter must throw `LocaleNotSupportedError` for unsupported locales (`en` and `pt-br` only)
- Data must be loaded from locale-specific files: `articles_en.json` or `articles_pt-br.json`
- Returned data must conform to `Article[]` type

**Constraints:**

- Must use explicit conditionals (not template literals) for dynamic imports to ensure build-time
  path resolution
- No fallback logic—infrastructure throws errors, domain handles fallback
- `LocaleNotSupportedError` must be re-thrown unchanged
- Other errors must be logged with context (adapter name, locale) and re-thrown

---

#### 2.2 CertificationRepositoryJsonAdapter

**File:** `src/core/infrastructure/CertificationRepositoryJsonAdapter.ts`

**Required Outcomes:**

- `fetchCertifications()` must accept mandatory `locale: string` parameter
- Adapter must throw `LocaleNotSupportedError` for unsupported locales
- Data must be loaded from locale-specific files: `certifications_en.json` or
  `certifications_pt-br.json`
- Returned data must conform to `Certification[]` type

**Constraints:**

- Must follow identical pattern to `ArticleRepositoryJsonAdapter`
- Explicit conditionals for build-time path resolution
- No fallback logic in infrastructure layer
- Proper error context in logs (adapter name, locale)

---

#### 2.3 GithubRepositoryRestAdapter

**File:** `src/core/infrastructure/GithubRepositoryRestAdapter.ts`

**Required Outcomes:**

- `fetchExtraPortfolioDescription()` must accept mandatory `locale: string` as third parameter
- Adapter must throw `LocaleNotSupportedError` for unsupported locales
- Locale must map to specific GitHub file names: `portfolio-description_en.json` or
  `portfolio-description_pt-br.json`
- Must return `null` if file doesn't exist (404 response)
- Must return `null` for other fetch errors (logged with status code)
- 404 responses must NOT be logged (missing files are expected)

**Constraints:**

- Explicit conditionals for locale-to-filename mapping
- GitHub API URL pattern: `/repos/{owner}/{repo}/contents/{fileName}`
- Distinction between "unsupported locale" (throws error) and "file not found" (returns null)
- All files must use explicit locale suffix (no "default" fallback files)

---

### 3. Application Services Changes

#### 3.1 PublicWorkApplicationService

**File:** `src/core/application-services/PublicWorkApplicationService.ts`

**Required Outcomes:**

- `getAll()` method must accept mandatory `locale: string` parameter
- Cache must be per-locale (locale as cache key) to prevent cross-contamination
- Cache entries must include timestamp for TTL validation
- Existing cache TTL behavior must be preserved (env-configurable, default 3600000ms)
- Cache hits and misses must be logged for observability
- Locale must be passed to `getPublicWorkItemsService.getAll()`

**Constraints:**

- Each locale maintains independent cache entry
- Prevents cache pollution when users switch languages
- Slightly increased memory usage (acceptable trade-off, mitigated by TTL)
- Cache structure: `Map<string, CacheEntry>` where `CacheEntry = { timestamp, items }`

---

### 4. UI Layer Changes

#### 4.1 Update Next.js Page

**File:** `src/app/[locale]/page.tsx`

**Required Outcomes:**

- Page component must extract locale from Next.js route params
- Locale must be passed to `useCase.getAll()` method
- Existing error handling structure must be preserved
- No changes to component rendering logic

**Constraints:**

- Next.js 14 App Router provides locale via `params.locale` from `[locale]` route segment
- Type signature: `{ params: { locale: string } }`
- Locale is guaranteed to be present (routing layer ensures validity)

---

### 5. Testing Strategy

#### 5.1 Unit Tests to Update/Create

**Files:**

- `tests/infrastructure/ArticleRepositoryJson.test.ts` [**NEW**]
- `tests/infrastructure/CertificationRepositoryJson.test.ts` [UPDATE]
- `tests/infrastructure/GitHubRepositoryRest.test.ts` [UPDATE]
- `tests/application-services/PublicWorkApplicationService.test.ts` [UPDATE]

**Test Cases:**

**ArticleRepositoryJsonAdapter:**

- Happy path: Returns English articles for `locale='en'`
- Happy path: Returns Portuguese articles for `locale='pt-br'`
- Error: Throws `LocaleNotSupportedError` for `locale='fr'`
- Structure: Verifies article schema (id, title, description, tags, link, publishedAt)

**CertificationRepositoryJsonAdapter:**

- Same pattern as articles
- Verify Portuguese type field: `"Certificação"` for pt-br
- Verify English type field: `"Certification"` for en

**GithubRepositoryRestAdapter:**

- Fetches `portfolio-description_pt-br.json` for `locale='pt-br'`
- Fetches `portfolio-description_en.json` for `locale='en'`
- Returns `null` for 404 (file doesn't exist)
- Throws `LocaleNotSupportedError` for unsupported locale
- Does NOT log error for 404 responses

**PublicWorkApplicationService:**

- Caches results per locale
- Returns different content for different locales
- Cache hit for same locale on subsequent call

#### 5.2 Integration Tests

**File:** `tests/integration/PublicWorkApplicationService.integration.test.ts` [UPDATE]

**Test Scenarios:**

- End-to-end: Fetch pt-br content, verify Portuguese certifications
- End-to-end: Fetch en content, verify English certifications
- Fallback: Request unsupported locale, verify fallback to default without throwing
- Caching: Verify per-locale cache isolation

---

### 6. Data/Configuration Changes

#### 6.1 Data File Naming Convention

**Migration Required (Phase 0):**

| Current File               | New File Name                 |
| -------------------------- | ----------------------------- |
| `data/articles.json`       | `data/articles_en.json`       |
| `data/certifications.json` | `data/certifications_en.json` |

**Established Pattern:**

| File Type                     | English (Default)               | Portuguese                         |
| ----------------------------- | ------------------------------- | ---------------------------------- |
| Articles                      | `articles_en.json`              | `articles_pt-br.json`              |
| Certifications                | `certifications_en.json`        | `certifications_pt-br.json`        |
| GitHub Portfolio Descriptions | `portfolio-description_en.json` | `portfolio-description_pt-br.json` |

**Naming Rules:**

- All files include explicit locale suffix (no "default" files)
- Use underscore `_` separator: `filename_locale.json`
- Locale format: hyphenated lowercase (`en`, `pt-br`)
- English (EN) is the system default/fallback locale

---

## ✅ Validation

**Automated Checks:**

1. Run all tests: `npm test`
2. Run linter: `npm run lint`
3. Build succeeds: `npm run build`
4. Type checking: `npx tsc --noEmit`

**Manual Verification:**

- [ ] Visit `/en` → Verify English articles, certifications, project descriptions
- [ ] Visit `/pt-br` → Verify Portuguese content
- [ ] Check DevTools console → No errors/warnings about missing files
- [ ] Switch language → Content updates correctly without cache pollution
- [ ] Request unsupported locale → Fallback to English without errors
- [ ] GitHub projects with localized descriptions → Display correct locale
- [ ] GitHub projects without localized files → No console errors (404 is silent)

---

## Notes for AI Agents

**Before starting implementation:**

1. ✅ Verify all instruction files have been read (atomic-design-standards, style-guide, typescript
   guidelines)
2. ✅ Search for similar patterns: `LocalizedMessagesRepositoryJson` for locale-aware file loading
3. ✅ Review existing error handling: `LocaleNotSupportedError` usage patterns
4. ✅ Check test fixtures: `mockMessages.ts` for locale-based test data patterns
5. ✅ Validate against `.ai/ui-ux-rules.md` for accessibility compliance

**During implementation:**

1. Follow implementation order: Domain → Infrastructure → Application → UI → Tests
2. After each phase, run: `npm test` to verify no regressions
3. Use explicit conditionals for dynamic imports (not template literals)
4. Ensure `LocaleNotSupportedError` is thrown by infrastructure, caught by domain
5. Log fallback occurrences with `logger.addBreadcrumb()` for observability
6. Do NOT log 404 responses—missing files are expected

**After implementation:**

1. Run full test suite: `npm test`
2. Run type checking: `npx tsc --noEmit`
3. Run linter: `npm run lint`
4. Build project: `npm run build`
5. Manual testing in browser (see Validation section)
6. Update this document if implementation deviated from plan

---

## 📚 References

- [Existing Feature: GitHub Extra Descriptions](../github-extra-descriptions/ADR-2026-01-16.md)
- [Domain: Locale.ts](../../src/core/domain/Locale.ts) - `Locale.EN` is the default locale,
  `DEFAULT_LOCALE = Locale.EN`
- [UI/UX Standards](../../.ai/ui-ux-rules.md)
- [TypeScript Guidelines](../../.github/instructions/typescript.instructions.md)
- [Hexagonal Architecture Principles](<https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)>)
