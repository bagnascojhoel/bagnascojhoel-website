import { GitHubCodeRepository as GitHubRepoModel } from '@/core/domain/GitHubCodeRepository';

export interface GitHubRepository {
  fetchRepositories(): Promise<GitHubRepoModel[]>;
}

export const GitHubRepositoryToken = Symbol.for('GitHubRepository');
