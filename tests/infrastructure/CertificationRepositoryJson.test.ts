/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, beforeEach } from 'vitest';
import { CertificationRepositoryJsonAdapter } from '../../src/core/infrastructure/CertificationRepositoryJsonAdapter';

describe('CertificationRepositoryJson', () => {
  let repository: CertificationRepositoryJsonAdapter;

  beforeEach(() => {
    repository = new CertificationRepositoryJsonAdapter();
  });

  describe('fetchCertifications', () => {
    it('should return all certifications from JSON file', async () => {
      const result = await repository.fetchCertifications();

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
    });

    it('should return certifications with correct structure', async () => {
      const result = await repository.fetchCertifications();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('type', 'Certification');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('tags');
      expect(result[0]).toHaveProperty('link');
    });

    it('should return certifications with expected data', async () => {
      const result = await repository.fetchCertifications();

      expect(result[0].id).toBe('cert-1');
      expect(result[0].title).toBe('AWS Certified Solutions Architect - Associate');
      expect(result[1].id).toBe('cert-2');
      expect(result[1].title).toBe('Oracle Certified Professional: Java SE 11 Developer');
    });

    it('should return an array', async () => {
      const result = await repository.fetchCertifications();

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
