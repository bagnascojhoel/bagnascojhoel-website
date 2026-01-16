export class LocaleNotSupportedError extends Error {
  constructor(public locale: string) {
    super(`Locale "${locale}" is not supported.`);
    this.name = 'LocaleNotSupportedError';
  }
}
