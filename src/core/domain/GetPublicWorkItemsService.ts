import { Certification } from './Certification';
import { CertificationRepositoryToken } from './CertificationRepository';
import type { CertificationRepository } from './CertificationRepository';
import { GithubCodeRepository } from './GithubCodeRepository';
import { GithubRepositoryToken } from './GithubRepository';
import type { GithubRepository } from './GithubRepository';
import { LoggerToken } from './Logger';
import type { Logger } from './Logger';
import { ProjectFactory, ProjectFactoryToken } from './ProjectFactory';
import { ArticleRepositoryToken } from './ArticleRepository';
import type { ArticleRepository } from './ArticleRepository';
import { PublicWorkItem } from './PublicWorkItem';
import { Article } from './Article';
import { Project } from './Project';
import { inject, injectable } from 'inversify';
import { DEFAULT_LOCALE, Locale } from './Locale';

const GITHUB_CODE_REPOSITORIES_IDX = 0;
const ARTICLES_IDX = 1;
const CERTIFICATIONS_IDX = 2;

@injectable()
export class GetPublicWorkItemsService {
  constructor(
    @inject(GithubRepositoryToken) private githubRepository: GithubRepository,
    @inject(ArticleRepositoryToken) private articleRepository: ArticleRepository,
    @inject(CertificationRepositoryToken) private certificationRepository: CertificationRepository,
    @inject(ProjectFactoryToken) private projectFactory: ProjectFactory,
    @inject(LoggerToken) private logger: Logger
  ) {}

  public async getAll(locale: Locale): Promise<PublicWorkItem[]> {
    const requests = await this.getRequests(locale);
    const projectRequests = this.getGithubCodeRepositories(requests).map(repo =>
      this.projectFactory.create(repo, locale)
    );
    const projects = (await Promise.all(projectRequests))
      .filter(p => p.isVisible())
      .map(this.labelWorkItemAs('project'));
    const articles = this.getArticles(requests).map(this.labelWorkItemAs('article'));
    const certifications = this.getCertifications(requests).map(
      this.labelWorkItemAs('certification')
    );
    return this.shuffleWorkItems([...projects, ...articles, ...certifications]);
  }

  private async getRequests(
    locale: Locale
  ): Promise<
    [
      PromiseSettledResult<GithubCodeRepository[]>,
      PromiseSettledResult<Article[]>,
      PromiseSettledResult<Certification[]>,
    ]
  > {
    return await Promise.allSettled([
      this.githubRepository.fetchRepositories(),
      this.fetchArticlesWithFallback(locale),
      this.fetchCertificationsWithFallback(locale),
    ]);
  }

  private async fetchArticlesWithFallback(locale: Locale): Promise<Article[]> {
    try {
      return await this.articleRepository.fetchArticles(locale);
    } catch (error) {
      if (locale !== DEFAULT_LOCALE) {
        this.logger.addBreadcrumb('Falling back to default locale for articles', {
          requestedLocale: locale,
          fallbackLocale: DEFAULT_LOCALE,
        });
        return await this.articleRepository.fetchArticles(DEFAULT_LOCALE);
      }
      throw error;
    }
  }

  private async fetchCertificationsWithFallback(locale: Locale): Promise<Certification[]> {
    try {
      return await this.certificationRepository.fetchCertifications(locale);
    } catch (error) {
      if (locale !== DEFAULT_LOCALE) {
        this.logger.addBreadcrumb('Falling back to default locale for certifications', {
          requestedLocale: locale,
          fallbackLocale: DEFAULT_LOCALE,
        });
        return await this.certificationRepository.fetchCertifications(DEFAULT_LOCALE);
      }
      throw error;
    }
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
    const articlesRequest = requests[ARTICLES_IDX];
    if (this.isFullfilled(articlesRequest)) {
      return (articlesRequest as PromiseFulfilledResult<Article[]>).value;
    }
    this.logger.error(new Error('Failed to fetch articles'), {
      reason: articlesRequest.status === 'rejected' ? articlesRequest.reason : undefined,
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

  private labelWorkItemAs<T extends Project | Article | Certification>(
    type: PublicWorkItem['workItemType']
  ): (item: T) => PublicWorkItem {
    return (item: T): PublicWorkItem =>
      ({
        ...item,
        workItemType: type,
      }) as PublicWorkItem;
  }

  private isFullfilled<T>(result: PromiseSettledResult<T>): boolean {
    return result.status === 'fulfilled';
  }
}

export const GetPublicWorkItemsServiceToken = Symbol.for('GetPublicWorkItemsService');
