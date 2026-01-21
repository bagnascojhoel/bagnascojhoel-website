import { NotionPage } from '@/core/domain/NotionPage';
import { Article } from './Article';

export interface NotionRepository {
  fetchPages(): Promise<NotionPage[]>;
  fetchArticles(): Promise<Article[]>;
}

export const NotionRepositoryToken = Symbol.for('NotionRepository');
