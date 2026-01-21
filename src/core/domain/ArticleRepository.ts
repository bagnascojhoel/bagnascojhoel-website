import { Article } from './Article';
import { Locale } from './Locale';

export interface ArticleRepository {
  fetchArticles(locale: Locale): Promise<Article[]>;
}

export const ArticleRepositoryToken = Symbol.for('ArticleRepository');
