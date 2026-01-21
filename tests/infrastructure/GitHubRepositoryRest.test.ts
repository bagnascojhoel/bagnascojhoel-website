/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { GithubRepositoryRestAdapter } from '../../src/core/infrastructure/GithubRepositoryRestAdapter';
import { MockLogger } from '../fixtures/mockLogger';

// Mock GitHub API response
const mockGitHubApiResponse = [
  {
    id: 123456,
    name: 'kwik-ecommerce',
    full_name: 'bagnascojhoel/kwik-ecommerce',
    owner: { login: 'bagnascojhoel' },
    description: 'Ecommerce application built with Java 17, Spring Boot, and Postgres',
    html_url: 'https://github.com/bagnascojhoel/kwik-ecommerce',
    homepage: null,
    topics: ['spring-boot', 'react', 'typescript', 'aws'],
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-12-01T15:30:00Z',
    pushed_at: '2024-12-01T15:30:00Z',
    language: 'Java',
    stargazers_count: 5,
    archived: false,
  },
  {
    id: 789012,
    name: 'portfolio-website-monorepo',
    full_name: 'bagnascojhoel/portfolio-website-monorepo',
    owner: { login: 'bagnascojhoel' },
    description: 'Monorepo including front-end, BFF, and blog',
    html_url: 'https://github.com/bagnascojhoel/portfolio-website-monorepo',
    homepage: 'https://example.com',
    topics: ['java', 'svelte', 'monorepo'],
    created_at: '2023-06-20T08:00:00Z',
    updated_at: '2024-11-15T12:00:00Z',
    pushed_at: '2024-11-15T12:00:00Z',
    language: 'TypeScript',
    stargazers_count: 3,
    archived: false,
  },
];

// Set up MSW server
const server = setupServer(
  http.get('https://api.github.com/users/bagnascojhoel/repos', () => {
    return HttpResponse.json(mockGitHubApiResponse);
  })
);

describe('GitHubRepositoryRest', () => {
  let repository: GithubRepositoryRestAdapter;

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'warn' });
  });

  beforeEach(() => {
    repository = new GithubRepositoryRestAdapter(new MockLogger());
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  describe('fetchRepositories', () => {
    it('should return mocked GitHub repositories', async () => {
      const result = await repository.fetchRepositories();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it('should return repositories with correct structure', async () => {
      const result = await repository.fetchRepositories();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('fullName');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('htmlUrl');
      expect(result[0]).toHaveProperty('topics');
      expect(result[0]).toHaveProperty('createdAt');
      expect(result[0]).toHaveProperty('updatedAt');
      expect(result[0]).toHaveProperty('language');
      expect(result[0]).toHaveProperty('stargazersCount');
    });

    it('should return kwik-ecommerce repository', async () => {
      const result = await repository.fetchRepositories();

      const kwikEcommerce = result.find(repo => repo.name === 'kwik-ecommerce');
      expect(kwikEcommerce).toBeDefined();
      expect(kwikEcommerce?.description).toContain('Ecommerce application');
      expect(kwikEcommerce?.language).toBe('Java');
      expect(kwikEcommerce?.topics).toContain('spring-boot');
    });

    it('should return portfolio-website-monorepo repository', async () => {
      const result = await repository.fetchRepositories();

      const portfolio = result.find(repo => repo.name === 'portfolio-website-monorepo');
      expect(portfolio).toBeDefined();
      expect(portfolio?.description).toContain('Monorepo');
      expect(portfolio?.language).toBe('TypeScript');
      expect(portfolio?.topics).toContain('monorepo');
    });

    it('should return repositories with topics array', async () => {
      const result = await repository.fetchRepositories();

      result.forEach(repo => {
        expect(Array.isArray(repo.topics)).toBe(true);
        expect(repo.topics.length).toBeGreaterThan(0);
      });
    });

    it('should return repositories with valid stargazers count', async () => {
      const result = await repository.fetchRepositories();

      result.forEach(repo => {
        expect(typeof repo.stargazersCount).toBe('number');
        expect(repo.stargazersCount).toBeGreaterThanOrEqual(0);
      });
    });

    it('should return repositories with valid URLs', async () => {
      const result = await repository.fetchRepositories();

      result.forEach(repo => {
        expect(repo.htmlUrl).toMatch(/^https:\/\/github\.com\//);
      });
    });

    it('should return repositories with timestamp strings', async () => {
      const result = await repository.fetchRepositories();

      result.forEach(repo => {
        expect(repo.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        expect(repo.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      });
    });
  });
});
