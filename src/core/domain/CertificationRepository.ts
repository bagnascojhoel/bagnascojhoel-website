import { Certification } from '@/core/domain/Certification';
import { Locale } from './Locale';

export interface CertificationRepository {
  fetchCertifications(locale: Locale): Promise<Certification[]>;
}

export const CertificationRepositoryToken = Symbol.for('CertificationRepository');
