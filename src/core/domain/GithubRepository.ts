import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';
import { ExtraPortfolioDescription } from './ExtraPortfolioDescription';

export interface GithubRepository {
  fetchRepositories(): Promise<GithubCodeRepository[]>;

  fetchExtraPortfolioDescription(
    owner: string,
    repo: string
  ): Promise<ExtraPortfolioDescription | null>;
}

export const GithubRepositoryToken = Symbol.for('GithubRepository');
