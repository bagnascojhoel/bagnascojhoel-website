/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GitHubCodeRepository } from '../../src/core/domain/GitHubCodeRepository';

export const mockGitHubRepo1: GitHubCodeRepository = {
  name: 'awesome-project',
  description: 'An awesome project repository',
  topics: ['react', 'typescript', 'nextjs'],
  html_url: 'https://github.com/user/awesome-project',
  pushed_at: '2024-04-10T10:30:00Z',
};

export const mockGitHubRepo2: GitHubCodeRepository = {
  name: 'another-project',
  description: 'Another cool project',
  topics: ['nodejs', 'api'],
  html_url: 'https://github.com/user/another-project',
  pushed_at: '2024-05-15T14:20:00Z',
};

export const mockGitHubRepos: GitHubCodeRepository[] = [mockGitHubRepo1, mockGitHubRepo2];
