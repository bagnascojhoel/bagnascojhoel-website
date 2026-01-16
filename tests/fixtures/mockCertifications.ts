/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Certification } from '../../src/core/domain/Certification';

export const mockCertification1: Certification = {
  id: 'cert-1',
  type: 'Certification',
  title: 'AWS Certified Solutions Architect - Associate',
  description:
    'Comprehensive certification covering AWS services, architecture design patterns, and cloud best practices.',
  tags: ['AWS', 'Cloud', 'Architecture'],
  link: 'https://aws.amazon.com/certification/',
};

export const mockCertification2: Certification = {
  id: 'cert-2',
  type: 'Certification',
  title: 'Oracle Certified Professional: Java SE 11 Developer',
  description:
    'Advanced Java certification covering modern Java features, concurrency, and best practices.',
  tags: ['Java', 'Oracle', 'Certification'],
  link: 'https://www.oracle.com/java/technologies/javase-certifications.html',
};

export const mockCertifications: Certification[] = [mockCertification1, mockCertification2];

export const mockCertificationsJsonData = {
  certifications: mockCertifications,
};
