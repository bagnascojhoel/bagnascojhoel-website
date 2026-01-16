import { Certification } from '@/core/domain/Certification';

export interface CertificationRepository {
  fetchCertifications(): Promise<Certification[]>;
}

export const CertificationRepositoryToken = Symbol.for('CertificationRepository');
