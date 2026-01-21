import { inject, injectable } from 'inversify';
import { GithubRepository } from '@/core/domain/GithubRepository';
import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';
import { ExtraPortfolioDescription } from '@/core/domain/ExtraPortfolioDescription';
import { Complexity } from '@/core/domain/Complexity';
import type { Logger } from '@/core/domain/Logger';
import { LoggerToken } from '@/core/domain/Logger';

const EXTRA_PORTFOLIO_DESCRIPTION_PATH = 'portfolio-description.json';

@injectable()
export class GithubRepositoryRest implements GithubRepository {
  private readonly username = 'bagnascojhoel';
  private readonly baseUrl = 'https://api.github.com';
  private token = process.env.GITHUB_TOKEN;

  constructor(@inject(LoggerToken) private logger: Logger) {}

  async fetchRepositories(): Promise<GithubCodeRepository[]> {
    const url = `${this.baseUrl}/users/${this.username}/repos?per_page=100&sort=pushed&direction=desc`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : '',
          Accept: 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      if (!response.ok) {
        this.logger.error(new Error(`Failed to fetch GitHub repositories`), {
          status: response.status,
          statusText: response.statusText,
          username: this.username,
        });
        throw new Error(`GitHub API request failed with status ${response.status}`);
      }

      const repos = await response.json();

      // Convert raw JSON to domain objects via infrastructure adapter
      const { GithubCodeRepositoryJson } =
        await import('@/core/infrastructure/GithubCodeRepositoryJson');

      return repos.map((r: unknown) => new GithubCodeRepositoryJson(r).toDomain());
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error('Failed to fetch GitHub repositories'),
        { username: this.username }
      );
      throw error;
    }
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
      this.logger.warn(`GitHub rate limit or forbidden when fetching ${owner}/${repo}`, {
        status: res.status,
        owner,
        repo,
      });
      return null;
    }

    if (!res.ok) {
      this.logger.error(
        new Error(`Failed to fetch extra portfolio description from ${owner}/${repo}`),
        { status: res.status, owner, repo }
      );
      return null;
    }

    try {
      const text = await res.text();
      const jsonResponse = JSON.parse(text);
      return this.createExtraPortfolioDescription(jsonResponse);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error('Failed to parse extra portfolio description'),
        { owner, repo }
      );
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
