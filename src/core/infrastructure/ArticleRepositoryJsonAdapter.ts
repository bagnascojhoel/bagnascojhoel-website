import { inject, injectable } from 'inversify';
import { ArticleRepository } from '@/core/domain/ArticleRepository';
import type { Logger } from '@/core/domain/Logger';
import { LoggerToken } from '@/core/domain/Logger';
import { Article } from '../domain/Article';
import { Locale } from '../domain/Locale';
import { LocalizedDataLoader } from './LocalizedDataLoader';
import articlesEn from '../../../data/articles_en.json';
import articlesPtBr from '../../../data/articles_pt-br.json';

@injectable()
export class ArticleRepositoryJsonAdapter implements ArticleRepository {
  private dataLoader: LocalizedDataLoader<Article[]>;

  constructor(@inject(LoggerToken) private logger: Logger) {
    const dataMap = new Map<Locale, Article[]>();
    dataMap.set(Locale.EN, articlesEn as Article[]);
    dataMap.set(Locale.PT_BR, articlesPtBr as Article[]);
    this.dataLoader = new LocalizedDataLoader<Article[]>(dataMap, this.logger);
  }

  async fetchArticles(locale: Locale): Promise<Article[]> {
    return this.dataLoader.loadData(locale);
  }
}
