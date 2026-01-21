import { inject, injectable } from 'inversify';
import { PublicWorkItem } from '@/core/domain/PublicWorkItem';
import {
  GetPublicWorkItemsService,
  GetPublicWorkItemsServiceToken,
} from '../domain/GetPublicWorkItemsService';
import { LoggerToken } from '@/core/domain/Logger';
import type { Logger } from '@/core/domain/Logger';

@injectable()
export class PublicWorkApplicationService {
  private cache: { timestamp: number; items: PublicWorkItem[] } | null = null;
  private readonly cacheTtlMs: number = Number(process.env.PUBLIC_WORK_CACHE_TTL_MS || 3600000);

  constructor(
    @inject(GetPublicWorkItemsServiceToken)
    private getPublicWorkItemsService: GetPublicWorkItemsService,
    @inject(LoggerToken) private logger: Logger
  ) {}

  async getAll(): Promise<PublicWorkItem[]> {
    const now = Date.now();
    if (this.cache && now - this.cache.timestamp < this.cacheTtlMs) {
      this.logger.addBreadcrumb('PublicWork cache hit');
      return this.cache.items;
    }
    this.logger.addBreadcrumb('Fetching public work items', {
      cacheTtlMs: this.cacheTtlMs,
    });
    const result = await this.getPublicWorkItemsService.getAll();
    this.cache = { timestamp: now, items: result };
    this.logger.addBreadcrumb('PublicWork cache updated', {
      itemCount: result.length,
    });
    return result;
  }
}

export const PublicWorkApplicationServiceToken = 'PublicWorkApplicationService';
