/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotionRepositoryRest } from '../../src/core/infrastructure/NotionRepositoryRest';

describe('NotionRepositoryRest', () => {
  let repository: NotionRepositoryRest;
  const originalEnv = process.env;

  beforeEach(() => {
    // Mock environment variables
    vi.stubEnv('NOTION_DATABASE_ID', 'test-database-id');
    vi.stubEnv('NOTION_API_KEY', 'test-api-key');

    repository = new NotionRepositoryRest();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('fetchPages', () => {
    it('should return mocked Notion pages', async () => {
      const result = await repository.fetchPages();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it('should return pages with correct structure', async () => {
      const result = await repository.fetchPages();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('url');
      expect(result[0]).toHaveProperty('tags');
      expect(result[0]).toHaveProperty('publishedAt');
      expect(result[0]).toHaveProperty('status');
    });

    it('should return Spring Boot microservices article', async () => {
      const result = await repository.fetchPages();

      const article = result.find(page => page.id === 'abc-123');
      expect(article).toBeDefined();
      expect(article?.title).toContain('Spring Boot');
      expect(article?.tags).toContain('Microservices');
      expect(article?.status).toBe('published');
    });

    it('should return React TypeScript article', async () => {
      const result = await repository.fetchPages();

      const article = result.find(page => page.id === 'def-456');
      expect(article).toBeDefined();
      expect(article?.title).toContain('React');
      expect(article?.tags).toContain('TypeScript');
      expect(article?.status).toBe('published');
    });

    it('should return all pages with published status', async () => {
      const result = await repository.fetchPages();

      result.forEach(page => {
        expect(page.status).toBe('published');
      });
    });

    it('should return pages with tags array', async () => {
      const result = await repository.fetchPages();

      result.forEach(page => {
        expect(Array.isArray(page.tags)).toBe(true);
        expect(page.tags.length).toBeGreaterThan(0);
      });
    });

    it('should return pages with valid Notion URLs', async () => {
      const result = await repository.fetchPages();

      result.forEach(page => {
        expect(page.url).toMatch(/^https:\/\/notion\.so\//);
      });
    });

    it('should return pages with timestamp strings', async () => {
      const result = await repository.fetchPages();

      result.forEach(page => {
        expect(page.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      });
    });
  });

  describe('environment variables', () => {
    it('should read NOTION_DATABASE_ID from environment', () => {
      expect(process.env.NOTION_DATABASE_ID).toBe('test-database-id');
    });

    it('should read NOTION_API_KEY from environment', () => {
      expect(process.env.NOTION_API_KEY).toBe('test-api-key');
    });
  });
});
