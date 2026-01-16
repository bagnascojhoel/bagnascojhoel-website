/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NotionPage } from '../../src/core/domain/NotionPage';

export const mockNotionPagePublished: NotionPage = {
  id: 'abc-123',
  status: 'published',
  title: 'Building Scalable Microservices with Spring Boot',
  description: 'A comprehensive guide on designing and implementing microservices architecture',
  tags: ['Spring Boot', 'Microservices', 'Architecture'],
  url: 'https://notion.so/article-1',
  publishedAt: '2024-10-15T00:00:00Z',
};

export const mockNotionPageDraft: NotionPage = {
  id: 'def-456',
  status: 'published',
  title: 'Modern Frontend Development with React and TypeScript',
  description: 'Deep dive into building type-safe React applications',
  tags: ['React', 'TypeScript', 'Frontend'],
  url: 'https://notion.so/article-2',
  publishedAt: '2024-11-20T00:00:00Z',
};

export const mockNotionPages: NotionPage[] = [mockNotionPagePublished, mockNotionPageDraft];

export const mockNotionPagesJsonData = {
  articles: mockNotionPages,
};
