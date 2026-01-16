/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, beforeEach } from 'vitest';
import { Container } from 'inversify';
import { LocalizationApplicationService } from '../../src/core/application-services/LocalizationApplicationService';
import type { LocalizedMessagesRepository } from '../../src/core/domain/LocalizedMessagesRepository';
import { LocalizedMessagesRepositoryToken } from '../../src/core/domain/LocalizedMessagesRepository';
import { mockMessagesEn, mockMessagesPtBr } from '../fixtures';

describe('LocalizationApplicationService', () => {
  let service: LocalizationApplicationService;
  let mockRepository: LocalizedMessagesRepository;
  let container: Container;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      loadMessages: async (locale: string) => {
        if (locale === 'en') return mockMessagesEn;
        if (locale === 'pt-br') return mockMessagesPtBr;
        throw new Error(`Unsupported locale: ${locale}`);
      },
    };

    // Set up InversifyJS container
    container = new Container();
    container
      .bind<LocalizedMessagesRepository>(LocalizedMessagesRepositoryToken)
      .toConstantValue(mockRepository);
    container.bind<LocalizationApplicationService>(LocalizationApplicationService).toSelf();

    // Resolve service
    service = container.get<LocalizationApplicationService>(LocalizationApplicationService);
  });

  describe('getLocalizedMessages', () => {
    it('should delegate to repository and return English messages', async () => {
      const result = await service.getLocalizedMessages('en');

      expect(result).toEqual(mockMessagesEn);
      expect(result.hero.greeting).toBe('Hello');
    });

    it('should delegate to repository and return Portuguese messages', async () => {
      const result = await service.getLocalizedMessages('pt-br');

      expect(result).toEqual(mockMessagesPtBr);
      expect(result.hero.greeting).toBe('Olá');
    });

    it('should return an object with message structure', async () => {
      const result = await service.getLocalizedMessages('en');

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('hero');
      expect(result).toHaveProperty('navigation');
    });

    it('should preserve nested message structure from repository', async () => {
      const result = await service.getLocalizedMessages('pt-br');

      expect(result.hero).toHaveProperty('greeting', 'Olá');
      expect(result.hero).toHaveProperty('title', 'Bem-vindo');
      expect(result.navigation).toHaveProperty('home', 'Início');
      expect(result.navigation).toHaveProperty('about', 'Sobre');
    });

    it('should throw error when repository throws for unsupported locale', async () => {
      await expect(service.getLocalizedMessages('fr')).rejects.toThrow('Unsupported locale: fr');
    });
  });
});
