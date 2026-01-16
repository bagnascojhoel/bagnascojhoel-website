import { injectable } from 'inversify';
import { NotionRepository } from '@/core/domain/NotionRepository';
import { NotionPage } from '@/core/domain/NotionPage';
import articlesData from '../../../data/articles.json';

@injectable()
export class NotionRepositoryJson implements NotionRepository {
  async fetchPages(): Promise<NotionPage[]> {
    try {
      return articlesData as NotionPage[];
    } catch (error) {
      console.error('Failed to read articles JSON:', error);
      return [];
    }
  }
}
