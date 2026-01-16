/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect } from 'vitest';
import { LocaleNotSupportedError } from '../../src/core/domain/LocaleNotSupportedError';

describe('LocaleNotSupportedError', () => {
  it('should be an instance of Error', () => {
    const error = new LocaleNotSupportedError('fr');
    expect(error).toBeInstanceOf(Error);
  });

  it('should be an instance of LocaleNotSupportedError', () => {
    const error = new LocaleNotSupportedError('fr');
    expect(error).toBeInstanceOf(LocaleNotSupportedError);
  });

  it('should store the locale property', () => {
    const error = new LocaleNotSupportedError('fr');
    expect(error.locale).toBe('fr');
  });

  it('should have correct error message format', () => {
    const error = new LocaleNotSupportedError('es');
    expect(error.message).toBe('Locale "es" is not supported.');
  });

  it('should have correct name property', () => {
    const error = new LocaleNotSupportedError('de');
    expect(error.name).toBe('LocaleNotSupportedError');
  });

  it('should work with empty string locale', () => {
    const error = new LocaleNotSupportedError('');
    expect(error.locale).toBe('');
    expect(error.message).toBe('Locale "" is not supported.');
  });

  it('should preserve locale with special characters', () => {
    const locale = 'pt-BR_special';
    const error = new LocaleNotSupportedError(locale);
    expect(error.locale).toBe(locale);
    expect(error.message).toContain(locale);
  });

  it('should be throwable and catchable', () => {
    expect(() => {
      throw new LocaleNotSupportedError('it');
    }).toThrow(LocaleNotSupportedError);
  });

  it('should be catchable as generic Error', () => {
    expect(() => {
      throw new LocaleNotSupportedError('it');
    }).toThrow(Error);
  });

  it('should preserve stack trace', () => {
    const error = new LocaleNotSupportedError('ja');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('LocaleNotSupportedError');
  });
});
