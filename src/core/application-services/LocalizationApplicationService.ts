import { inject, injectable } from 'inversify';
import type { LocalizedMessagesRepository } from '@/core/domain/LocalizedMessagesRepository';
import type { Logger } from '@/core/domain/Logger';
import { LocalizedMessagesRepositoryToken } from '@/core/domain/LocalizedMessagesRepository';
import { LoggerToken } from '@/core/domain/Logger';

@injectable()
export class LocalizationApplicationService {
  constructor(
    @inject(LocalizedMessagesRepositoryToken)
    private messagesRepository: LocalizedMessagesRepository,
    @inject(LoggerToken) private logger: Logger
  ) {}

  public async getLocalizedMessages(locale: string): Promise<Record<string, unknown>> {
    try {
      this.logger.addBreadcrumb('Loading localized messages', { locale });
      const messages = await this.messagesRepository.loadMessages(locale);
      return messages;
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error('Failed to load localized messages'),
        { locale }
      );
      throw error;
    }
  }
}

export const LocalizationApplicationServiceToken = 'LocalizationApplicationService';
