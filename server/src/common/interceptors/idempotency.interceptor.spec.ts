import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdempotencyInterceptor } from './idempotency.interceptor';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { of } from 'rxjs';

describe('IdempotencyInterceptor', () => {
  let interceptor: IdempotencyInterceptor;
  let mockReflector: any;
  let mockRedisService: any;
  let inMemoryStore: Map<string, string>;

  beforeEach(() => {
    inMemoryStore = new Map();
    mockReflector = {
      getAllAndOverride: vi.fn().mockReturnValue(null),
    };
    mockRedisService = {
      get: vi.fn().mockImplementation(async (key: string) => inMemoryStore.get(key) || null),
      set: vi.fn().mockImplementation(async (key: string, val: string) => {
        inMemoryStore.set(key, val);
      }),
      del: vi.fn().mockImplementation(async (key: string) => {
        inMemoryStore.delete(key);
      }),
    };

    interceptor = new IdempotencyInterceptor(mockReflector as any, mockRedisService as any);
  });

  const createMockContext = (headers: Record<string, string> = {}, method = 'POST', path = '/api/grants') => {
    const req = {
      headers,
      method,
      path,
      user: { id: 'scholar-1' },
    };
    const res = {
      statusCode: 201,
      setHeader: vi.fn(),
      status: vi.fn(),
    };

    return {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  };

  it('should throw BadRequestException if required but no Idempotency-Key header is provided', async () => {
    mockReflector.getAllAndOverride.mockReturnValue({ required: true });
    const context = createMockContext({});
    const next = { handle: () => of({ success: true }) };

    await expect(interceptor.intercept(context, next)).rejects.toThrow(BadRequestException);
  });

  it('should execute next handler and store COMPLETED record on first submission', async () => {
    const context = createMockContext({ 'idempotency-key': 'grant-sub-101' });
    const next = { handle: () => of({ grantId: 'grant-xyz', amount: 50000 }) };

    const observable = await interceptor.intercept(context, next);
    observable.subscribe((result) => {
      expect(result).toEqual({ grantId: 'grant-xyz', amount: 50000 });
      expect(inMemoryStore.size).toBe(1);
    });
  });

  it('should replay cached response on duplicate request with same Idempotency-Key', async () => {
    const redisKey = 'idempotency:scholar-1:POST:/api/grants:grant-sub-101';
    inMemoryStore.set(
      redisKey,
      JSON.stringify({
        state: 'COMPLETED',
        statusCode: 201,
        body: { grantId: 'grant-xyz', amount: 50000 },
        createdAt: new Date().toISOString(),
      }),
    );

    const context = createMockContext({ 'idempotency-key': 'grant-sub-101' });
    const next = { handle: vi.fn() };

    const observable = await interceptor.intercept(context, next);
    observable.subscribe((result) => {
      expect(result).toEqual({ grantId: 'grant-xyz', amount: 50000 });
      expect(next.handle).not.toHaveBeenCalled();
    });
  });

  it('should throw ConflictException if request is still PROCESSING', async () => {
    const redisKey = 'idempotency:scholar-1:POST:/api/grants:grant-sub-101';
    inMemoryStore.set(
      redisKey,
      JSON.stringify({
        state: 'PROCESSING',
        createdAt: new Date().toISOString(),
      }),
    );

    const context = createMockContext({ 'idempotency-key': 'grant-sub-101' });
    const next = { handle: vi.fn() };

    await expect(interceptor.intercept(context, next)).rejects.toThrow(ConflictException);
  });
});
