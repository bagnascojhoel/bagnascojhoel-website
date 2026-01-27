/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { Project, ProjectBuilder } from '@/core/domain/Project';

describe('Project', () => {
  describe('hasEmptyDescription', () => {
    it('should return true when description is empty string', () => {
      const project = new Project('1', 'Title', '', ['tag1'], 'https://example.com');
      expect(project.hasEmptyDescription()).toBe(true);
    });

    it('should return true when description contains only whitespace', () => {
      const project = new Project('1', 'Title', '   ', ['tag1'], 'https://example.com');
      expect(project.hasEmptyDescription()).toBe(true);
    });

    it('should return true when description contains only tabs and newlines', () => {
      const project = new Project('1', 'Title', '\t\n  \n\t', ['tag1'], 'https://example.com');
      expect(project.hasEmptyDescription()).toBe(true);
    });

    it('should return false when description has valid content', () => {
      const project = new Project(
        '1',
        'Title',
        'Valid description',
        ['tag1'],
        'https://example.com'
      );
      expect(project.hasEmptyDescription()).toBe(false);
    });

    it('should return false when description has content with surrounding whitespace', () => {
      const project = new Project(
        '1',
        'Title',
        '  Valid description  ',
        ['tag1'],
        'https://example.com'
      );
      expect(project.hasEmptyDescription()).toBe(false);
    });
  });

  describe('ProjectBuilder', () => {
    it('should build a project with all required fields', () => {
      const project = new ProjectBuilder()
        .withId('1')
        .withTitle('Test Project')
        .withDescription('Test Description')
        .withTags(['tag1', 'tag2'])
        .withLink('https://example.com')
        .build();

      expect(project.id).toBe('1');
      expect(project.title).toBe('Test Project');
      expect(project.description).toBe('Test Description');
      expect(project.tags).toEqual(['tag1', 'tag2']);
      expect(project.link).toBe('https://example.com');
    });

    it('should build a project with optional fields', () => {
      const project = new ProjectBuilder()
        .withId('1')
        .withTitle('Test Project')
        .withDescription('Test Description')
        .withTags(['tag1'])
        .withLink('https://example.com')
        .withCreatedAt('2024-01-01T00:00:00Z')
        .withUpdatedAt('2024-01-02T00:00:00Z')
        .withWebsiteUrl('https://website.com')
        .withComplexity('high')
        .build();

      expect(project.createdAt).toBe('2024-01-01T00:00:00Z');
      expect(project.updatedAt).toBe('2024-01-02T00:00:00Z');
      expect(project.websiteUrl).toBe('https://website.com');
      expect(project.complexity).toBe('high');
    });

    it('should throw error when id is missing', () => {
      expect(() => {
        new ProjectBuilder()
          .withTitle('Test')
          .withDescription('Desc')
          .withTags(['tag1'])
          .withLink('https://example.com')
          .build();
      }).toThrow('Project id is required');
    });

    it('should throw error when title is missing', () => {
      expect(() => {
        new ProjectBuilder()
          .withId('1')
          .withDescription('Desc')
          .withTags(['tag1'])
          .withLink('https://example.com')
          .build();
      }).toThrow('Project title is required');
    });

    it('should throw error when description is missing', () => {
      expect(() => {
        new ProjectBuilder()
          .withId('1')
          .withTitle('Test')
          .withTags(['tag1'])
          .withLink('https://example.com')
          .build();
      }).toThrow('Project description is required');
    });

    it('should throw error when tags are missing', () => {
      expect(() => {
        new ProjectBuilder()
          .withId('1')
          .withTitle('Test')
          .withDescription('Desc')
          .withLink('https://example.com')
          .build();
      }).toThrow('Project tags are required');
    });

    it('should throw error when link is missing', () => {
      expect(() => {
        new ProjectBuilder()
          .withId('1')
          .withTitle('Test')
          .withDescription('Desc')
          .withTags(['tag1'])
          .build();
      }).toThrow('Project link is required');
    });
  });
});
