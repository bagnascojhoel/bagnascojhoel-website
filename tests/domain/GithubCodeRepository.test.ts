import { expect, test } from 'vitest';
import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';
import { ProjectFactory } from '@/core/domain/ProjectFactory';

test('can instantiate GithubCodeRepository and use it in ProjectFactory', () => {
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

  const factory = new ProjectFactory();
  const project = factory.create(repo);
  expect(project.id).toBe('gh-999');
});

test('can use plain object shaped like GithubCodeRepository with ProjectFactory', () => {
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

  const factory = new ProjectFactory();
  const project = factory.create(repoPlain as any);
  expect(project.id).toBe('gh-1000');
});
