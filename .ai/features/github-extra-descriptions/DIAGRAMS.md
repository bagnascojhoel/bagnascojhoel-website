# Architecture Diagrams - GitHub Extra Descriptions Feature

This document contains visual diagrams to supplement the [ADR-2026-01-16.md](./ADR-2026-01-16.md).

---

## 1. System Context Diagram

Shows how the feature fits into the overall portfolio website architecture.

```mermaid
C4Context
    title System Context - Portfolio Website v2

    Person(visitor, "Portfolio Visitor", "Views projects on website")

    System(portfolio, "Portfolio Website", "Next.js 14 App", "Displays projects, articles, certifications")

    System_Ext(github_api, "GitHub API", "REST API", "Repository data + file contents")
    System_Ext(notion_api, "Notion API", "REST API", "Article data")

    Rel(visitor, portfolio, "Views", "HTTPS")
    Rel(portfolio, github_api, "Fetches repos + .portfolio-description.json", "REST API")
    Rel(portfolio, notion_api, "Fetches articles", "REST API")
```

---

## 2. Container Diagram - Hexagonal Architecture

Shows the internal structure following hexagonal/ports & adapters architecture.

```mermaid
graph TB
    subgraph "Next.js Application"
        subgraph "Presentation Layer"
            SC[Server Components<br/>Home Page]
            API[API Routes<br/>/api/public-work]
        end

        subgraph "Application Services Layer"
            PWS[PublicWorkApplicationService<br/>getAll]
        end

        subgraph "Domain Layer - Pure Business Logic"
            PF[ProjectFactory<br/>fromGitHubRepositoryWithExtras]
            EPD[ExtraPortfolioDescription<br/>Entity]
            P[Project<br/>Entity]
            COMP[Complexity<br/>Enum]

            GHPORT[GitHubRepository<br/>Port/Interface]
            EPDPORT[ExtraPortfolioDescriptionRepository<br/>Port/Interface]
        end

        subgraph "Infrastructure Layer - Adapters"
            GHREST[GitHubRepositoryRest<br/>Fetch repos from GitHub]
            EPDREST[GitHubExtraDescriptionRepositoryRest<br/>Fetch .portfolio-description.json]
        end
    end

    subgraph "External Systems"
        GITHUB[(GitHub API)]
    end

    SC -->|calls| PWS
    API -->|calls| PWS

    PWS -->|injects| GHPORT
    PWS -->|injects| EPDPORT
    PWS -->|calls| PF

    PF -->|creates| P
    PF -->|uses| EPD
    P -->|has| COMP

    GHPORT -.implements.-> GHREST
    EPDPORT -.implements.-> EPDREST

    GHREST -->|GET /user/repos| GITHUB
    EPDREST -->|GET /repos/.../contents/...| GITHUB

    style PWS fill:#e1f5ff,stroke:#0277bd,stroke-width:2px
    style PF fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style P fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style EPD fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style COMP fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style GHREST fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style EPDREST fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

---

## 3. Component Diagram - Data Flow

Shows how data flows through the system from GitHub API to rendered UI.

```mermaid
flowchart TD
    START([User requests homepage]) --> SSR[Next.js Server Component]

    SSR --> PWS[PublicWorkApplicationService.getAll]

    PWS --> PARALLEL{Parallel Fetch}

    PARALLEL -->|Promise 1| GH_REPOS[GitHubRepositoryRest<br/>fetchRepositories]
    PARALLEL -->|Promise 2| EPD_REPOS[GitHubExtraDescriptionRepositoryRest<br/>fetchExtraDescriptions]

    GH_REPOS --> GH_API_1[GitHub API<br/>GET /user/repos]
    GH_API_1 --> GH_RESULT[GitHubCodeRepository array]

    EPD_REPOS --> LOOP{For each repo}
    LOOP --> GH_API_2[GitHub API<br/>GET /repos/.../contents/.portfolio-description.json]

    GH_API_2 -->|200 OK| DECODE[Decode Base64 JSON]
    GH_API_2 -->|404 Not Found| NULL[Return null]

    DECODE --> VALIDATE[Zod Schema Validation]
    VALIDATE -->|Valid| EPD[ExtraPortfolioDescription]
    VALIDATE -->|Invalid| LOG_ERR[Log error] --> NULL

    EPD --> EPD_RESULT[Array of ExtraPortfolioDescription nullable]
    NULL --> EPD_RESULT

    GH_RESULT --> MERGE[Match repos with extras by repositoryId]
    EPD_RESULT --> MERGE

    MERGE --> FACTORY[ProjectFactory.fromGitHubRepositoriesWithExtras]

    FACTORY --> LOOP2{For each repo}

    LOOP2 -->|Has extra| MERGE_LOGIC[Merge GitHub + extra data]
    LOOP2 -->|No extra| DEFAULT_LOGIC[Use GitHub data + defaults]

    MERGE_LOGIC --> VALIDATE_DESC{Has description?}
    DEFAULT_LOGIC --> VALIDATE_DESC

    VALIDATE_DESC -->|Yes| CREATE[Create Project entity]
    VALIDATE_DESC -->|No| SKIP[Log warning, return null]

    CREATE --> PROJECT[Project array]
    SKIP --> PROJECT

    PROJECT --> FILTER[Filter out nulls]
    FILTER --> RETURN[Return to UI]
    RETURN --> RENDER[Render Project Cards]

    style PWS fill:#e1f5ff
    style FACTORY fill:#fff9c4
    style GH_REPOS fill:#c8e6c9
    style EPD_REPOS fill:#c8e6c9
    style PARALLEL fill:#ffe0b2
    style MERGE_LOGIC fill:#ffccbc
    style PROJECT fill:#c5cae9
```

---

## 4. Sequence Diagram - Happy Path

Detailed sequence showing successful fetch of repos + extras.

```mermaid
sequenceDiagram
    autonumber

    actor User
    participant SC as Server Component
    participant PWS as PublicWorkApplicationService
    participant GHPort as GitHubRepository (Port)
    participant EPDPort as ExtraPortfolioDescriptionRepository (Port)
    participant GHRest as GitHubRepositoryRest
    participant EPDRest as GitHubExtraDescriptionRepositoryRest
    participant GitHub as GitHub API
    participant PF as ProjectFactory

    User->>SC: Request homepage
    SC->>PWS: getAll()

    Note over PWS: Start parallel fetching

    par Fetch GitHub Repos
        PWS->>GHPort: fetchRepositories()
        GHPort->>GHRest: fetchRepositories()
        GHRest->>GitHub: GET /user/repos?per_page=30&sort=pushed
        GitHub-->>GHRest: 200 OK [repo1, repo2, ...]
        GHRest-->>GHPort: GitHubCodeRepository[]
        GHPort-->>PWS: GitHubCodeRepository[]
    and Fetch Extra Descriptions
        PWS->>EPDPort: fetchExtraDescriptions([repo1.name, repo2.name, ...])
        EPDPort->>EPDRest: fetchExtraDescriptions([...])

        loop For each repository
            EPDRest->>GitHub: GET /repos/{owner}/{repo}/contents/.portfolio-description.json
            alt File exists
                GitHub-->>EPDRest: 200 OK { content: "base64..." }
                EPDRest->>EPDRest: Decode Base64 JSON
                EPDRest->>EPDRest: Validate with Zod schema
                EPDRest->>EPDRest: Add repositoryId from context
            else File not found
                GitHub-->>EPDRest: 404 Not Found
                EPDRest->>EPDRest: Log info: "No extra description"
                EPDRest->>EPDRest: Return null for this repo
            end
        end

        EPDRest-->>EPDPort: (ExtraPortfolioDescription | null)[]
        EPDPort-->>PWS: (ExtraPortfolioDescription | null)[]
    end

    Note over PWS: Match extras with repos by repositoryId

    PWS->>PWS: Create Map<repositoryId, ExtraPortfolioDescription | null>

    PWS->>PF: fromGitHubRepositoriesWithExtras(repos, extrasMap)

    loop For each repository
        alt Has extra description
            PF->>PF: Use extra.title (override repo.name)
            PF->>PF: Merge repo.topics + extra.customTopics
            PF->>PF: Use extra.complexity || MEDIUM
            PF->>PF: Use extra.startsOpen || false
        else No extra description
            PF->>PF: Use repo.name as title
            PF->>PF: Use repo.topics (or language fallback)
            PF->>PF: Default complexity = MEDIUM
            PF->>PF: Default startsOpen = false
        end

        alt Description exists (GitHub or extra)
            PF->>PF: Create Project entity
        else No description
            PF->>PF: Log warning, return null
        end
    end

    PF-->>PWS: Project[]
    PWS->>PWS: Filter out nulls
    PWS-->>SC: Project[]
    SC->>SC: Render project cards
    SC-->>User: Display enriched projects
```

---

## 5. Sequence Diagram - Error Scenarios

Shows how the system handles various error conditions gracefully.

```mermaid
sequenceDiagram
    autonumber

    participant PWS as PublicWorkApplicationService
    participant EPDRest as GitHubExtraDescriptionRepositoryRest
    participant GitHub as GitHub API
    participant Logger as Console Logger

    Note over PWS,Logger: Scenario 1: File Not Found (404)

    PWS->>EPDRest: fetchExtraDescriptions(["repo1"])
    EPDRest->>GitHub: GET /repos/.../contents/.portfolio-description.json
    GitHub-->>EPDRest: 404 Not Found
    EPDRest->>Logger: Log info: "No extra description for repo1"
    EPDRest-->>PWS: [null]
    PWS->>PWS: Use GitHub data only for repo1 ✅

    Note over PWS,Logger: Scenario 2: Invalid JSON

    PWS->>EPDRest: fetchExtraDescriptions(["repo2"])
    EPDRest->>GitHub: GET /repos/.../contents/.portfolio-description.json
    GitHub-->>EPDRest: 200 OK { content: "invalid base64" }
    EPDRest->>EPDRest: Decode fails
    EPDRest->>Logger: Log error: "Failed to decode JSON for repo2"
    EPDRest-->>PWS: [null]
    PWS->>PWS: Use GitHub data only for repo2 ✅

    Note over PWS,Logger: Scenario 3: Schema Validation Failure

    PWS->>EPDRest: fetchExtraDescriptions(["repo3"])
    EPDRest->>GitHub: GET /repos/.../contents/.portfolio-description.json
    GitHub-->>EPDRest: 200 OK { content: "..." }
    EPDRest->>EPDRest: Decode success
    EPDRest->>EPDRest: Zod validation fails (missing required fields)
    EPDRest->>Logger: Log warning: "Invalid schema for repo3"
    EPDRest-->>PWS: [null]
    PWS->>PWS: Use GitHub data only for repo3 ✅

    Note over PWS,Logger: Scenario 4: GitHub API Rate Limit (429)

    PWS->>EPDRest: fetchExtraDescriptions(["repo4"])
    EPDRest->>GitHub: GET /repos/.../contents/.portfolio-description.json
    GitHub-->>EPDRest: 429 Too Many Requests
    EPDRest->>Logger: Log error: "Rate limit exceeded"
    EPDRest->>EPDRest: Exponential backoff retry (3 attempts)
    EPDRest->>GitHub: Retry GET /repos/.../contents/...
    GitHub-->>EPDRest: 429 Too Many Requests
    EPDRest->>Logger: Log error: "Max retries exceeded"
    EPDRest-->>PWS: [null]
    PWS->>PWS: Use cached data or skip repo4 ⚠️

    Note over PWS,Logger: Scenario 5: Missing Description (GitHub + Extra)

    PWS->>EPDRest: fetchExtraDescriptions(["repo5"])
    EPDRest->>GitHub: GET /repos/.../contents/.portfolio-description.json
    GitHub-->>EPDRest: 200 OK (no description field)
    EPDRest-->>PWS: [ExtraPortfolioDescription { description: undefined }]
    PWS->>PWS: ProjectFactory checks: repo5.description = null, extra.description = undefined
    PWS->>Logger: Log warning: "Skipping repo5: no description"
    PWS->>PWS: Return null for repo5 (filtered out) ⚠️
```

---

## 6. Class Diagram - Domain Model

Shows relationships between domain entities.

```mermaid
classDiagram
    class Project {
        +string id
        +WorkItemType type
        +string title
        +string description
        +string[] tags
        +string link
        +string? websiteUrl
        +Complexity? complexity
        +boolean? startsOpen
        +string? createdAt
        +string? updatedAt
    }

    class ExtraPortfolioDescription {
        +string repositoryId
        +string title
        +string? customDescription
        +string[]? customTopics
        +string? websiteUrl
        +Complexity? complexity
        +boolean? startsOpen
        +boolean? showEvenArchived
    }

    class GitHubCodeRepository {
        +number id
        +string name
        +string fullName
        +string? description
        +string htmlUrl
        +string[] topics
        +string createdAt
        +string updatedAt
        +string? language
        +number stargazersCount
    }

    class Complexity {
        <<enumeration>>
        EXTREME
        HIGH
        MEDIUM
        LOW
    }

    class ProjectFactory {
        +fromGitHubRepositoryWithExtras(repo, extra?) Project | null
        +fromGitHubRepository(repo) Project
        +fromGitHubRepositoriesWithExtras(repos, extrasMap) Project[]
        +fromGitHubRepositories(repos) Project[]
    }

    Project --> Complexity : has
    ExtraPortfolioDescription --> Complexity : has
    ProjectFactory --> Project : creates
    ProjectFactory --> GitHubCodeRepository : uses
    ProjectFactory --> ExtraPortfolioDescription : uses
```

---

## 7. Deployment Diagram - GitHub API Integration

Shows how the Next.js app interacts with GitHub API in production.

```mermaid
graph TB
    subgraph "Vercel/Cloud Provider"
        subgraph "Next.js App (Server-Side)"
            SSR[Server Components<br/>RSC Rendering]
            ISR[ISR Cache<br/>1-hour revalidation]
            PWS[PublicWorkApplicationService]
            GHREST[GitHubRepositoryRest]
            EPDREST[GitHubExtraDescriptionRepositoryRest]
        end

        subgraph "Edge Network"
            CDN[CDN Cache<br/>Static assets]
        end
    end

    subgraph "GitHub Infrastructure"
        GHAPI[GitHub REST API<br/>api.github.com]
        GHCDN[GitHub CDN<br/>raw.githubusercontent.com]
    end

    subgraph "Environment Variables"
        TOKEN[GITHUB_TOKEN<br/>Personal Access Token<br/>5000 req/hour]
    end

    USER[Portfolio Visitor] -->|HTTPS| CDN
    CDN -->|Cache miss| SSR
    SSR --> PWS
    PWS --> GHREST
    PWS --> EPDREST

    GHREST -->|Authenticated| GHAPI
    EPDREST -->|Authenticated| GHAPI

    TOKEN -.provides.-> GHREST
    TOKEN -.provides.-> EPDREST

    GHAPI -->|Response| GHREST
    GHAPI -->|Response| EPDREST

    GHREST --> ISR
    EPDREST --> ISR
    ISR -->|Cached response| SSR
    SSR -->|HTML| CDN
    CDN -->|HTML| USER

    style TOKEN fill:#ffcccc,stroke:#d32f2f
    style ISR fill:#fff9c4,stroke:#f57f17
    style GHAPI fill:#e8f5e9,stroke:#2e7d32
```

---

## 8. State Machine - Project Lifecycle

Shows the lifecycle of a project from fetch to render.

```mermaid
stateDiagram-v2
    [*] --> Fetching

    Fetching --> ReposFetched : GitHub repos API success
    Fetching --> FetchFailed : GitHub API error

    ReposFetched --> FetchingExtras : Parallel fetch .portfolio-description.json

    FetchingExtras --> ExtraFetched : File exists (200 OK)
    FetchingExtras --> ExtraNotFound : File missing (404)
    FetchingExtras --> ExtraInvalid : Invalid JSON/schema

    ExtraFetched --> Merging
    ExtraNotFound --> Merging
    ExtraInvalid --> Merging

    Merging --> Validating : ProjectFactory creates entity

    Validating --> Valid : Description exists
    Validating --> Invalid : Missing description

    Valid --> Rendered : Project displayed
    Invalid --> Skipped : Logged warning

    FetchFailed --> Cached : Use cached data
    FetchFailed --> Empty : No cache available

    Cached --> Rendered
    Empty --> [*]
    Skipped --> [*]
    Rendered --> [*]

    note right of Merging
        Priority order:
        1. Extra title > repo name
        2. Repo desc > extra desc
        3. Merge topics
        4. Defaults (complexity, startsOpen)
    end note
```

---

## 9. Activity Diagram - Fetch & Merge Process

Shows the step-by-step process of fetching and merging project data.

```mermaid
flowchart TD
    START([PublicWorkApplicationService.getAll]) --> INIT[Initialize Promise.allSettled]

    INIT --> PARALLEL{Start Parallel Fetch}

    PARALLEL -->|Thread 1| FETCH_REPOS[Fetch GitHub Repos<br/>GET /user/repos]
    PARALLEL -->|Thread 2| FETCH_EXTRAS[Fetch Extra Descriptions<br/>For each repo]

    FETCH_REPOS --> REPOS_SUCCESS{Success?}
    REPOS_SUCCESS -->|Yes| REPOS_DATA[Store GitHubCodeRepository array]
    REPOS_SUCCESS -->|No| REPOS_EMPTY[Log error, use empty array]

    FETCH_EXTRAS --> LOOP_START{For each repo}
    LOOP_START --> FETCH_FILE[GET /repos/.../contents/.portfolio-description.json]

    FETCH_FILE --> FILE_CHECK{Response?}
    FILE_CHECK -->|200 OK| DECODE[Decode Base64 JSON]
    FILE_CHECK -->|404| NULL_1[Return null]
    FILE_CHECK -->|Other error| LOG_ERROR[Log error] --> NULL_2[Return null]

    DECODE --> VALIDATE[Zod schema validation]
    VALIDATE -->|Valid| EXTRA_DATA[ExtraPortfolioDescription]
    VALIDATE -->|Invalid| LOG_WARN[Log warning] --> NULL_3[Return null]

    EXTRA_DATA --> LOOP_END{More repos?}
    NULL_1 --> LOOP_END
    NULL_2 --> LOOP_END
    NULL_3 --> LOOP_END

    LOOP_END -->|Yes| FETCH_FILE
    LOOP_END -->|No| EXTRAS_DONE[Extras array complete]

    REPOS_DATA --> WAIT[Wait for both threads]
    REPOS_EMPTY --> WAIT
    EXTRAS_DONE --> WAIT

    WAIT --> MAP[Create Map repositoryId → ExtraPortfolioDescription | null]

    MAP --> FACTORY[Call ProjectFactory.fromGitHubRepositoriesWithExtras]

    FACTORY --> LOOP2{For each repo}

    LOOP2 --> CHECK_EXTRA{Has extra?}

    CHECK_EXTRA -->|Yes| MERGE[Merge GitHub + extra data]
    CHECK_EXTRA -->|No| DEFAULT[Use GitHub data + defaults]

    MERGE --> TITLE_MERGE[Title = extra.title]
    DEFAULT --> TITLE_DEFAULT[Title = repo.name]

    TITLE_MERGE --> DESC_CHECK{Description?}
    TITLE_DEFAULT --> DESC_CHECK

    DESC_CHECK -->|repo.description| USE_REPO_DESC[Use repo.description]
    DESC_CHECK -->|extra.customDescription| USE_EXTRA_DESC[Use extra.customDescription]
    DESC_CHECK -->|None| SKIP_PROJECT[Log warning, return null]

    USE_REPO_DESC --> TOPICS_MERGE[Merge topics: repo + extra]
    USE_EXTRA_DESC --> TOPICS_MERGE

    TOPICS_MERGE --> WEBSITE_CHECK{Website URL?}
    WEBSITE_CHECK -->|repo.homepage| USE_REPO_WEB[Use repo.homepage]
    WEBSITE_CHECK -->|extra.websiteUrl| USE_EXTRA_WEB[Use extra.websiteUrl]
    WEBSITE_CHECK -->|None| NO_WEB[websiteUrl = undefined]

    USE_REPO_WEB --> COMPLEXITY[Complexity = extra.complexity || MEDIUM]
    USE_EXTRA_WEB --> COMPLEXITY
    NO_WEB --> COMPLEXITY

    COMPLEXITY --> STARTS[StartsOpen = extra.startsOpen || false]

    STARTS --> CREATE_PROJECT[Create Project entity]

    CREATE_PROJECT --> LOOP2_END{More repos?}
    SKIP_PROJECT --> LOOP2_END

    LOOP2_END -->|Yes| LOOP2
    LOOP2_END -->|No| FILTER[Filter out nulls]

    FILTER --> RETURN[Return Project array]
    RETURN --> END([End])

    style START fill:#e1f5ff
    style FACTORY fill:#fff9c4
    style CREATE_PROJECT fill:#c8e6c9
    style SKIP_PROJECT fill:#ffccbc
    style RETURN fill:#c5cae9
```

---

## Notes

- All diagrams use **mermaid syntax** for easy rendering in Markdown viewers (GitHub, GitLab, VS Code with mermaid extension)
- Colors follow consistent scheme:
  - **Blue** (#e1f5ff): Application Service layer
  - **Yellow** (#fff9c4): Domain layer
  - **Green** (#c8e6c9): Infrastructure layer
  - **Red** (#ffccbc): Error/skip paths
  - **Purple** (#c5cae9): Final outputs

- Diagrams can be embedded directly in the ADR or viewed separately
- Tools for rendering: Mermaid Live Editor, VS Code Mermaid Preview, GitHub/GitLab native support
