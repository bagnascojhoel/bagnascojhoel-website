/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import { CertificationRepositoryJsonAdapter } from '../../src/core/infrastructure/CertificationRepositoryJsonAdapter';
import { MockLogger } from '../fixtures/mockLogger';
import { Locale } from '../../src/core/domain/Locale';

describe('CertificationRepositoryJson', () => {
  let repository: CertificationRepositoryJsonAdapter;
  let mockLogger: MockLogger;
  beforeEach(() => {
    mockLogger = new MockLogger();
    repository = new CertificationRepositoryJsonAdapter(mockLogger);
  });
  describe('fetchCertifications', () => {
    it('should return English certifications for locale "en"', async () => {
      const result = await repository.fetchCertifications(Locale.EN);
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
    });
    it('should return Portuguese certifications for locale "pt-br"', async () => {
      const result = await repository.fetchCertifications(Locale.PT_BR);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
    it('should return certifications with correct structure', async () => {
      const result = await repository.fetchCertifications(Locale.EN);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('type', 'Certification');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('tags');
      expect(result[0]).toHaveProperty('certificationUrl');
    });
    it('should return certifications with expected English data', async () => {
      const result = await repository.fetchCertifications(Locale.EN);
      expect(result[0].id).toBe('21f63263-de6e-4510-967c-989d3def8859');
      expect(result[0].title).toBe('AWS Cloud Practitioner');
      expect(result[1].id).toBe('32cf2d0f-2ded-4011-b8dc-0eca3e0cd4e7');
      expect(result[1].title).toBe('Java SE 11 Developer');
    });
    it('should return an array', async () => {
      const result = await repository.fetchCertifications(Locale.EN);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
