/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, beforeEach } from 'vitest';
import { LocalizedMessagesRepositoryJsonAdapter } from '../../src/core/infrastructure/LocalizedMessagesRepositoryJson';

describe('LocalizedMessagesRepositoryJson', () => {
  let repository: LocalizedMessagesRepositoryJsonAdapter;

  beforeEach(() => {
    repository = new LocalizedMessagesRepositoryJsonAdapter();
  });

  describe('loadMessages', () => {
    it('should load English messages for "en" locale', async () => {
      const result = await repository.loadMessages('en');

      expect(result).toBeDefined();
      expect(result.Hero.greeting).toBe('Hey, I am');
      expect(result.Hero.name).toBe('Jhoel');
    });

    it('should load Portuguese messages for "pt-br" locale', async () => {
      const result = await repository.loadMessages('pt-br');

      expect(result).toBeDefined();
      expect(result.Hero.greeting).toBe('Olá, eu sou');
      expect(result.Hero.name).toBe('Jhoel');
    });

    it('should return an object with message keys', async () => {
      const result = await repository.loadMessages('en');

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('Hero');
      expect(result).toHaveProperty('Experience');
    });

    it('should load nested message structure correctly', async () => {
      const result = await repository.loadMessages('en');

      expect(result.Hero).toHaveProperty('greeting');
      expect(result.Hero).toHaveProperty('name');
      expect(result.Experience).toHaveProperty('title');
      expect(result.Experience).toHaveProperty('subtitle');
    });
  });
});
