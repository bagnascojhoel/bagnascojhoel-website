export interface LocalizedMessagesRepository {
  loadMessages(locale: string): Promise<Record<string, any>>;
}

export const LocalizedMessagesRepositoryToken = Symbol.for('LocalizedMessagesRepository');
