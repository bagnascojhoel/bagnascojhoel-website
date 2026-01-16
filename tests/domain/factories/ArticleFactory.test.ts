/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest" />
import { ArticleFactory } from '@/core/domain/ArticleFactory';

const publishedPage = {
  id: 'abc',
  title: 'Published',
  description: 'desc',
  url: 'https://notion.so/published',
  tags: ['tech'],
  publishedAt: '2024-10-10T00:00:00Z',
  status: 'published',
};

const draftPage = {
  id: 'def',
  title: 'Draft',
  description: 'desc',
  url: 'https://notion.so/draft',
  tags: ['note'],
  publishedAt: null,
  status: 'draft',
};

describe('ArticleFactory', () => {
  it('should transform a Notion page into an Article', () => {
    const article = ArticleFactory.fromNotionPage(publishedPage as any);
    expect(article.id.startsWith('notion-')).toBe(true);
    expect(article.type).toBe('Article');
    expect(article.title).toBe('Published');
  });

  it('should filter out draft pages', () => {
    const articles = ArticleFactory.fromNotionPages([publishedPage as any, draftPage as any]);
    expect(articles).toHaveLength(1);
    expect(articles[0].title).toBe('Published');
  });
});
