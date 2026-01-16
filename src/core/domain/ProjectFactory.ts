import { Project } from '@/core/domain/Project';
import { GitHubCodeRepository } from '@/core/domain/GitHubCodeRepository';

export class ProjectFactory {
  static fromGitHubRepository(repo: GitHubCodeRepository): Project {
    return {
      id: `gh-${repo.id}`,
      type: 'Project',
      title: repo.name,
      description: repo.description || 'No description provided',
      tags: repo.topics && repo.topics.length ? repo.topics : repo.language ? [repo.language] : [],
      link: repo.htmlUrl,
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
    };
  }

  static fromGitHubRepositories(repos: GitHubCodeRepository[]): Project[] {
    return repos.map(r => this.fromGitHubRepository(r));
  }
}
