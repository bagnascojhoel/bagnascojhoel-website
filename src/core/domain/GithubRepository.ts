import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';
import { ExtraPortfolioDescription } from './ExtraPortfolioDescription';
import { Locale } from './Locale';

export interface GithubRepository {
  fetchRepositories(): Promise<GithubCodeRepository[]>;

  fetchExtraPortfolioDescription(
    owner: string,
    repo: string,
    locale: Locale
  ): Promise<ExtraPortfolioDescription | null>;
}

export const GithubRepositoryToken = Symbol.for('GithubRepository');
