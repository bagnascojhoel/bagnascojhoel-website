import { injectable } from 'inversify';
import { LocalizedMessagesRepository } from '@/core/domain/LocalizedMessagesRepository';

@injectable()
export class LocalizedMessagesRepositoryJson implements LocalizedMessagesRepository {
  async loadMessages(locale: string): Promise<Record<string, unknown>> {
    return (await import(`../../../data/messages/${locale}.json`)).default;
  }
}
