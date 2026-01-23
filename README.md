# BagnascoJhoel Website

A modern portfolio website built with Next.js 14, showcasing projects, articles, and certifications.

## Features

- **Portfolio Projects**: Displays GitHub repositories with optional custom descriptions.
- **Articles**: Blog posts fetched from Notion.
- **Certifications**: Professional certifications with links.
- **Internationalization**: Supports English and Portuguese (Brazil).
- **Responsive Design**: Mobile-first with Tailwind CSS.
- **Animations**: Smooth transitions using Framer Motion.
- **Accessibility**: WCAG 2.1 compliant.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Architecture**: Hexagonal Architecture (Ports & Adapters)
- **DI**: InversifyJS
- **i18n**: next-intl
- **Testing**: Vitest
- **Linting**: ESLint
- **Formatting**: Prettier

## Architecture

The project follows Hexagonal Architecture:

- **Domain**: Core business logic and entities.
- **Application Services**: Use cases and orchestration.
- **Infrastructure**: Adapters for external services (GitHub, Notion, etc.).

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bagnascojhoel/bagnascojhoel-website.git
   cd bagnascojhoel-website
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- **Linting**: `npm run lint`
- **Formatting**: `npm run format`
- **Testing**: `npm test`
- **Coverage**: `npm run test:coverage`

## Deployment

Deploy to Vercel or any platform supporting Next.js.

## Extra portfolio descriptions

- The site supports optional `.portfolio-description.json` files in individual GitHub repositories
  to provide richer metadata for projects (custom title, tags, website, complexity, etc.).

### Schema

The `.portfolio-description.json` file should conform to the following TypeScript interface:

```typescript
interface ExtraPortfolioDescription {
  title: string; // Required: Custom title for the project
  customDescription?: string; // Optional: Custom description
  customTopics?: string[]; // Optional: Array of custom topic strings
  websiteUrl?: string; // Optional: URL to the project's website
  complexity?: 'extreme' | 'high' | 'medium' | 'low'; // Optional: Project complexity level
  startsOpen?: boolean; // Optional: Whether the project details start expanded
  showEvenArchived?: boolean; // Optional: Show even if repository is archived
  isHidden?: boolean; // Optional: Hide the project from the portfolio
}
```

## To Do's

- Certifications should have a link to the certification badge/certificate.
- Use the startsOpen flag from portfolio-description.json.
- Introduce a ignore flag on portfolio-description.json that makes the project ignored.
- Update project README.
- Localization in PT-BR of projects.
- Add google analytics or similar to track accesses.
- Links from articles should take to the actual article.
- The ADRs are beign generated too verbosely. And other files, besides the ADR, were created.
- The implementation plans are not being split amongst files.
