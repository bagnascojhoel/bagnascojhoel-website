import { injectable } from 'inversify';
import { GitHubRepository as GitHubPort } from '@/core/domain/GitHubRepository';
import { GitHubCodeRepository as GitHubRepoModel } from '@/core/domain/GitHubCodeRepository';

@injectable()
export class GitHubRepositoryRest implements GitHubPort {
  private readonly username = 'bagnascojhoel';
  private readonly baseUrl = 'https://api.github.com';

  async fetchRepositories(): Promise<GitHubRepoModel[]> {
    // Mocked response - replace with real GitHub API integration
    return [
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
  }
}
