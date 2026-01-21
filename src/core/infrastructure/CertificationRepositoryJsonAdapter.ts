import { inject, injectable } from 'inversify';
import { CertificationRepository } from '@/core/domain/CertificationRepository';
import { Certification } from '@/core/domain/Certification';
import type { Logger } from '@/core/domain/Logger';
import { LoggerToken } from '@/core/domain/Logger';
import { LocalizedDataLoader } from './LocalizedDataLoader';
import { Locale } from '../domain/Locale';
import certificationsEn from '../../../data/certifications_en.json';
import certificationsPtBr from '../../../data/certifications_pt-br.json';

@injectable()
export class CertificationRepositoryJsonAdapter implements CertificationRepository {
  private dataLoader: LocalizedDataLoader<Certification[]>;

  constructor(@inject(LoggerToken) private logger: Logger) {
    const dataMap = new Map<Locale, Certification[]>();
    dataMap.set(Locale.EN, certificationsEn as Certification[]);
    dataMap.set(Locale.PT_BR, certificationsPtBr as Certification[]);
    this.dataLoader = new LocalizedDataLoader<Certification[]>(dataMap, this.logger);
  }

  async fetchCertifications(locale: Locale): Promise<Certification[]> {
    return this.dataLoader.loadData(locale);
  }
}
