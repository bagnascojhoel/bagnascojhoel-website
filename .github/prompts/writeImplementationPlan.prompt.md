---
description: 'Create an implementation plan for an ADR with files to be changed and references to supporting documentation or existing files'
agent: Architect
---

# Write Implementation Plan for ADR

Your goal is to create a reproducible implementation plan for a given ADR. The plan should outline all necessary changes to the codebase, including new files to be created, existing files to be modified, and references to supporting documentation or existing files that can serve as patterns.

Consider that the output document will be used by AI Agents to implement the changes and as support for future implementations. It will also be used by human reviewers to validate the implementation.

## Phase Architecture

- Each phase must have measurable completion criteria
- Tasks within phases must be executable in parallel unless dependencies are specified
- All task descriptions must include specific file paths, function names, and exact implementation details
- No task should require human interpretation or decision-making

## AI-Optimized Implementation Standards

- Use explicit, unambiguous language with zero interpretation required
- Structure all content as machine-parseable formats (tables, lists, structured data)
- Include specific file paths, line numbers, and exact code references where applicable
- Define all variables, constants, and configuration values explicitly
- Provide complete context within each task description
- Use standardized prefixes for all identifiers (REQ-, TASK-, etc.)
- Include validation criteria that can be automatically verified

## Testing Guidelines

- There are three types of tests: Component Tests, Integration Tests, and End-to-End Tests
- **Component Tests** MUST test individual React components in isolation using React Testing Library
- **Integration Tests** MUST test API routes, server actions, and data fetching logic while mocking external services
- **End-to-End Tests** MUST validate happy-path scenarios using Playwright, testing the full user flow including SSR/hydration
- All tests MUST be comprehensive and cover all use cases described in the ADR
- Tests MUST reference test fixtures/factories to be used for test data setup
- Component and Integration tests MUST be written using TDD approach
- E2E tests should validate the complete user experience including accessibility requirements from `.ai/ui-ux-rules.md`

## SSR Considerations

- Clearly distinguish between Server Components and Client Components
- Document data fetching strategies (SSR, SSG, ISR, Client-side)
- Consider hydration boundaries and potential mismatches
- Account for performance implications (bundle size, initial load time)
- Ensure proper error boundaries for both server and client errors
- Consider SEO implications and metadata requirements

## Output

You need to write a new markdown file named `<ADR-ID>.implementation-plan.md`, where `<ADR-ID>` is the ID of the ADR you are creating the implementation plan for. The file should be placed in the same directory as the ADR.

<plan_style_guide>
The below template defines the mandatory structure of the implementation plan file you need to generate.

There are some meta instructions on the template that you must NOT write in the final template, but rather follow their instructions while filling the sections they appear on. The meta instructions are:

- Optional: if a section should be or not included in the final plan
- Content: guidelines you need to follow when filling the section

```
# Implementation Plan for ADR <ADR-ID>

### 1. Test Changes
**Optional:** If not necessary, write "None required for this section."

#### Content:
- List all new and changed test files with their full paths.
- For each test file, add references to documentation or existing files that should be used as patterns.
- **Include test descriptions and key scenarios to be covered.**
- Include at least one E2E test scenario to validate the happy-path of each feature.
- Most tests should be Component or Integration tests.
- Component tests should focus on user interactions, accessibility, and visual states.
- Integration tests should validate API routes, server actions, and data flows.
- Include references to test fixtures/factories to be used.
- For UI components, specify accessibility requirements to test (keyboard navigation, ARIA labels, contrast ratios).

### 2. Test Fixtures/Factories
**Optional:** If not necessary, write "None required for this section."

#### Content:
- List all new and changed test data files with their full paths.
- For each file, add references to documentation or existing files that should be used as patterns.
- Each fixture MUST build a consistent set of data to represent the domain and be used across tests.
- Include mock data for API responses, component props, and user interactions.

### 3. Implementation Phases

#### Content:
- Component and Integration Tests MUST be implemented using TDD in phase 1
- If E2E tests are required, they MUST be implemented using TDD in phase 2
- The other steps in the implementation plan SHOULD be after test phases
- UI/UX validation MUST occur before final deployment

#### Implementation Phase 1

- GOAL-001: [Describe the goal of this phase, e.g., "Implement feature X component", "Add API route for Y", etc.]
- Impacted layers: [e.g., Components, API Routes, Services]
- Impacted files: [List specific file paths]

#### Implementation Phase 2

- GOAL-002: [Describe the goal of this phase]
- Impacted layers: [e.g., Pages, Server Components, Utilities]
- Impacted files: [List specific file paths]

### 4. Data Layer Changes
**Optional:** If not necessary, write "None required for this implementation."

#### Content:
**Description:** 1 sentence describing data layer changes needed (database schema, external API integrations, etc.).
**Changes:**
- List files to be created or updated with their paths and brief descriptions.
- For database schemas (Prisma, Drizzle, etc.), include model/table changes.
- For API integrations, specify endpoints, request/response types, and error handling.
- Include data validation schemas (Zod, Yup, etc.).
- Describe migration procedures and rollback strategies if applicable.

### 5. Dependencies Changes
**Optional:** If not necessary, write "None required for this implementation."

#### Content:
Describe the rationale for any new dependencies or upgrades, including:
- Why existing dependencies cannot fulfill the need
- Bundle size impact
- SSR compatibility considerations
- Licensing and security considerations

### 6. Source Code Changes
**Optional:** If not necessary, write "None required for this implementation."

#### Content:
- Describe impacted modules and why they are affected.
- Specify which code runs on server vs client.

#### 6.1 Pages/Routes
**Optional:** If not necessary, write "None required for this layer."

##### Content:
- List all new and changed page/route files with their full paths (app router or pages router).
- For each file, specify if it's a Server Component, Client Component, or API Route.
- Include data fetching strategy (SSR, SSG, ISR, client-side).
- List metadata configuration (title, description, Open Graph tags).
- Add references to documentation or existing files that should be used as patterns.

#### 6.2 Components
**Optional:** If not necessary, write "None required for this layer."

##### Content:
- List all new and changed component files with their full paths.
- For each component, specify if it's a Server Component or Client Component (`'use client'`).
- Include props interface/type definitions.
- Specify accessibility requirements (ARIA labels, keyboard navigation, focus management).
- List UI/UX rules from `.ai/ui-ux-rules.md` that apply.
- Add references to documentation or existing files that should be used as patterns.

#### 6.3 API Routes & Server Actions
**Optional:** If not necessary, write "None required for this layer."

##### Content:
- List all new and changed API route/server action files with their full paths.
- For each endpoint, include HTTP methods, request/response schemas, and validation rules.
- Specify authentication/authorization requirements.
- Include error handling strategies and status codes.
- Add references to documentation or existing files that should be used as patterns.

#### 6.4 Services & Utilities
**Optional:** If not necessary, write "None required for this layer."

##### Content:
- List all new and changed service/utility files with their full paths.
- Specify if these run on server-only, client-only, or both.
- Include function signatures and return types.
- Add references to documentation or existing files that should be used as patterns.

#### 6.5 Types & Schemas
**Optional:** If not necessary, write "None required for this layer."

##### Content:
- List all new and changed TypeScript type/interface/schema files with their full paths.
- Include validation schemas (Zod, Yup, etc.) if applicable.
- Specify shared types between server and client.

#### 6.6 Styles & Assets
**Optional:** If not necessary, write "None required for this layer."

##### Content:
- List all new and changed CSS/SCSS modules, Tailwind classes, or styled-components.
- Include responsive breakpoints and design tokens used.
- Specify dark mode considerations if applicable.
- List any new images, icons, or other assets with optimization requirements (WebP, SVG, etc.).

#### 6.7 Configuration
**Optional:** If not necessary, write "None required for this layer."

##### Content:
- List changes to `next.config.js`, `tsconfig.json`, environment variables, etc.
- Include purpose and impact of each configuration change.
- Specify any build-time vs runtime implications.

## 7. Documentation Changes
**Optional:** If not necessary, write "None required for this implementation."

#### Content:
- List all new and changed documentation files with their full paths.
- For each documentation file, add references to existing files that should be used as patterns.
- Include Storybook stories if component library documentation is needed.
- Update README or API documentation as needed.

## 8. UI/UX Validation
**Optional:** If not necessary, write "None required for this section."

#### Content:
- List specific UI/UX rules from `.ai/ui-ux-rules.md` that must be validated.
- Include accessibility checklist items (WCAG 2.1 compliance, keyboard navigation, screen reader testing).
- Specify responsive breakpoints to test.
- Include performance metrics to validate (Core Web Vitals: LCP, FID, CLS).
- List cross-browser testing requirements.

## 9. Risks & Assumptions

[List any risks or assumptions related to the implementation of the plan.]

- **RISK-001**: [e.g., "SSR hydration mismatch could occur if client state differs from server state"]
- **ASSUMPTION-001**: [e.g., "External API will maintain backward compatibility"]
- **RISK-002**: [e.g., "Large bundle size increase could impact initial load time"]
```

</plan_style_guide>

## Validation

DO NOT OUTPUT ANY OF THESE VALIDATIONS IN THE FINAL IMPLEMENTATION PLAN.

- Ensure that the implementation plan is clear, concise, and free of ambiguity.
- Verify that all necessary sections are included and properly formatted.
- Confirm that all referenced files and documentation exist and are accessible.
- Check for consistency in terminology and style throughout the document.
- Validate that the plan aligns with the goals and constraints outlined in the ADR.
- Verify SSR considerations are properly documented (server/client boundaries, hydration).
- Confirm UI/UX requirements from `.ai/ui-ux-rules.md` are addressed.
- Ensure accessibility requirements are specified for all UI components.
