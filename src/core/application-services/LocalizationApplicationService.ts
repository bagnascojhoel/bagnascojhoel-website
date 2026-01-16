import { inject, injectable } from 'inversify';
import type { LocalizedMessagesRepository } from '@/core/domain/LocalizedMessagesRepository';
import { LocalizedMessagesRepositoryToken } from '@/core/domain/LocalizedMessagesRepository';

@injectable()
export class LocalizationApplicationService {
  constructor(
    @inject(LocalizedMessagesRepositoryToken)
    private messagesRepository: LocalizedMessagesRepository
  ) {}

  public async getLocalizedMessages(locale: string): Promise<Record<string, any>> {
    return await this.messagesRepository.loadMessages(locale);
  }
}

export const LocalizationApplicationServiceToken = 'LocalizationApplicationService';
