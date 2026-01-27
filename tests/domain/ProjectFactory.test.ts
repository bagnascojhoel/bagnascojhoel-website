/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest" />
import { describe, it, expect, beforeEach } from 'vitest';
import { Container } from 'inversify';
import { ProjectFactory } from '@/core/domain/ProjectFactory';
import type { GithubRepository } from '@/core/domain/GithubRepository';
import { GithubRepositoryToken } from '@/core/domain/GithubRepository';
import { mockGitHubRepo1 } from '../fixtures';
import { LocaleNotSupportedError } from '@/core/domain/LocaleNotSupportedError';
import { Locale, DEFAULT_LOCALE } from '@/core/domain/Locale';

describe('ProjectFactory', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  describe('locale parameter handling', () => {
    it('should pass locale to fetchExtraPortfolioDescription', async () => {
      let capturedLocale = '';

      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [],
        fetchExtraPortfolioDescription: async (owner: string, repo: string, locale: string) => {
          capturedLocale = locale;
          return null;
        },
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind(ProjectFactory).toSelf();

      const factory = container.get(ProjectFactory);
      await factory.create(mockGitHubRepo1, Locale.PT_BR);

      expect(capturedLocale).toBe(Locale.PT_BR);
    });

    it('should fallback to DEFAULT_LOCALE when fetchExtraPortfolioDescription throws LocaleNotSupportedError', async () => {
      const capturedLocales: string[] = [];

      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [],
        fetchExtraPortfolioDescription: async (owner: string, repo: string, locale: string) => {
          capturedLocales.push(locale);
          if (locale !== DEFAULT_LOCALE) {
            throw new LocaleNotSupportedError(locale);
          }
          return {
            title: 'Enhanced Project',
            customDescription: 'Extra description in default locale',
            websiteUrl: 'https://example.com',
            complexity: 'medium' as const,
          };
        },
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind(ProjectFactory).toSelf();

      const factory = container.get(ProjectFactory);
      const project = await factory.create(mockGitHubRepo1, 'fr');

      expect(capturedLocales).toEqual(['fr', DEFAULT_LOCALE]);
      expect(project.description).toBe('Extra description in default locale');
    });

    it('should continue without extras when both requested and default locales fail with LocaleNotSupportedError', async () => {
      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [],
        fetchExtraPortfolioDescription: async (owner: string, repo: string, locale: string) => {
          throw new LocaleNotSupportedError(locale);
        },
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind(ProjectFactory).toSelf();

      const factory = container.get(ProjectFactory);
      const project = await factory.create(mockGitHubRepo1, 'ja');

      expect(project.id).toBe(`gh-${mockGitHubRepo1.id}`);
      expect(project.description).toBe(mockGitHubRepo1.description);
    });

    it('should continue without extras when fetchExtraPortfolioDescription throws non-locale error', async () => {
      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [],
        fetchExtraPortfolioDescription: async () => {
          throw new Error('Network error');
        },
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind(ProjectFactory).toSelf();

      const factory = container.get(ProjectFactory);
      const project = await factory.create(mockGitHubRepo1, Locale.EN);

      expect(project.id).toBe(`gh-${mockGitHubRepo1.id}`);
      expect(project.description).toBe(mockGitHubRepo1.description);
    });

    it('should create project with extras when locale is supported', async () => {
      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [],
        fetchExtraPortfolioDescription: async (owner: string, repo: string, locale: string) => {
          if (locale === Locale.EN) {
            return {
              title: 'Enhanced Project',
              customDescription: 'Enhanced description',
              websiteUrl: 'https://project-website.com',
              complexity: 'high' as const,
            };
          }
          return null;
        },
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind(ProjectFactory).toSelf();

      const factory = container.get(ProjectFactory);
      const project = await factory.create(mockGitHubRepo1, Locale.EN);

      expect(project.description).toBe('Enhanced description');
      expect(project.websiteUrl).toBe('https://project-website.com');
      expect(project.complexity).toBe('high');
    });

    it('should create project without extras when fetchExtraPortfolioDescription returns null', async () => {
      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [],
        fetchExtraPortfolioDescription: async () => null,
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind(ProjectFactory).toSelf();

      const factory = container.get(ProjectFactory);
      const project = await factory.create(mockGitHubRepo1, Locale.EN);

      expect(project.id).toBe(`gh-${mockGitHubRepo1.id}`);
      expect(project.title).toBe(mockGitHubRepo1.name);
      expect(project.description).toBe(mockGitHubRepo1.description);
    });
  });

  describe('existing functionality preservation', () => {
    it('should create project with repository data when no extras are available', async () => {
      const githubRepo: GithubRepository = {
        fetchRepositories: async () => [],
        fetchExtraPortfolioDescription: async () => null,
      };

      container.bind<GithubRepository>(GithubRepositoryToken).toConstantValue(githubRepo);
      container.bind(ProjectFactory).toSelf();

      const factory = container.get(ProjectFactory);
      const project = await factory.create(mockGitHubRepo1, Locale.EN);

      expect(project.id).toBe(`gh-${mockGitHubRepo1.id}`);
      expect(project.title).toBe(mockGitHubRepo1.name);
      expect(project.description).toBe(mockGitHubRepo1.description);
      expect(project.link).toBe(mockGitHubRepo1.htmlUrl);
      expect(project.tags).toEqual(mockGitHubRepo1.topics);
    });
  });
});
