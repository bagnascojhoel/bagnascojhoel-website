import { injectable } from 'inversify';
import { GithubRepository } from '@/core/domain/GithubRepository';
import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';
import { ExtraPortfolioDescription } from '@/core/domain/ExtraPortfolioDescription';
import { Complexity } from '@/core/domain/Complexity';

const EXTRA_PORTFOLIO_DESCRIPTION_PATH = 'portfolio-description.json';

@injectable()
export class GithubRepositoryRest implements GithubRepository {
  private readonly username = 'bagnascojhoel';
  private readonly baseUrl = 'https://api.github.com';
  private token = process.env.GITHUB_TOKEN;

  async fetchRepositories(): Promise<GithubCodeRepository[]> {
    // Mocked response - replace with real GitHub API integration
    const raw = [
      {
        id: 123456,
        name: 'kwik-ecommerce',
        fullName: 'bagnascojhoel/kwik-ecommerce',
        description: 'Ecommerce application built with Java 17, Spring Boot, and Postgres',
        htmlUrl: 'https://github.com/bagnascojhoel/kwik-ecommerce',
        topics: ['spring-boot', 'react', 'typescript', 'aws'],
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2024-12-01T15:30:00Z',
        language: 'Java',
        stargazersCount: 5,
      },
      {
        id: 789012,
        name: 'portfolio-website-monorepo',
        fullName: 'bagnascojhoel/portfolio-website-monorepo',
        description: 'Monorepo including front-end, BFF, and blog',
        htmlUrl: 'https://github.com/bagnascojhoel/portfolio-website-monorepo',
        topics: ['java', 'svelte', 'monorepo'],
        createdAt: '2023-06-20T08:00:00Z',
        updatedAt: '2024-11-15T12:00:00Z',
        language: 'TypeScript',
        stargazersCount: 3,
      },
    ];

    // Convert raw JSON to domain objects via infrastructure adapter
    const { GithubCodeRepositoryJson } = await import(
      '@/core/infrastructure/GithubCodeRepositoryJson'
    );

    return raw.map(r => new GithubCodeRepositoryJson(r).toDomain());
  }

  async fetchExtraPortfolioDescription(
    owner: string,
    repo: string
  ): Promise<ExtraPortfolioDescription | null> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${EXTRA_PORTFOLIO_DESCRIPTION_PATH}`;

    const res = await fetch(url, {
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : '',
        Accept: 'application/vnd.github.v3.raw',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (res.status === 404) return null;
    if (res.status === 403) {
      // eslint-disable-next-line no-console
      console.warn(`GitHub rate limit or forbidden when fetching ${owner}/${repo}: ${res.status}`);
      return null;
    }

    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error(
        `Error fetching extra-portfolio-description file ${owner}/${repo}: ${res.status}`
      );
      return null;
    }

    try {
      const text = await res.text();
      const jsonResponse = JSON.parse(text);
      return this.createExtraPortfolioDescription(jsonResponse);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to read response as text', error);
      return null;
    }
  }

  private createExtraPortfolioDescription(data: unknown): ExtraPortfolioDescription {
    const d = data as {
      title?: string;
      description?: string;
      tags?: string[];
      websiteUrl?: string;
      startsOpen?: boolean;
      complexity?: Complexity;
      showEvenArchived?: boolean;
    };
    
    return {
      title: d.title ?? '',
      customDescription: d.description,
      customTopics: d.tags || [],
      websiteUrl: d.websiteUrl,
      startsOpen: d.startsOpen,
      complexity: d.complexity,
      showEvenArchived: d.showEvenArchived || false,
    };
  }
}
