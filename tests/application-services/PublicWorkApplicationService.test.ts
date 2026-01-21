/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest" />
import { Container } from 'inversify';
import { describe, it, expect, vi } from 'vitest';
import { PublicWorkApplicationService } from '@/core/application-services/PublicWorkApplicationService';
import type { GithubRepository } from '@/core/domain/GithubRepository';
import type { NotionRepository } from '@/core/domain/NotionRepository';
import type { CertificationRepository } from '@/core/domain/CertificationRepository';
import type { Logger } from '@/core/domain/Logger';
import { GithubRepositoryToken } from '@/core/domain/GithubRepository';
import { NotionRepositoryToken } from '@/core/domain/NotionRepository';
import { CertificationRepositoryToken } from '@/core/domain/CertificationRepository';
import { LoggerToken } from '@/core/domain/Logger';
import { ProjectFactory, ProjectFactoryToken } from '@/core/domain/ProjectFactory';
import { MockLogger } from '../fixtures/mockLogger';

const mockGitHubRepo: GithubRepository = {
  fetchRepositories: async () => [
    {
      id: 1,
      name: 'repo-1',
      fullName: 'user/repo-1',
      description: 'desc',
      htmlUrl: 'https://github.com/user/repo-1',
      topics: ['a'],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      language: 'TypeScript',
      stargazersCount: 0,
    },
  ],
};

const mockNotionRepo: NotionRepository = {
  fetchPages: async () => [
    {
      id: 'p1',
      title: 'Article 1',
      description: 'desc',
      url: 'https://notion.so/p1',
      tags: ['x'],
      publishedAt: '2024-10-10T00:00:00Z',
      status: 'published',
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
    container.bind<NotionRepository>(NotionRepositoryToken).toConstantValue(mockNotionRepo);
    container
      .bind<CertificationRepository>(CertificationRepositoryToken)
      .toConstantValue(mockCertRepo);
    container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
    container.bind<Logger>(LoggerToken).toConstantValue(new MockLogger());
    container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

    const uc = container.get(PublicWorkApplicationService);
    const items = await uc.getAll();
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
    container.bind<NotionRepository>(NotionRepositoryToken).toConstantValue(mockNotionRepo);
    container
      .bind<CertificationRepository>(CertificationRepositoryToken)
      .toConstantValue(failingCertRepo);
    container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
    container.bind<Logger>(LoggerToken).toConstantValue(mockLogger);
    container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

    const uc = container.get(PublicWorkApplicationService);
    const items = await uc.getAll();
    expect(items.length).toBe(2); // projects + articles
    
    // Verify error was logged
    expect(mockLogger.hasError('Failed to fetch certifications')).toBe(true);
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
      } as any;

      const container = new Container();
      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<NotionRepository>(NotionRepositoryToken).toConstantValue(mockNotionRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(mockCertRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind<Logger>(LoggerToken).toConstantValue(new MockLogger());
      container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

      const uc = container.get(PublicWorkApplicationService);

      // first call - cache miss expected
      await uc.getAll();
      // second call - should hit cache and not call fetchRepositories again
      await uc.getAll();

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
      } as any;

      const container = new Container();
      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind<NotionRepository>(NotionRepositoryToken).toConstantValue(mockNotionRepo);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .toConstantValue(mockCertRepo);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind<Logger>(LoggerToken).toConstantValue(new MockLogger());
      container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

      const uc = container.get(PublicWorkApplicationService);

      await uc.getAll();
      // advance time beyond TTL
      vi.advanceTimersByTime(2000);
      await uc.getAll();

      vi.useRealTimers();

      expect(callSpy).toHaveBeenCalledTimes(2);
    });
  });
});
