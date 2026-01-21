import { Project, ProjectBuilder } from '@/core/domain/Project';
import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';

export class ProjectFactory {
  create(repo: GithubCodeRepository): Project {
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

  public createAll(repos: GithubCodeRepository[]): Project[] {
    return repos.map(r => this.create(r));
  }
}

export const ProjectFactoryToken = 'ProjectFactory';
