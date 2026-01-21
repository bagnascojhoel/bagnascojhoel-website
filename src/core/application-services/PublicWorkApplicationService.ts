import { inject, injectable } from 'inversify';
import { PublicWorkItem } from '@/core/domain/PublicWorkItem';
import {
  GetPublicWorkItemsService,
  GetPublicWorkItemsServiceToken,
} from '../domain/GetPublicWorkItemsService';
import { LoggerToken } from '@/core/domain/Logger';
import type { Logger } from '@/core/domain/Logger';
import { Locale } from '../domain/Locale';

interface CacheEntry {
  timestamp: number;
  items: PublicWorkItem[];
}

@injectable()
export class PublicWorkApplicationService {
  private cache: Map<Locale, CacheEntry> = new Map();
  private readonly cacheTtlMs: number = Number(process.env.PUBLIC_WORK_CACHE_TTL_MS || 3600000);

  constructor(
    @inject(GetPublicWorkItemsServiceToken)
    private getPublicWorkItemsService: GetPublicWorkItemsService,
    @inject(LoggerToken) private logger: Logger
  ) {}

  async getAll(locale: Locale): Promise<PublicWorkItem[]> {
    const now = Date.now();
    const cachedEntry = this.cache.get(locale);
    if (cachedEntry && now - cachedEntry.timestamp < this.cacheTtlMs) {
      this.logger.addBreadcrumb('PublicWork cache hit', { locale });
      return cachedEntry.items;
    }
    this.logger.addBreadcrumb('Fetching public work items', {
      locale,
      cacheTtlMs: this.cacheTtlMs,
    });
    const result = await this.getPublicWorkItemsService.getAll(locale);
    this.cache.set(locale, { timestamp: now, items: result });
    this.logger.addBreadcrumb('PublicWork cache updated', {
      locale,
      itemCount: result.length,
    });
    return result;
  }
}

export const PublicWorkApplicationServiceToken = 'PublicWorkApplicationService';
