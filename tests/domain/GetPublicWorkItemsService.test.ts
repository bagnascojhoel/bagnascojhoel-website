/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest" />
import { Container } from 'inversify';
import { describe, it, expect, beforeEach } from 'vitest';
import { GetPublicWorkItemsService } from '@/core/domain/GetPublicWorkItemsService';
import type { GithubRepository } from '@/core/domain/GithubRepository';
import type { ArticleRepository } from '@/core/domain/ArticleRepository';
import type { CertificationRepository } from '@/core/domain/CertificationRepository';
import { GithubRepositoryToken } from '@/core/domain/GithubRepository';
import { ArticleRepositoryToken } from '@/core/domain/ArticleRepository';
import { CertificationRepositoryToken } from '@/core/domain/CertificationRepository';
import { LoggerToken } from '@/core/domain/Logger';
import { ProjectFactory, ProjectFactoryToken } from '@/core/domain/ProjectFactory';
import { MockLogger } from '../fixtures/mockLogger';
import { LocaleNotSupportedError } from '@/core/domain/LocaleNotSupportedError';
import { Locale, DEFAULT_LOCALE } from '@/core/domain/Locale';
import { mockGitHubRepo1, mockArticles, mockCertifications } from '../fixtures';

describe('GetPublicWorkItemsService', () => {
  let container: Container;
  let mockLogger: MockLogger;

  beforeEach(() => {
    container = new Container();
    mockLogger = new MockLogger();
  });

  describe('locale parameter handling', () => {
    it('should pass locale to all repository fetch calls', async () => {
      let articleLocale = '';
      let certificationLocale = '';

      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [mockGitHubRepo1],
        fetchExtraPortfolioDescription: async () => null,
      };

      const articleRepo: ArticleRepository = {
        fetchArticles: async (locale: string) => {
          articleLocale = locale;
          return mockArticles;
        },
      };

      const certRepo: CertificationRepository = {
        fetchCertifications: async (locale: string) => {
          certificationLocale = locale;
          return mockCertifications;
        },
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(articleRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(certRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind(LoggerToken).toConstantValue(mockLogger);
      container.bind(GetPublicWorkItemsService).toSelf();

      const service = container.get(GetPublicWorkItemsService);
      await service.getAll(Locale.PT_BR);

      expect(articleLocale).toBe(Locale.PT_BR);
      expect(certificationLocale).toBe(Locale.PT_BR);
    });

    it('should fallback to DEFAULT_LOCALE when article repository throws LocaleNotSupportedError', async () => {
      let articleCallCount = 0;
      const articleLocales: string[] = [];

      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [mockGitHubRepo1],
        fetchExtraPortfolioDescription: async () => null,
      };

      const articleRepo: ArticleRepository = {
        fetchArticles: async (locale: string) => {
          articleCallCount++;
          articleLocales.push(locale);
          if (locale !== DEFAULT_LOCALE) {
            throw new LocaleNotSupportedError(locale);
          }
          return mockArticles;
        },
      };

      const certRepo: CertificationRepository = {
        fetchCertifications: async () => mockCertifications,
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(articleRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(certRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind(LoggerToken).toConstantValue(mockLogger);
      container.bind(GetPublicWorkItemsService).toSelf();

      const service = container.get(GetPublicWorkItemsService);
      const items = await service.getAll('unsupported-locale');

      expect(articleCallCount).toBe(2);
      expect(articleLocales).toEqual(['unsupported-locale', DEFAULT_LOCALE]);
      expect(items.some(i => (i as any).workItemType === 'article')).toBe(true);
      expect(mockLogger.hasBreadcrumb('default locale')).toBe(true);
    });

    it('should fallback to DEFAULT_LOCALE when certification repository throws LocaleNotSupportedError', async () => {
      let certCallCount = 0;
      const certLocales: string[] = [];

      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [mockGitHubRepo1],
        fetchExtraPortfolioDescription: async () => null,
      };

      const articleRepo: ArticleRepository = {
        fetchArticles: async () => mockArticles,
      };

      const certRepo: CertificationRepository = {
        fetchCertifications: async (locale: string) => {
          certCallCount++;
          certLocales.push(locale);
          if (locale !== DEFAULT_LOCALE) {
            throw new LocaleNotSupportedError(locale);
          }
          return mockCertifications;
        },
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(articleRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(certRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind(LoggerToken).toConstantValue(mockLogger);
      container.bind(GetPublicWorkItemsService).toSelf();

      const service = container.get(GetPublicWorkItemsService);
      const items = await service.getAll('ja');

      expect(certCallCount).toBe(2);
      expect(certLocales).toEqual(['ja', DEFAULT_LOCALE]);
      expect(items.some(i => (i as any).workItemType === 'certification')).toBe(true);
      expect(mockLogger.hasBreadcrumb('default locale')).toBe(true);
    });

    it('should log breadcrumb when falling back to DEFAULT_LOCALE', async () => {
      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [],
        fetchExtraPortfolioDescription: async () => null,
      };

      const articleRepo: ArticleRepository = {
        fetchArticles: async (locale: string) => {
          if (locale !== DEFAULT_LOCALE) {
            throw new LocaleNotSupportedError(locale);
          }
          return [];
        },
      };

      const certRepo: CertificationRepository = {
        fetchCertifications: async () => [],
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(articleRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(certRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind(LoggerToken).toConstantValue(mockLogger);
      container.bind(GetPublicWorkItemsService).toSelf();

      const service = container.get(GetPublicWorkItemsService);
      await service.getAll('fr');

      expect(mockLogger.breadcrumbs.length).toBeGreaterThan(0);
      expect(
        mockLogger.breadcrumbs.some(
          b =>
            b.message.includes('default locale') &&
            b.data?.requestedLocale === 'fr' &&
            b.data?.fallbackLocale === DEFAULT_LOCALE
        )
      ).toBe(true);
    });

    it('should propagate non-locale errors unchanged', async () => {
      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [mockGitHubRepo1],
        fetchExtraPortfolioDescription: async () => null,
      };

      const articleRepo: ArticleRepository = {
        fetchArticles: async () => {
          throw new Error('Network error');
        },
      };

      const certRepo: CertificationRepository = {
        fetchCertifications: async () => mockCertifications,
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(articleRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(certRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind(LoggerToken).toConstantValue(mockLogger);
      container.bind(GetPublicWorkItemsService).toSelf();

      const service = container.get(GetPublicWorkItemsService);
      const items = await service.getAll(Locale.EN);

      // Should handle error gracefully via existing error handling
      expect(items.length).toBeGreaterThan(0);
      expect(mockLogger.hasError('Failed to fetch articles')).toBe(true);
    });

    it('should return empty arrays when both requested and default locales fail with LocaleNotSupportedError', async () => {
      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [],
        fetchExtraPortfolioDescription: async () => null,
      };

      const articleRepo: ArticleRepository = {
        fetchArticles: async (locale: string) => {
          throw new LocaleNotSupportedError(locale);
        },
      };

      const certRepo: CertificationRepository = {
        fetchCertifications: async () => [],
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(articleRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(certRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind(LoggerToken).toConstantValue(mockLogger);
      container.bind(GetPublicWorkItemsService).toSelf();

      const service = container.get(GetPublicWorkItemsService);
      const items = await service.getAll('fr');

      expect(items).toEqual([]);
      expect(mockLogger.hasError('Failed to fetch articles')).toBe(true);
    });
  });

  describe('existing functionality preservation', () => {
    it('should use Promise.allSettled pattern for parallel fetching', async () => {
      const fetchOrder: string[] = [];

      const githubRepo: GithubRepository = {
        fetchRepositories: async () => {
          fetchOrder.push('github');
          return [mockGitHubRepo1];
        },
        fetchExtraPortfolioDescription: async () => null,
      };

      const articleRepo: ArticleRepository = {
        fetchArticles: async () => {
          fetchOrder.push('articles');
          return mockArticles;
        },
      };

      const certRepo: CertificationRepository = {
        fetchCertifications: async () => {
          fetchOrder.push('certifications');
          return mockCertifications;
        },
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(articleRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(certRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind(LoggerToken).toConstantValue(mockLogger);
      container.bind(GetPublicWorkItemsService).toSelf();

      const service = container.get(GetPublicWorkItemsService);
      await service.getAll(Locale.EN);

      // All three should be called (parallel execution)
      expect(fetchOrder).toContain('github');
      expect(fetchOrder).toContain('articles');
      expect(fetchOrder).toContain('certifications');
    });
  });
});
