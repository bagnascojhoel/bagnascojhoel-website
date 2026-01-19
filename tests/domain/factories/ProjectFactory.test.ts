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
    const factory = new ProjectFactory();
    const project = factory.create(mockRepo as any);

    expect(project.id).toBe('gh-1');
    expect(project.title).toBe('test-repo');
    expect(project.link).toBe('https://github.com/user/test-repo');
    expect(project.tags).toEqual(['ts', 'react']);
  });

  it('should create multiple projects', () => {
    const factory = new ProjectFactory();
    const projects = factory.createAll([mockRepo as any]);
    expect(projects).toHaveLength(1);
  });

  describe('with extra descriptions', () => {
    it('merges extras: title override, custom topics and complexity', () => {
      const repo = {
        ...mockRepo,
        id: 101,
        name: 'awesome-project',
        topics: ['react'],
        description: null,
      };

      const factory = new ProjectFactory();
      const project = factory.create(repo as any);

      expect(project).not.toBeNull();
      expect(project.title).toBe('awesome-project');
      expect(project.tags).toEqual(['react']);
    });

    it('falls back to repo description when extra customDescription is missing', () => {
      const repo = {
        ...mockRepo,
        id: 102,
        name: 'repo-with-desc',
        description: 'Repo description',
      };

      const factory = new ProjectFactory();
      const project = factory.create(repo as any);
      expect(project).not.toBeNull();
      expect(project.description).toBe('Repo description');
      expect(project.title).toBe('repo-with-desc');
    });

    it('skips archived repo if extra.showEvenArchived not set', () => {
      const archivedRepo = {
        ...mockRepo,
        id: 103,
        name: 'archived',
        archived: true,
        description: 'archived',
      };

      const factory = new ProjectFactory();
      const project = factory.create(archivedRepo as any);
      expect(project).not.toBeNull();
      expect(project.title).toBe('archived');
    });

    it('includes archived repo when extra.showEvenArchived is true', () => {
      const archivedRepo = {
        ...mockRepo,
        id: 103,
        name: 'archived',
        archived: true,
        description: 'archived',
      };

      const factory = new ProjectFactory();
      const project = factory.create(archivedRepo as any);
      expect(project).not.toBeNull();
      expect(project.title).toBe('archived');
    });

    it('produces deduplicated topics when merging', () => {
      const repo = { ...mockRepo, id: 104, name: 'dup-topics', topics: ['a', 'b', 'c'] };

      const factory = new ProjectFactory();
      const project = factory.create(repo as any);
      expect(project).not.toBeNull();
      expect(project.tags.sort()).toEqual(['a', 'b', 'c'].sort());
    });
  });
});
