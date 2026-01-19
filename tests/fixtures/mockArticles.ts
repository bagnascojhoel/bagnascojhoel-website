/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Article } from '../../src/core/domain/Article';

export const mockArticle1: Article = {
  id: 'article-1',
  title: 'Building Scalable APIs',
  description: 'A guide to designing scalable REST APIs',
  tags: ['API', 'Backend', 'Architecture'],
  link: 'https://example.com/articles/scalable-apis',
  publishedAt: '2024-03-10',
};

export const mockArticle2: Article = {
  id: 'article-2',
  title: 'Introduction to TypeScript',
  description: 'Getting started with TypeScript for beginners',
  tags: ['TypeScript', 'JavaScript'],
  link: 'https://example.com/articles/typescript-intro',
  publishedAt: '2024-05-22',
};

export const mockArticles: Article[] = [mockArticle1, mockArticle2];

export const mockArticlesJsonData = {
  articles: mockArticles,
};
