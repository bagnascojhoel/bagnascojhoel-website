/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest" />
import { ProjectFactory } from '@/core/domain/ProjectFactory';

const mockRepo = {
  id: 1,
  name: 'test-repo',
  fullName: 'user/test-repo',
  description: 'A test repo',
  htmlUrl: 'https://github.com/user/test-repo',
  topics: ['ts', 'react'],
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-02T00:00:00Z',
  language: 'TypeScript',
  stargazersCount: 10,
};

describe('ProjectFactory', () => {
  it('should transform a GitHub repository into a Project', () => {
    const project = ProjectFactory.fromGitHubRepository(mockRepo as any);

    expect(project.id).toBe('gh-1');
    expect(project.type).toBe('Project');
    expect(project.title).toBe('test-repo');
    expect(project.link).toBe('https://github.com/user/test-repo');
    expect(project.tags).toEqual(['ts', 'react']);
  });

  it('should create multiple projects', () => {
    const projects = ProjectFactory.fromGitHubRepositories([mockRepo as any]);
    expect(projects).toHaveLength(1);
  });
});
