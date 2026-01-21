import { inject, injectable } from 'inversify';
import { Certification } from '@/core/domain/Certification';
import type { GithubRepository } from '@/core/domain/GithubRepository';
import type { NotionRepository } from '@/core/domain/NotionRepository';
import type { CertificationRepository } from '@/core/domain/CertificationRepository';
import type { Logger } from '@/core/domain/Logger';
import { GithubRepositoryToken } from '@/core/domain/GithubRepository';
import { NotionRepositoryToken } from '@/core/domain/NotionRepository';
import { CertificationRepositoryToken } from '@/core/domain/CertificationRepository';
import { LoggerToken } from '@/core/domain/Logger';
import { ProjectFactory, ProjectFactoryToken } from '@/core/domain/ProjectFactory';
import { ArticleFactory } from '@/core/domain/ArticleFactory';
import { PublicWorkItem } from '@/core/domain/PublicWorkItem';
import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';
import { NotionPage } from '@/core/domain/NotionPage';

const GITHUB_CODE_REPOSITORIES_IDX = 0;
const NOTION_PAGES_IDX = 1;
const CERTIFICATIONS_IDX = 2;

@injectable()
export class PublicWorkApplicationService {
  private cache: { timestamp: number; items: PublicWorkItem[] } | null = null;
  private readonly cacheTtlMs: number = Number(process.env.PUBLIC_WORK_CACHE_TTL_MS || 3600000);

  constructor(
    @inject(GithubRepositoryToken) private githubRepository: GithubRepository,
    @inject(NotionRepositoryToken) private notionRepository: NotionRepository,
    @inject(CertificationRepositoryToken) private certificationRepository: CertificationRepository,
    @inject(ProjectFactoryToken)
    private projectFactory: ProjectFactory,
    @inject(LoggerToken) private logger: Logger
  ) {}

  async getAll(): Promise<PublicWorkItem[]> {
    const now = Date.now();
    if (this.cache && now - this.cache.timestamp < this.cacheTtlMs) {
      this.logger.addBreadcrumb('PublicWork cache hit');
      return this.cache.items;
    }

    this.logger.addBreadcrumb('Fetching public work items', {
      cacheTtlMs: this.cacheTtlMs,
    });

    // Fetch repositories, pages, certifications and extras in parallel
    const fetches: PromiseSettledResult<unknown>[] = await Promise.allSettled([
      this.githubRepository.fetchRepositories(),
      this.notionRepository.fetchPages(),
      this.certificationRepository.fetchCertifications(),
    ]);

    // Log any failures
    if (fetches[GITHUB_CODE_REPOSITORIES_IDX].status === 'rejected') {
      this.logger.error(new Error('Failed to fetch GitHub repositories'), {
        reason: fetches[GITHUB_CODE_REPOSITORIES_IDX].reason,
      });
    }
    if (fetches[NOTION_PAGES_IDX].status === 'rejected') {
      this.logger.error(new Error('Failed to fetch Notion pages'), {
        reason: fetches[NOTION_PAGES_IDX].reason,
      });
    }
    if (fetches[CERTIFICATIONS_IDX].status === 'rejected') {
      this.logger.error(new Error('Failed to fetch certifications'), {
        reason: fetches[CERTIFICATIONS_IDX].reason,
      });
    }

    const result: PublicWorkItem[] = [];

    if (this.isFullfilled(fetches[GITHUB_CODE_REPOSITORIES_IDX])) {
      const githubRepositories: PromiseFulfilledResult<GithubCodeRepository[]> = fetches[
        GITHUB_CODE_REPOSITORIES_IDX
      ] as PromiseFulfilledResult<GithubCodeRepository[]>;
      const projects = this.projectFactory
        .createAll(githubRepositories.value)
        .filter(p => !p.hasEmptyDescription());

      result.push(...projects.map(r => ({ ...r, workItemType: 'project' }) as PublicWorkItem));
    }

    if (this.isFullfilled(fetches[NOTION_PAGES_IDX])) {
      const notionPages: PromiseFulfilledResult<NotionPage[]> = fetches[
        NOTION_PAGES_IDX
      ] as PromiseFulfilledResult<NotionPage[]>;
      const articles = ArticleFactory.fromNotionPages(notionPages.value);

      result.push(...articles.map(p => ({ ...p, workItemType: 'article' }) as PublicWorkItem));
    }

    if (this.isFullfilled(fetches[CERTIFICATIONS_IDX])) {
      const certifications: PromiseFulfilledResult<Certification[]> = fetches[
        CERTIFICATIONS_IDX
      ] as PromiseFulfilledResult<Certification[]>;

      result.push(
        ...certifications.value.map(
          c => ({ ...c, workItemType: 'certification' }) as PublicWorkItem
        )
      );
    }

    // Shuffle the result array to interleave items of different types
    this.shuffleWorkItems(result);

    // cache result
    this.cache = { timestamp: now, items: result };
    this.logger.addBreadcrumb('PublicWork cache updated', {
      itemCount: result.length,
    });

    return result;
  }

  /**
   * Shuffles an array in place using the Fisher-Yates algorithm
   */
  private shuffleWorkItems<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private isFullfilled<T>(result: PromiseSettledResult<T>): boolean {
    return result.status === 'fulfilled';
  }
}

export const PublicWorkApplicationServiceToken = 'PublicWorkApplicationService';
