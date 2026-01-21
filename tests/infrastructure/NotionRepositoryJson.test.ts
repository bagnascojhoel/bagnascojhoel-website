/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, beforeEach } from 'vitest';
import { NotionRepositoryJsonAdapter } from '../../src/core/infrastructure/NotionRepositoryJsonAdapter';

describe('NotionRepositoryJson', () => {
  let repository: NotionRepositoryJsonAdapter;

  beforeEach(() => {
    repository = new NotionRepositoryJsonAdapter();
  });

  describe('fetchPages', () => {
    it('should return all Notion pages from JSON file', async () => {
      const result = await repository.fetchPages();

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
    });

    it('should return pages with correct structure', async () => {
      const result = await repository.fetchPages();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('status');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('tags');
      expect(result[0]).toHaveProperty('url');
      expect(result[0]).toHaveProperty('publishedAt');
    });

    it('should return pages with expected data', async () => {
      const result = await repository.fetchPages();

      expect(result[0].id).toBe('abc-123');
      expect(result[0].status).toBe('published');
      expect(result[0].title).toBe('Building Scalable Microservices with Spring Boot');
      expect(result[1].id).toBe('def-456');
      expect(result[1].status).toBe('published');
      expect(result[1].title).toBe('Modern Frontend Development with React and TypeScript');
    });

    it('should return all pages with published status', async () => {
      const result = await repository.fetchPages();

      const publishedPages = result.filter(page => page.status === 'published');

      expect(publishedPages).toHaveLength(2);
    });

    it('should return an array', async () => {
      const result = await repository.fetchPages();

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
