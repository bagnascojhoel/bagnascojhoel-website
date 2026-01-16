/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect } from 'vitest';
import { Locale, LOCALES, isValidLocale } from '../../src/core/domain/Locale';

describe('Locale', () => {
  describe('Locale enum', () => {
    it('should have EN locale', () => {
      expect(Locale.EN).toBe('en');
    });

    it('should have PT_BR locale', () => {
      expect(Locale.PT_BR).toBe('pt-br');
    });
  });

  describe('LOCALES', () => {
    it('should contain all locale values', () => {
      expect(LOCALES).toEqual(['en', 'pt-br']);
    });

    it('should have exactly 2 supported locales', () => {
      expect(LOCALES).toHaveLength(2);
    });
  });

  describe('isValidLocale', () => {
    it('should return true for valid EN locale', () => {
      expect(isValidLocale('en')).toBe(true);
    });

    it('should return true for valid PT_BR locale', () => {
      expect(isValidLocale('pt-br')).toBe(true);
    });

    it('should return false for invalid locale', () => {
      expect(isValidLocale('fr')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidLocale('')).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidLocale(undefined as any)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidLocale(null as any)).toBe(false);
    });

    it('should return false for numeric value', () => {
      expect(isValidLocale(123 as any)).toBe(false);
    });

    it('should return false for object', () => {
      expect(isValidLocale({} as any)).toBe(false);
    });

    it('should be case sensitive - uppercase should fail', () => {
      expect(isValidLocale('EN')).toBe(false);
    });

    it('should be case sensitive - mixed case should fail', () => {
      expect(isValidLocale('En')).toBe(false);
    });

    it('should return false for locale with extra spaces', () => {
      expect(isValidLocale(' en ')).toBe(false);
    });

    it('should return false for similar but incorrect locale', () => {
      expect(isValidLocale('pt-BR')).toBe(false); // uppercase BR
      expect(isValidLocale('pt_br')).toBe(false); // underscore instead of dash
    });
  });
});
