import { Project, ProjectBuilder } from '@/core/domain/Project';
import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';
import { GithubRepositoryToken } from './GithubRepository';
import type { GithubRepository } from './GithubRepository';
import { inject, injectable } from 'inversify';
import { DEFAULT_LOCALE, Locale } from './Locale';
import { ExtraPortfolioDescription } from './ExtraPortfolioDescription';

@injectable()
export class ProjectFactory {
  constructor(@inject(GithubRepositoryToken) private githubRepository: GithubRepository) {}

  public async create(repo: GithubCodeRepository, locale: Locale): Promise<Project> {
    const extraPortfolioDescription = await this.fetchExtraPortfolioDescription(
      repo.owner,
      repo.name,
      locale
    );
    const builder = new ProjectBuilder()
      .withId(`gh-${repo.id}`)
      .withTitle(repo.name)
      .withDescription(repo.description || '')
      .withTags(
        repo.topics && repo.topics.length ? repo.topics : repo.language ? [repo.language] : []
      )
      .withLink(repo.htmlUrl)
      .withCreatedAt(repo.createdAt)
      .withUpdatedAt(repo.updatedAt);
    if (extraPortfolioDescription) {
      if (extraPortfolioDescription.customDescription) {
        builder.withDescription(extraPortfolioDescription.customDescription);
      }
      if (extraPortfolioDescription.websiteUrl) {
        builder.withWebsiteUrl(extraPortfolioDescription.websiteUrl);
      }
      if (extraPortfolioDescription.complexity) {
        builder.withComplexity(extraPortfolioDescription.complexity);
      }
      if (extraPortfolioDescription.startsOpen !== undefined) {
        builder.withStartsOpen(extraPortfolioDescription.startsOpen);
      }
    }
    return builder.build();
  }

  private async fetchExtraPortfolioDescription(
    owner: string,
    repo: string,
    locale: Locale
  ): Promise<ExtraPortfolioDescription | null> {
    try {
      return await this.githubRepository.fetchExtraPortfolioDescription(owner, repo, locale);
    } catch (error) {
      if (locale !== DEFAULT_LOCALE) {
        return await this.fetchExtraPortfolioDescription(owner, repo, DEFAULT_LOCALE);
      } else {
        console.error('Error fetching extra portfolio description:', error);
      }
    }
    return null;
  }
}

export const ProjectFactoryToken = Symbol.for('ProjectFactory');
