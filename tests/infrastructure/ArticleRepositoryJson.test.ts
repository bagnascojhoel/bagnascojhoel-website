/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import { ArticleRepositoryJsonAdapter } from '../../src/core/infrastructure/ArticleRepositoryJsonAdapter';
import { MockLogger } from '../fixtures/mockLogger';
import { Locale } from '../../src/core/domain/Locale';

describe('ArticleRepositoryJson', () => {
  let repository: ArticleRepositoryJsonAdapter;
  let mockLogger: MockLogger;
  beforeEach(() => {
    mockLogger = new MockLogger();
    repository = new ArticleRepositoryJsonAdapter(mockLogger);
  });
  describe('fetchArticles', () => {
    it('should return English articles for locale "en"', async () => {
      const result = await repository.fetchArticles(Locale.EN);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
    it('should return Portuguese articles for locale "pt-br"', async () => {
      const result = await repository.fetchArticles(Locale.PT_BR);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
    it('should return articles with correct structure', async () => {
      const result = await repository.fetchArticles(Locale.EN);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('tags');
      expect(result[0]).toHaveProperty('link');
      expect(result[0]).toHaveProperty('publishedAt');
    });
  });
});
