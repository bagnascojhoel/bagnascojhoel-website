/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Container } from 'inversify';
import { PublicWorkApplicationService } from '@/core/application-services/PublicWorkApplicationService';
import { GithubRepositoryRestAdapter } from '@/core/infrastructure/GithubRepositoryRestAdapter';
import { ArticleRepositoryJsonAdapter } from '@/core/infrastructure/ArticleRepositoryJsonAdapter';
import { CertificationRepositoryJsonAdapter } from '@/core/infrastructure/CertificationRepositoryJsonAdapter';
import { ProjectFactory, ProjectFactoryToken } from '@/core/domain/ProjectFactory';
import {
  GetPublicWorkItemsService,
  GetPublicWorkItemsServiceToken,
} from '@/core/domain/GetPublicWorkItemsService';
import { MockLogger } from '../fixtures/mockLogger';
import type { GithubRepository } from '@/core/domain/GithubRepository';
import type { ArticleRepository } from '@/core/domain/ArticleRepository';
import type { CertificationRepository } from '@/core/domain/CertificationRepository';
import type { Logger } from '@/core/domain/Logger';
import { GithubRepositoryToken } from '@/core/domain/GithubRepository';
import { ArticleRepositoryToken } from '@/core/domain/ArticleRepository';
import { CertificationRepositoryToken } from '@/core/domain/CertificationRepository';
import { LoggerToken } from '@/core/domain/Logger';

// Mock GitHub API response data
const mockGitHubApiResponse = [
  {
    id: 123456,
    name: 'kwik-ecommerce',
    full_name: 'bagnascojhoel/kwik-ecommerce',
    owner: { login: 'bagnascojhoel' },
    description: 'Ecommerce application built with Java 17, Spring Boot, and Postgres',
    html_url: 'https://github.com/bagnascojhoel/kwik-ecommerce',
    homepage: null,
    topics: ['spring-boot', 'react', 'typescript', 'aws'],
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-12-01T15:30:00Z',
    pushed_at: '2024-12-01T15:30:00Z',
    language: 'Java',
    stargazers_count: 5,
    archived: false,
  },
  {
    id: 789012,
    name: 'portfolio-website-monorepo',
    full_name: 'bagnascojhoel/portfolio-website-monorepo',
    owner: { login: 'bagnascojhoel' },
    description: 'Monorepo including front-end, BFF, and blog',
    html_url: 'https://github.com/bagnascojhoel/portfolio-website-monorepo',
    homepage: 'https://example.com',
    topics: ['java', 'svelte', 'monorepo'],
    created_at: '2023-06-20T08:00:00Z',
    updated_at: '2024-11-15T12:00:00Z',
    pushed_at: '2024-11-15T12:00:00Z',
    language: 'TypeScript',
    stargazers_count: 3,
    archived: false,
  },
];

// Set up MSW server
const server = setupServer(
  // Mock GitHub API endpoint
  http.get('https://api.github.com/users/bagnascojhoel/repos', ({ request }) => {
    const url = new URL(request.url);
    const perPage = url.searchParams.get('per_page');
    const sort = url.searchParams.get('sort');
    const direction = url.searchParams.get('direction');

    // Validate query parameters
    if (perPage === '100' && sort === 'pushed' && direction === 'desc') {
      return HttpResponse.json(mockGitHubApiResponse);
    }

    return HttpResponse.json(mockGitHubApiResponse);
  })
);

describe('PublicWorkApplicationService Integration Tests', () => {
  beforeAll(() => {
    // Start MSW server before all tests
    server.listen({ onUnhandledRequest: 'warn' });
  });

  afterEach(() => {
    // Reset handlers after each test
    server.resetHandlers();
  });

  afterAll(() => {
    // Clean up after all tests
    server.close();
  });

  describe('getAll - happy path', () => {
    it('should fetch and aggregate all public work items from REST APIs and local data', async () => {
      // Arrange: Set up the DI container with real implementations
      const container = new Container();
      const logger = new MockLogger();

      container.bind<GithubRepository>(GithubRepositoryToken).to(GithubRepositoryRestAdapter);
      container.bind<ArticleRepository>(ArticleRepositoryToken).to(ArticleRepositoryJsonAdapter);
      container
        .bind<CertificationRepository>(CertificationRepositoryToken)
        .to(CertificationRepositoryJsonAdapter);
      container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
      container.bind<Logger>(LoggerToken).toConstantValue(logger);
      container
        .bind<GetPublicWorkItemsService>(GetPublicWorkItemsServiceToken)
        .to(GetPublicWorkItemsService);
      container.bind<PublicWorkApplicationService>(PublicWorkApplicationService).toSelf();

      const service = container.get(PublicWorkApplicationService);

      // Act: Call the service method
      const result = await service.getAll('en');

      // Assert: Verify the aggregated result contains all work item types
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Verify we have projects from GitHub
      const projects = result.filter((item: any) => item.workItemType === 'project');
      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0]).toHaveProperty('title');
      expect(projects[0]).toHaveProperty('description');
      expect(projects[0]).toHaveProperty('tags');

      // Verify we have articles from local JSON
      const articles = result.filter((item: any) => item.workItemType === 'article');
      expect(articles.length).toBeGreaterThan(0);
      expect(articles[0]).toHaveProperty('title');
      expect(articles[0]).toHaveProperty('description');
      expect(articles[0]).toHaveProperty('tags');

      // Verify we have certifications from local JSON
      const certifications = result.filter((item: any) => item.workItemType === 'certification');
      expect(certifications.length).toBeGreaterThan(0);
      expect(certifications[0]).toHaveProperty('title');
      expect(certifications[0]).toHaveProperty('description');
      expect(certifications[0]).toHaveProperty('tags');

      // Verify logger was used
      expect(logger.breadcrumbs.length).toBeGreaterThan(0);
    });
  });
});
