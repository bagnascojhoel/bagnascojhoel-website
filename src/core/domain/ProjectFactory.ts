import { Project, ProjectBuilder } from '@/core/domain/Project';
import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';
import { GithubRepositoryToken } from './GithubRepository';
import type { GithubRepository } from './GithubRepository';
import { inject, injectable } from 'inversify';

@injectable()
export class ProjectFactory {
  constructor(@inject(GithubRepositoryToken) private githubRepository: GithubRepository) {}

  public async create(repo: GithubCodeRepository): Promise<Project> {
    let extraPortfolioDescription;
    try {
      extraPortfolioDescription = await this.githubRepository.fetchExtraPortfolioDescription(
        repo.owner,
        repo.name
      );
    } catch (error) {
      console.error('Error fetching extra portfolio description:', error);
    }
    if (!extraPortfolioDescription) {
      return new ProjectBuilder()
        .withId(`gh-${repo.id}`)
        .withTitle(repo.name)
        .withDescription(repo.description || '')
        .withTags(
          repo.topics && repo.topics.length ? repo.topics : repo.language ? [repo.language] : []
        )
        .withLink(repo.htmlUrl)
        .withCreatedAt(repo.createdAt)
        .withUpdatedAt(repo.updatedAt)
        .build();
    }
    return new ProjectBuilder()
      .withId(`gh-${repo.id}`)
      .withTitle(repo.name)
      .withDescription(repo.description || '')
      .withTags(
        repo.topics && repo.topics.length ? repo.topics : repo.language ? [repo.language] : []
      )
      .withLink(repo.htmlUrl)
      .withCreatedAt(repo.createdAt)
      .withUpdatedAt(repo.updatedAt)
      .build();
  }
}

export const ProjectFactoryToken = Symbol.for('ProjectFactory');
