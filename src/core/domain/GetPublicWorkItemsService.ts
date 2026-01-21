import { Certification } from './Certification';
import { CertificationRepositoryToken } from './CertificationRepository';
import type { CertificationRepository } from './CertificationRepository';
import { GithubCodeRepository } from './GithubCodeRepository';
import { GithubRepositoryToken } from './GithubRepository';
import type { GithubRepository } from './GithubRepository';
import { LoggerToken } from './Logger';
import type { Logger } from './Logger';
import { ProjectFactory, ProjectFactoryToken } from './ProjectFactory';
import { NotionRepositoryToken } from './NotionRepository';
import type { NotionRepository } from './NotionRepository';
import { PublicWorkItem } from './PublicWorkItem';
import { Article } from './Article';
import { inject, injectable } from 'inversify';

const GITHUB_CODE_REPOSITORIES_IDX = 0;
const NOTION_PAGES_IDX = 1;
const CERTIFICATIONS_IDX = 2;

@injectable()
export class GetPublicWorkItemsService {
  constructor(
    @inject(GithubRepositoryToken) private githubRepository: GithubRepository,
    @inject(NotionRepositoryToken) private notionRepository: NotionRepository,
    @inject(CertificationRepositoryToken) private certificationRepository: CertificationRepository,
    @inject(ProjectFactoryToken) private projectFactory: ProjectFactory,
    @inject(LoggerToken) private logger: Logger
  ) {}

  public async getAll(): Promise<PublicWorkItem[]> {
    const requests = await this.getRequests();
    const projects = this.getGithubCodeRepositories(requests)
      .map(this.projectFactory.create)
      .filter(p => p.isVisible())
      .map(this.labelWorkItemAs('project'));
    const articles = this.getArticles(requests).map(this.labelWorkItemAs('article'));
    const certifications = this.getCertifications(requests).map(
      this.labelWorkItemAs('certification')
    );
    return this.shuffleWorkItems([...projects, ...articles, ...certifications]);
  }

  private async getRequests(): Promise<
    [
      PromiseSettledResult<GithubCodeRepository[]>,
      PromiseSettledResult<Article[]>,
      PromiseSettledResult<Certification[]>,
    ]
  > {
    return await Promise.allSettled([
      this.githubRepository.fetchRepositories(),
      this.notionRepository.fetchArticles(),
      this.certificationRepository.fetchCertifications(),
    ]);
  }

  private getGithubCodeRepositories(
    requests: PromiseSettledResult<unknown>[]
  ): GithubCodeRepository[] {
    const githubRequest = requests[GITHUB_CODE_REPOSITORIES_IDX];
    if (this.isFullfilled(githubRequest)) {
      return (githubRequest as PromiseFulfilledResult<GithubCodeRepository[]>).value;
    }
    this.logger.error(new Error('Failed to fetch GitHub repositories'), {
      reason: githubRequest.status === 'rejected' ? githubRequest.reason : undefined,
    });
    return [];
  }

  private getArticles(requests: PromiseSettledResult<unknown>[]): Article[] {
    const notionRequest = requests[NOTION_PAGES_IDX];
    if (this.isFullfilled(notionRequest)) {
      return (notionRequest as PromiseFulfilledResult<Article[]>).value;
    }
    this.logger.error(new Error('Failed to fetch Notion pages'), {
      reason: notionRequest.status === 'rejected' ? notionRequest.reason : undefined,
    });
    return [];
  }

  private getCertifications(requests: PromiseSettledResult<unknown>[]): Certification[] {
    const certificationRequest = requests[CERTIFICATIONS_IDX];
    if (this.isFullfilled(certificationRequest)) {
      return (certificationRequest as PromiseFulfilledResult<Certification[]>).value;
    }
    this.logger.error(new Error('Failed to fetch certifications'), {
      reason: certificationRequest.status === 'rejected' ? certificationRequest.reason : undefined,
    });
    return [];
  }

  private shuffleWorkItems(array: PublicWorkItem[]): PublicWorkItem[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private labelWorkItemAs(
    type: PublicWorkItem['workItemType']
  ): (item: Omit<PublicWorkItem, 'workItemType'>) => PublicWorkItem {
    return (item: Omit<PublicWorkItem, 'workItemType'>): PublicWorkItem => ({
      ...item,
      workItemType: type,
    });
  }

  private isFullfilled<T>(result: PromiseSettledResult<T>): boolean {
    return result.status === 'fulfilled';
  }
}

export const GetPublicWorkItemsServiceToken = 'GetPublicWorkItemsService';
