import { inject, injectable } from 'inversify';
import { ArticleRepository } from '@/core/domain/ArticleRepository';
import type { Logger } from '@/core/domain/Logger';
import { LoggerToken } from '@/core/domain/Logger';
import articlesData from '../../../data/articles.json';
import { Article } from '../domain/Article';

@injectable()
export class ArticleRepositoryJsonAdapter implements ArticleRepository {
  constructor(@inject(LoggerToken) private logger: Logger) {}

  async fetchArticles(): Promise<Article[]> {
    try {
      return articlesData as Article[];
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error('Failed to read articles JSON'),
        { source: 'ArticleRepositoryJsonAdapter' }
      );
      return [];
    }
  }
}
