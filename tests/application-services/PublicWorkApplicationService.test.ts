/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest" />
import { Container } from 'inversify';
import { describe, it, expect, vi } from 'vitest';
import { PublicWorkApplicationService } from '@/core/application-services/PublicWorkApplicationService';
import type { GithubRepository } from '@/core/domain/GithubRepository';
import type { ArticleRepository } from '@/core/domain/ArticleRepository';
import type { CertificationRepository } from '@/core/domain/CertificationRepository';
import type { Logger } from '@/core/domain/Logger';
import { GithubRepositoryToken } from '@/core/domain/GithubRepository';
import { ArticleRepositoryToken } from '@/core/domain/ArticleRepository';
import { CertificationRepositoryToken } from '@/core/domain/CertificationRepository';
import { LoggerToken } from '@/core/domain/Logger';
import { ProjectFactory, ProjectFactoryToken } from '@/core/domain/ProjectFactory';
import {
  GetPublicWorkItemsService,
  GetPublicWorkItemsServiceToken,
} from '@/core/domain/GetPublicWorkItemsService';
import { MockLogger } from '../fixtures/mockLogger';

const mockGitHubRepo: GithubRepository = {
  fetchRepositories: async () => [
    {
      id: 1,
      name: 'repo-1',
      fullName: 'user/repo-1',
      owner: 'user',
      description: 'desc',
      htmlUrl: 'https://github.com/user/repo-1',
      topics: ['a'],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      language: 'TypeScript',
      stargazersCount: 0,
      homepage: null,
      archived: false,
    },
  ],
  fetchExtraPortfolioDescription: async () => null,
};

const mockArticleRepo: ArticleRepository = {
  fetchArticles: async () => [
    {
      id: 'p1',
      title: 'Article 1',
      description: 'desc',
      link: 'https://notion.so/p1',
      tags: ['x'],
      publishedAt: '2024-10-10T00:00:00Z',
    },
  ],
};

const mockCertRepo: CertificationRepository = {
  fetchCertifications: async () => [
    {
      id: 'c1',
      type: 'Certification',
      title: 'Cert 1',
      description: 'desc',
      tags: ['cert'],
      link: 'https://example.com',
    },
  ],
};

describe('PublicWorkApplicationService', () => {
  it('should return aggregated items when all repos succeed', async () => {
    const container = new Container();
    container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(mockGitHubRepo);
    container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(mockArticleRepo);
    container
      .bind<CertificationRepository>(CertificationRepositoryToken)
      .toConstantValue(mockCertRepo);
    container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
    container.bind<Logger>(LoggerToken).toConstantValue(new MockLogger());
    container
      .bind<GetPublicWorkItemsService>(GetPublicWorkItemsServiceToken)
      .to(GetPublicWorkItemsService);
    container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

    const uc = container.get(PublicWorkApplicationService);
    const items = await uc.getAll('en');
    expect(items.length).toBe(3);
    expect(items.some(i => (i as any).workItemType === 'project')).toBe(true);
    expect(items.some(i => (i as any).workItemType === 'article')).toBe(true);
    expect(items.some(i => (i as any).workItemType === 'certification')).toBe(true);
  });

  it('should merge extras into projects when extras repo provides data', async () => {
    // ExtraPortfolioDescriptionService not yet implemented
  });

  it('should continue when one repo fails', async () => {
    const failingCertRepo: CertificationRepository = {
      fetchCertifications: async () => {
        throw new Error('Failed');
      },
    };

    const mockLogger = new MockLogger();
    const container = new Container();
    container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(mockGitHubRepo);
    container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(mockArticleRepo);
    container
      .bind<CertificationRepository>(CertificationRepositoryToken)
      .toConstantValue(failingCertRepo);
    container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
    container.bind<Logger>(LoggerToken).toConstantValue(mockLogger);
    container
      .bind<GetPublicWorkItemsService>(GetPublicWorkItemsServiceToken)
      .to(GetPublicWorkItemsService);
    container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

    const uc = container.get(PublicWorkApplicationService);
    const items = await uc.getAll('en');
    expect(items.length).toBe(2); // projects + articles

    // Verify error was logged
    expect(mockLogger.hasError('Failed to fetch certifications')).toBe(true);
  });

  it('should filter out projects with empty descriptions', async () => {
    const githubRepoWithEmptyDesc: GithubRepository = {
      fetchRepositories: async () => [
        {
          id: 1,
          name: 'repo-with-desc',
          fullName: 'user/repo-with-desc',
          description: 'Valid description',
          htmlUrl: 'https://github.com/user/repo-with-desc',
          topics: ['a'],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          language: 'TypeScript',
          stargazersCount: 0,
        },
        {
          id: 2,
          name: 'repo-empty-desc',
          fullName: 'user/repo-empty-desc',
          description: '',
          htmlUrl: 'https://github.com/user/repo-empty-desc',
          topics: ['b'],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          language: 'JavaScript',
          stargazersCount: 0,
        },
        {
          id: 3,
          name: 'repo-whitespace-desc',
          fullName: 'user/repo-whitespace-desc',
          description: '   ',
          htmlUrl: 'https://github.com/user/repo-whitespace-desc',
          topics: ['c'],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          language: 'Python',
          stargazersCount: 0,
        },
      ],
      fetchExtraPortfolioDescription: async () => null,
    };

    const container = new Container();
    container
      .bind<GithubRepository>(GithubRepositoryToken)
      .toConstantValue(githubRepoWithEmptyDesc);
    container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(mockArticleRepo);
    container
      .bind<CertificationRepository>(CertificationRepositoryToken)
      .toConstantValue(mockCertRepo);
    container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
    container.bind<Logger>(LoggerToken).toConstantValue(new MockLogger());
    container
      .bind<GetPublicWorkItemsService>(GetPublicWorkItemsServiceToken)
      .to(GetPublicWorkItemsService);
    container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

    const uc = container.get(PublicWorkApplicationService);
    const items = await uc.getAll('en');

    const projects = items.filter(i => (i as any).workItemType === 'project');

    // Should only include the project with valid description
    expect(projects.length).toBe(1);
    expect((projects[0] as any).title).toBe('repo-with-desc');
    expect((projects[0] as any).description).toBe('Valid description');
  });

  it('should shuffle work items by type instead of appending lists', async () => {
    // Create repos with multiple items per type
    const multiItemGitHubRepo: GithubRepository = {
      fetchRepositories: async () => [
        {
          id: 1,
          name: 'project-1',
          fullName: 'user/project-1',
          description: 'Project 1',
          htmlUrl: 'https://github.com/user/project-1',
          topics: ['a'],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          language: 'TypeScript',
          stargazersCount: 0,
        },
        {
          id: 2,
          name: 'project-2',
          fullName: 'user/project-2',
          description: 'Project 2',
          htmlUrl: 'https://github.com/user/project-2',
          topics: ['b'],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          language: 'JavaScript',
          stargazersCount: 0,
        },
      ],
      fetchExtraPortfolioDescription: async () => null,
    };

    const multiItemArticleRepo: ArticleRepository = {
      fetchArticles: async () => [
        {
          id: 'a1',
          title: 'Article 1',
          description: 'desc1',
          link: 'https://notion.so/a1',
          tags: ['x'],
          publishedAt: '2024-10-10T00:00:00Z',
        },
        {
          id: 'a2',
          title: 'Article 2',
          description: 'desc2',
          link: 'https://notion.so/a2',
          tags: ['y'],
          publishedAt: '2024-10-11T00:00:00Z',
        },
      ],
    };

    const multiItemCertRepo: CertificationRepository = {
      fetchCertifications: async () => [
        {
          id: 'c1',
          type: 'Certification',
          title: 'Cert 1',
          description: 'desc1',
          tags: ['cert'],
          link: 'https://example.com/c1',
        },
        {
          id: 'c2',
          type: 'Certification',
          title: 'Cert 2',
          description: 'desc2',
          tags: ['cert'],
          link: 'https://example.com/c2',
        },
      ],
    };

    const container = new Container();
    container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(multiItemGitHubRepo);
    container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(multiItemArticleRepo);
    container
      .bind<CertificationRepository>(CertificationRepositoryToken)
      .toConstantValue(multiItemCertRepo);
    container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
    container.bind<Logger>(LoggerToken).toConstantValue(new MockLogger());
    container
      .bind<GetPublicWorkItemsService>(GetPublicWorkItemsServiceToken)
      .to(GetPublicWorkItemsService);
    container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

    const uc = container.get(PublicWorkApplicationService);
    const items = await uc.getAll('en');

    // Should have 6 items total
    expect(items.length).toBe(6);

    // Extract types in order
    const types = items.map(i => (i as any).workItemType);

    // Should NOT be all projects, then all articles, then all certifications
    const isAppended =
      types[0] === 'project' &&
      types[1] === 'project' &&
      types[2] === 'article' &&
      types[3] === 'article' &&
      types[4] === 'certification' &&
      types[5] === 'certification';

    expect(isAppended).toBe(false);

    // Verify all types are present
    expect(types.filter(t => t === 'project').length).toBe(2);
    expect(types.filter(t => t === 'article').length).toBe(2);
    expect(types.filter(t => t === 'certification').length).toBe(2);
  });

  describe('caching and extras orchestration (planned features)', () => {
    it('should cache results and return cached data on subsequent calls (cache hit)', async () => {
      const callSpy = vi.fn(async () => [
        {
          id: 201,
          name: 'cached-repo',
          fullName: 'user/cached-repo',
          description: 'cached',
          htmlUrl: 'https://github.com/user/cached-repo',
          topics: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          language: null,
          stargazersCount: 0,
        },
      ]);

      const githubRepo: GithubRepository = {
        fetchRepositories: callSpy,
        fetchExtraPortfolioDescription: async () => null,
      } as any;

      const container = new Container();
      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(mockArticleRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(mockCertRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind<Logger>(LoggerToken).toConstantValue(new MockLogger());
      container
        .bind<GetPublicWorkItemsService>(GetPublicWorkItemsServiceToken)
        .to(GetPublicWorkItemsService);
      container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

      const uc = container.get(PublicWorkApplicationService);

      // first call - cache miss expected
      await uc.getAll('en');
      // second call - should hit cache and not call fetchRepositories again
      await uc.getAll('en');

      expect(callSpy).toHaveBeenCalledTimes(1);
    });

    it('should respect cache TTL and refetch after expiration (cache miss after TTL)', async () => {
      vi.useFakeTimers();

      // set small cache TTL for test
      process.env.PUBLIC_WORK_CACHE_TTL_MS = '1000';

      const callSpy = vi.fn(async () => [
        {
          id: 301,
          name: 'ttl-repo',
          fullName: 'user/ttl-repo',
          description: 'ttl',
          htmlUrl: 'https://github.com/user/ttl-repo',
          topics: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          language: null,
          stargazersCount: 0,
        },
      ]);

      const githubRepo: GithubRepository = {
        fetchRepositories: callSpy,
        fetchExtraPortfolioDescription: async () => null,
      } as any;

      const container = new Container();
      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(mockArticleRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(mockCertRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind<Logger>(LoggerToken).toConstantValue(new MockLogger());
      container
        .bind<GetPublicWorkItemsService>(GetPublicWorkItemsServiceToken)
        .to(GetPublicWorkItemsService);
      container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

      const uc = container.get(PublicWorkApplicationService);

      await uc.getAll('en');
      // advance time beyond TTL
      vi.advanceTimersByTime(2000);
      await uc.getAll('en');

      vi.useRealTimers();

      expect(callSpy).toHaveBeenCalledTimes(2);
    });

    it('should cache results per locale independently', async () => {
      const callSpy = vi.fn(async () => [
        {
          id: 401,
          name: 'multilang-repo',
          fullName: 'user/multilang-repo',
          description: 'multilang',
          htmlUrl: 'https://github.com/user/multilang-repo',
          topics: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          language: null,
          stargazersCount: 0,
        },
      ]);

      const githubRepo: GithubRepository = {
        fetchRepositories: callSpy,
        fetchExtraPortfolioDescription: async () => null,
      } as any;

      const container = new Container();
      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(mockArticleRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(mockCertRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind<Logger>(LoggerToken).toConstantValue(new MockLogger());
      container
        .bind<GetPublicWorkItemsService>(GetPublicWorkItemsServiceToken)
        .to(GetPublicWorkItemsService);
      container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

      const uc = container.get(PublicWorkApplicationService);

      // First call with 'en' - should fetch
      await uc.getAll('en');
      expect(callSpy).toHaveBeenCalledTimes(1);

      // Second call with 'pt-br' - should fetch again (different locale)
      await uc.getAll('pt-br');
      expect(callSpy).toHaveBeenCalledTimes(2);

      // Third call with 'en' - should hit cache (not fetch)
      await uc.getAll('en');
      expect(callSpy).toHaveBeenCalledTimes(2);
    });

    it('should return different content for different locales', async () => {
      const enArticles = [
        {
          id: 'a1',
          title: 'English Article',
          description: 'English description',
          link: 'https://notion.so/a1',
          tags: ['en'],
          publishedAt: '2024-10-10T00:00:00Z',
        },
      ];

      const ptBrArticles = [
        {
          id: 'a1',
          title: 'Artigo Português',
          description: 'Descrição em português',
          link: 'https://notion.so/a1',
          tags: ['pt-br'],
          publishedAt: '2024-10-10T00:00:00Z',
        },
      ];

      const articleRepo: ArticleRepository = {
        fetchArticles: vi.fn(async (locale: string) => {
          if (locale === 'en') return enArticles;
          if (locale === 'pt-br') return ptBrArticles;
          return [];
        }),
      };

      const container = new Container();
      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(mockGitHubRepo);
      container.bind<ArticleRepository>(ArticleRepositoryToken).toConstantValue(articleRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(mockCertRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind<Logger>(LoggerToken).toConstantValue(new MockLogger());
      container
        .bind<GetPublicWorkItemsService>(GetPublicWorkItemsServiceToken)
        .to(GetPublicWorkItemsService);
      container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

      const uc = container.get(PublicWorkApplicationService);

      // Get English content
      const enItems = await uc.getAll('en');
      const enArticle = enItems.find(i => (i as any).workItemType === 'article') as any;
      expect(enArticle.title).toBe('English Article');
      expect(enArticle.description).toBe('English description');

      // Get Portuguese content
      const ptBrItems = await uc.getAll('pt-br');
      const ptBrArticle = ptBrItems.find(i => (i as any).workItemType === 'article') as any;
      expect(ptBrArticle.title).toBe('Artigo Português');
      expect(ptBrArticle.description).toBe('Descrição em português');
    });
  });
});
