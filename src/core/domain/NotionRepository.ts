import { NotionPage } from '@/core/domain/NotionPage';

export interface NotionRepository {
  fetchPages(): Promise<NotionPage[]>;
}

export const NotionRepositoryToken = Symbol.for('NotionRepository');
