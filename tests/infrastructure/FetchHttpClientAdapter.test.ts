import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FetchHttpClientAdapter } from '@/core/infrastructure/FetchHttpClientAdapter';
import type { Logger } from '@/core/domain/Logger';

describe('FetchHttpClientAdapter', () => {
  let httpClient: FetchHttpClientAdapter;
  let mockLogger: Logger;
  beforeEach(() => {
    mockLogger = {
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
      captureException: vi.fn(),
      setUser: vi.fn(),
      setTags: vi.fn(),
      addBreadcrumb: vi.fn(),
    };
    httpClient = new FetchHttpClientAdapter(mockLogger);
    global.fetch = vi.fn();
  });
  describe('successful requests', () => {
    it('should log breadcrumb with auto-generated operation name from URL', async () => {
      const mockResponse = new Response('{"data": "test"}', {
        status: 200,
        statusText: 'OK',
      });
      vi.mocked(global.fetch).mockResolvedValue(mockResponse);
      await httpClient.fetch('https://api.example.com/users/123', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(mockLogger.addBreadcrumb).toHaveBeenCalledWith(
        'GET /users/123: GET https://api.example.com/users/123',
        expect.objectContaining({
          type: 'http',
          category: 'request',
          url: 'https://api.example.com/users/123',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
    it('should sanitize sensitive headers', async () => {
      const mockResponse = new Response('{}', { status: 200 });
      vi.mocked(global.fetch).mockResolvedValue(mockResponse);
      await httpClient.fetch('https://api.example.com/data', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer secret-token',
          'Content-Type': 'application/json',
          Cookie: 'session=abc123',
        },
      });
      expect(mockLogger.addBreadcrumb).toHaveBeenCalledWith(
        'GET /data: GET https://api.example.com/data',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
    it('should log success breadcrumb with duration', async () => {
      const mockResponse = new Response('{"data": "test"}', {
        status: 200,
        statusText: 'OK',
      });
      vi.mocked(global.fetch).mockResolvedValue(mockResponse);
      await httpClient.fetch('https://api.example.com/data', { method: 'GET' });
      expect(mockLogger.addBreadcrumb).toHaveBeenCalledWith(
        'GET /data succeeded',
        expect.objectContaining({
          type: 'http',
          category: 'response',
          status: 200,
          duration: expect.any(Number),
        })
      );
    });
    it('should default to GET method when not specified', async () => {
      const mockResponse = new Response('{}', { status: 200 });
      vi.mocked(global.fetch).mockResolvedValue(mockResponse);
      await httpClient.fetch('https://api.example.com/data');
      expect(mockLogger.addBreadcrumb).toHaveBeenCalledWith(
        'GET /data: GET https://api.example.com/data',
        expect.any(Object)
      );
    });
  });
  describe('non-OK status codes', () => {
    it('should log warning for 4xx status codes', async () => {
      const mockResponse = new Response('Not Found', {
        status: 404,
        statusText: 'Not Found',
      });
      vi.mocked(global.fetch).mockResolvedValue(mockResponse);
      const response = await httpClient.fetch('https://api.example.com/missing', {
        method: 'GET',
      });
      expect(response.status).toBe(404);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'GET /missing returned non-OK status',
        expect.objectContaining({
          status: 404,
          statusText: 'Not Found',
          url: 'https://api.example.com/missing',
          duration: expect.any(Number),
        })
      );
    });
    it('should log warning for 5xx status codes', async () => {
      const mockResponse = new Response('Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
      vi.mocked(global.fetch).mockResolvedValue(mockResponse);
      await httpClient.fetch('https://api.example.com/error', { method: 'POST' });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'POST /error returned non-OK status',
        expect.objectContaining({
          status: 500,
          statusText: 'Internal Server Error',
        })
      );
    });
  });
  describe('network failures', () => {
    it('should log error and rethrow on network failure', async () => {
      const networkError = new Error('Network connection failed');
      vi.mocked(global.fetch).mockRejectedValue(networkError);
      await expect(
        httpClient.fetch('https://api.example.com/data', { method: 'GET' })
      ).rejects.toThrow('Network connection failed');
      expect(mockLogger.error).toHaveBeenCalledWith(
        networkError,
        expect.objectContaining({
          url: 'https://api.example.com/data',
          method: 'GET',
          duration: expect.any(Number),
        })
      );
    });
    it('should handle non-Error thrown values', async () => {
      vi.mocked(global.fetch).mockRejectedValue('String error');
      await expect(httpClient.fetch('https://api.example.com/data')).rejects.toBe('String error');
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          url: 'https://api.example.com/data',
        })
      );
    });
  });
  describe('header sanitization', () => {
    it('should handle requests without headers', async () => {
      const mockResponse = new Response('{}', { status: 200 });
      vi.mocked(global.fetch).mockResolvedValue(mockResponse);
      await httpClient.fetch('https://api.example.com/data');
      expect(mockLogger.addBreadcrumb).toHaveBeenCalledWith(
        'GET /data: GET https://api.example.com/data',
        expect.objectContaining({
          headers: {},
        })
      );
    });
  });
});
