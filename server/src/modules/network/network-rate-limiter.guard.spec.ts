import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { NetworkRateLimiterGuard } from './network-rate-limiter.guard';

describe('NetworkRateLimiterGuard', () => {
  let guard: NetworkRateLimiterGuard;

  beforeEach(() => {
    NetworkRateLimiterGuard.clearBuckets();
    guard = new NetworkRateLimiterGuard();
  });

  const createMockContext = (ip = '198.51.100.1', extraHeaders: Record<string, string> = {}): ExecutionContext => {
    const headers: Record<string, string> = { 'x-real-ip': ip, ...extraHeaders };
    const responseHeaders: Record<string, string> = {};

    return {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({ headers, socket: {}, url: '/api/v1/projects' }),
        getResponse: () => ({
          setHeader: (name: string, value: string) => {
            responseHeaders[name.toLowerCase()] = value;
          },
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as ExecutionContext;
  };

  it('should allow requests within rate limit and set rate-limit headers', () => {
    const context = createMockContext();
    const canActivate = guard.canActivate(context);
    expect(canActivate).toBe(true);
  });

  it('should prevent rate-limit bypass via spoofed x-user-id header', () => {
    const ip = '203.0.113.99';
    for (let i = 0; i < 120; i++) {
      guard.canActivate(createMockContext(ip, { 'x-user-id': `spoofed-${i}` }));
    }

    expect(() =>
      guard.canActivate(createMockContext(ip, { 'x-user-id': 'spoofed-new' })),
    ).toThrowError(HttpException);
  });

  it('should throw 429 Too Many Requests when request burst exceeds configured limit', () => {
    const ip = '203.0.113.50';
    // Exhaust 120 default requests
    for (let i = 0; i < 120; i++) {
      guard.canActivate(createMockContext(ip));
    }

    // 121st request must trigger 429
    expect(() => guard.canActivate(createMockContext(ip))).toThrowError(HttpException);

    try {
      guard.canActivate(createMockContext(ip));
    } catch (err: any) {
      expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      expect(err.getResponse().retryAfterSeconds).toBeDefined();
    }
  });
});
