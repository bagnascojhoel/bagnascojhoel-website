import { Article } from '@/core/domain/Article';
import { NotionPage } from '@/core/domain/NotionPage';

export class ArticleFactory {
  static fromNotionPage(page: NotionPage): Article {
    return {
      id: `notion-${page.id}`,
      title: page.title,
      description: page.description,
      tags: page.tags,
      link: page.url,
      publishedAt: page.publishedAt || undefined,
    };
  }

  static fromNotionPages(pages: NotionPage[]): Article[] {
    return pages.filter(p => p.status === 'published').map(p => this.fromNotionPage(p));
  }
}
