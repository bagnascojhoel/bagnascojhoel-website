import { expect, test } from 'vitest';
import { Container } from 'inversify';
import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';
import { ProjectFactory, ProjectFactoryToken } from '@/core/domain/ProjectFactory';
import type { GithubRepository } from '@/core/domain/GithubRepository';
import { GithubRepositoryToken } from '@/core/domain/GithubRepository';
import { Locale } from '@/core/domain/Locale';

test('can instantiate GithubCodeRepository and use it in ProjectFactory', async () => {
  const repo = new GithubCodeRepository(
    999,
    'instantiated',
    'user/instantiated',
    { login: 'unknown' },
    'desc',
    'https://github.com/user/instantiated',
    ['a'],
    '2023-01-01T00:00:00Z',
    '2023-01-02T00:00:00Z',
    'TypeScript',
    0,
    null,
    false
  );

  const githubRepo: GithubRepository = {
    fetchRepositories: async () => [],
    fetchExtraPortfolioDescription: async () => null,
  };

  const container = new Container();
  container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
  container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);

  const factory = container.get<ProjectFactory>(ProjectFactoryToken);
  const project = await factory.create(repo, Locale.EN);
  expect(project.id).toBe('gh-999');
});

test('can use plain object shaped like GithubCodeRepository with ProjectFactory', async () => {
  const repoPlain = {
    id: 1000,
    name: 'plain',
    fullName: 'user/plain',
    description: 'desc',
    htmlUrl: 'https://github.com/user/plain',
    topics: [],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    language: null,
    stargazersCount: 2,
  } as unknown as GithubCodeRepository;

  const githubRepo: GithubRepository = {
    fetchRepositories: async () => [],
    fetchExtraPortfolioDescription: async () => null,
  };

  const container = new Container();
  container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
  container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);

  const factory = container.get<ProjectFactory>(ProjectFactoryToken);
  const project = await factory.create(repoPlain as any, Locale.EN);
  expect(project.id).toBe('gh-1000');
});
