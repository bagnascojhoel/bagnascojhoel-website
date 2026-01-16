import { inject, injectable } from 'inversify';
import { Certification } from '@/core/domain/Certification';
import type { GitHubRepository } from '@/core/domain/GitHubRepository';
import type { NotionRepository } from '@/core/domain/NotionRepository';
import type { CertificationRepository } from '@/core/domain/CertificationRepository';
import { GitHubRepositoryToken } from '@/core/domain/GitHubRepository';
import { NotionRepositoryToken } from '@/core/domain/NotionRepository';
import { CertificationRepositoryToken } from '@/core/domain/CertificationRepository';
import { ProjectFactory } from '@/core/domain/ProjectFactory';
import { ArticleFactory } from '@/core/domain/ArticleFactory';
import { PublicWorkItem } from '@/core/domain/PublicWorkItem';
import { GitHubCodeRepository } from '@/core/domain/GitHubCodeRepository';
import { NotionPage } from '@/core/domain/NotionPage';

@injectable()
export class PublicWorkApplicationService {
  constructor(
    @inject(GitHubRepositoryToken) private githubRepo: GitHubRepository,
    @inject(NotionRepositoryToken) private notionRepo: NotionRepository,
    @inject(CertificationRepositoryToken) private certificationRepo: CertificationRepository
  ) {}

  async getAll(): Promise<PublicWorkItem[]> {
    const results = await Promise.allSettled([
      this.githubRepo.fetchRepositories(),
      this.notionRepo.fetchPages(),
      this.certificationRepo.fetchCertifications(),
    ]);

    const githubRes = results[0];
    const notionRes = results[1];
    const certsRes = results[2];

    const projects = this.isFullfilled(githubRes)
      ? ProjectFactory.fromGitHubRepositories(
          (githubRes as PromiseFulfilledResult<GitHubCodeRepository[]>).value
        )
      : [];

    const articles = this.isFullfilled(notionRes)
      ? ArticleFactory.fromNotionPages((notionRes as PromiseFulfilledResult<NotionPage[]>).value)
      : [];

    const certs = this.isFullfilled(certsRes)
      ? (certsRes as PromiseFulfilledResult<Certification[]>).value
      : [];

    return [...projects, ...articles, ...certs];
  }

  private isFullfilled<T>(result: PromiseSettledResult<T>): boolean {
    return result.status === 'fulfilled';
  }
}

export const PublicWorkApplicationServiceToken = 'PublicWorkApplicationService';
