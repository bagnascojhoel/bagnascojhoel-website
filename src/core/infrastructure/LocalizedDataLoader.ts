import type { Logger } from '@/core/domain/Logger';
import { LocaleNotSupportedError } from '@/core/domain/LocaleNotSupportedError';
import { Locale, LOCALES } from '../domain/Locale';

export class LocalizedDataLoader<T> {
  constructor(
    private dataMap: Map<Locale, T>,
    private logger: Logger
  ) {
    if (this.dataMap.size !== LOCALES.length) {
      const error = new LocaleNotSupportedError('Incomplete locale paths mapping');
      this.logger.error(error, {
        expectedLocales: LOCALES,
        providedLocales: Array.from(this.dataMap.keys()),
      });
      throw error;
    }
  }

  loadData(locale: Locale): T {
    return this.dataMap.get(locale)!;
  }
}
