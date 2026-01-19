/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GithubCodeRepository } from '../../src/core/domain/GithubCodeRepository';

export const mockGitHubRepo1: GithubCodeRepository = {
  id: 101,
  name: 'awesome-project',
  fullName: 'user/awesome-project',
  owner: 'user',
  description: 'An awesome project repository',
  topics: ['react', 'typescript', 'nextjs'],
  htmlUrl: 'https://github.com/user/awesome-project',
  homepage: 'https://awesome.example.com',
  createdAt: '2023-01-10T10:00:00Z',
  updatedAt: '2024-04-10T10:30:00Z',
  language: 'TypeScript',
  stargazersCount: 42,
  archived: false,
};

export const mockGitHubRepo2: GithubCodeRepository = {
  id: 102,
  name: 'another-project',
  fullName: 'user/another-project',
  owner: 'user',
  description: null,
  topics: ['nodejs', 'api'],
  htmlUrl: 'https://github.com/user/another-project',
  homepage: null,
  createdAt: '2022-06-20T08:15:00Z',
  updatedAt: '2024-05-15T14:20:00Z',
  language: 'JavaScript',
  stargazersCount: 10,
  archived: false,
};

export const mockGitHubRepoArchived: GithubCodeRepository = {
  id: 103,
  name: 'old-archived-project',
  fullName: 'user/old-archived-project',
  owner: 'user',
  description: 'Old archived repo',
  topics: ['legacy'],
  htmlUrl: 'https://github.com/user/old-archived-project',
  homepage: null,
  createdAt: '2019-03-15T12:00:00Z',
  updatedAt: '2020-01-01T00:00:00Z',
  language: null,
  stargazersCount: 0,
  archived: true,
};

export const mockGitHubRepoWithNoDescription: GithubCodeRepository = {
  id: 104,
  name: 'no-desc-project',
  fullName: 'user/no-desc-project',
  owner: 'user',
  description: null,
  topics: [],
  htmlUrl: 'https://github.com/user/no-desc-project',
  homepage: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  language: null,
  stargazersCount: 1,
  archived: false,
};

export const mockGitHubRepos: GithubCodeRepository[] = [
  mockGitHubRepo1,
  mockGitHubRepo2,
  mockGitHubRepoArchived,
  mockGitHubRepoWithNoDescription,
];
