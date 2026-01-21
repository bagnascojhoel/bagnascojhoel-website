import { Article } from './Article';

export interface ArticleRepository {
  fetchArticles(): Promise<Article[]>;
}

export const ArticleRepositoryToken = Symbol.for('ArticleRepository');
