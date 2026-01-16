import { injectable } from 'inversify';
import { CertificationRepository as CertificationPort } from '@/core/domain/CertificationRepository';
import { Certification } from '@/core/domain/Certification';
import certificationsData from '../../../data/certifications.json';

@injectable()
export class CertificationRepositoryJson implements CertificationPort {
  async fetchCertifications(): Promise<Certification[]> {
    try {
      return certificationsData as Certification[];
    } catch (error) {
      console.error('Failed to read certifications JSON:', error);
      return [];
    }
  }
}
