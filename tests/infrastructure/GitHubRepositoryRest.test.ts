/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, beforeEach } from 'vitest';
import { GithubRepositoryRest } from '../../src/core/infrastructure/GithubRepositoryRest';

describe('GitHubRepositoryRest', () => {
  let repository: GithubRepositoryRest;

  beforeEach(() => {
    repository = new GithubRepositoryRest();
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
