export interface LocalizedMessagesRepository {
  loadMessages(locale: string): Promise<Record<string, unknown>>;
}

export const LocalizedMessagesRepositoryToken = Symbol.for('LocalizedMessagesRepository');
