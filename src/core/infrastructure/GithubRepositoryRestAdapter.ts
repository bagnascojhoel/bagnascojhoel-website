import { inject, injectable } from 'inversify';
import { GithubRepository } from '@/core/domain/GithubRepository';
import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';
import { ExtraPortfolioDescription } from '@/core/domain/ExtraPortfolioDescription';
import { Complexity } from '@/core/domain/Complexity';
import type { Logger } from '@/core/domain/Logger';
import { LoggerToken } from '@/core/domain/Logger';
import { Locale } from '@/core/domain/Locale';
import { GithubCodeRepositoryJson } from '@/core/infrastructure/GithubCodeRepositoryJson';
import { ExternalServiceError } from '@/core/domain/ExternalServiceError';

@injectable()
export class GithubRepositoryRestAdapter implements GithubRepository {
  private readonly username = 'bagnascojhoel';
  private readonly baseUrl = 'https://api.github.com';
  private readonly token = process.env.GITHUB_TOKEN;
  private readonly baseHeaders = {
    Authorization: this.token ? `Bearer ${this.token}` : '',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  constructor(@inject(LoggerToken) private logger: Logger) {}

  async fetchRepositories(): Promise<GithubCodeRepository[]> {
    const url = `${this.baseUrl}/users/${this.username}/repos?per_page=100&sort=pushed&direction=desc`;
    let response: Response;
    try {
      response = await fetch(url, {
        headers: { ...this.baseHeaders, Accept: 'application/vnd.github.v3+json' },
      });
    } catch {
      const serviceError = new ExternalServiceError(
        'Failed to fetch GitHub repositories',
        'GitHub API',
        { username: this.username }
      );
      this.logger.error(serviceError, { username: this.username });
      throw serviceError;
    }
    if (!response.ok) {
      const error = new ExternalServiceError(`Failed to fetch GitHub repositories`, 'GitHub API', {
        status: response.status,
        statusText: response.statusText,
        username: this.username,
      });
      this.logger.error(error, {
        status: response.status,
        statusText: response.statusText,
        username: this.username,
      });
      throw error;
    }
    const repos = await response.json();
    return repos.map((r: unknown) => new GithubCodeRepositoryJson(r).toDomain());
  }

  async fetchExtraPortfolioDescription(
    owner: string,
    repo: string,
    locale: Locale
  ): Promise<ExtraPortfolioDescription | null> {
    const filename = `portfolio-description_${locale}.json`;
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${filename}`;
    const res = await fetch(url, {
      headers: { ...this.baseHeaders, Accept: 'application/vnd.github.v3.raw' },
    });
    if (res.status === 404) return null;
    if (res.status === 403) {
      this.logger.warn(`GitHub rate limit or forbidden when fetching ${owner}/${repo}`, {
        status: res.status,
        owner,
        repo,
        locale,
      });
      return null;
    }
    if (!res.ok) {
      this.logger.error(
        new ExternalServiceError(
          `Failed to fetch extra portfolio description from ${owner}/${repo}`,
          'GitHub API',
          { status: res.status, owner, repo, locale }
        ),
        { status: res.status, owner, repo, locale }
      );
      return null;
    }
    return this.createExtraPortfolioDescription(res, owner, repo, locale);
  }

  private async createExtraPortfolioDescription(
    res: Response,
    owner: string,
    repo: string,
    locale: Locale
  ): Promise<ExtraPortfolioDescription | null> {
    try {
      const text = await res.text();
      const jsonResponse = JSON.parse(text);
      const d = jsonResponse as {
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
    } catch (error) {
      this.logger.error(
        error instanceof Error
          ? error
          : new ExternalServiceError('Failed to parse extra portfolio description', 'GitHub API', {
              owner,
              repo,
              locale,
            }),
        { owner, repo, locale }
      );
      return null;
    }
  }
}
