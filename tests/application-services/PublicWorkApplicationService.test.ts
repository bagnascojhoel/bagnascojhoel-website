/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest" />
import { Container } from 'inversify';
import { PublicWorkApplicationService } from '@/core/application-services/PublicWorkApplicationService';
import type { GitHubRepository } from '@/core/domain/GitHubRepository';
import type { NotionRepository } from '@/core/domain/NotionRepository';
import type { CertificationRepository } from '@/core/domain/CertificationRepository';
import { GitHubRepositoryToken } from '@/core/domain/GitHubRepository';
import { NotionRepositoryToken } from '@/core/domain/NotionRepository';
import { CertificationRepositoryToken } from '@/core/domain/CertificationRepository';

const mockGitHubRepo: GitHubRepository = {
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
    container.bind<GitHubRepository>(GitHubRepositoryToken).toConstantValue(mockGitHubRepo);
    container.bind<NotionRepository>(NotionRepositoryToken).toConstantValue(mockNotionRepo);
    container
      .bind<CertificationRepository>(CertificationRepositoryToken)
      .toConstantValue(mockCertRepo);
    container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

    const uc = container.get(PublicWorkApplicationService);
    const items = await uc.getAll();
    expect(items.length).toBe(3);
    expect(items.some(i => (i as any).type === 'Project')).toBe(true);
    expect(items.some(i => (i as any).type === 'Article')).toBe(true);
    expect(items.some(i => (i as any).type === 'Certification')).toBe(true);
  });

  it('should continue when one repo fails', async () => {
    const failingCertRepo: CertificationRepository = {
      fetchCertifications: async () => {
        throw new Error('Failed');
      },
    };

    const container = new Container();
    container.bind<GitHubRepository>(GitHubRepositoryToken).toConstantValue(mockGitHubRepo);
    container.bind<NotionRepository>(NotionRepositoryToken).toConstantValue(mockNotionRepo);
    container
      .bind<CertificationRepository>(CertificationRepositoryToken)
      .toConstantValue(failingCertRepo);
    container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

    const uc = container.get(PublicWorkApplicationService);
    const items = await uc.getAll();
    expect(items.length).toBe(2); // projects + articles
  });
});
