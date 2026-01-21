import { inject, injectable } from 'inversify';
import { NotionRepository } from '@/core/domain/NotionRepository';
import { NotionPage } from '@/core/domain/NotionPage';
import type { Logger } from '@/core/domain/Logger';
import { LoggerToken } from '@/core/domain/Logger';
import articlesData from '../../../data/articles.json';

@injectable()
export class NotionRepositoryJson implements NotionRepository {
  constructor(@inject(LoggerToken) private logger: Logger) {}

  async fetchPages(): Promise<NotionPage[]> {
    try {
      return articlesData as NotionPage[];
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error('Failed to read articles JSON'),
        { source: 'NotionRepositoryJson' }
      );
      return [];
    }
  }
}
