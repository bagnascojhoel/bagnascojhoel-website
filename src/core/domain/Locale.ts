export enum Locale {
  EN = 'en',
  PT_BR = 'pt-br',
}

export const LOCALES = [Locale.EN, Locale.PT_BR] as const;

export const DEFAULT_LOCALE = Locale.EN;

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
