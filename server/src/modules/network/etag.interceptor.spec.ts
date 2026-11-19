import { describe, it, expect, beforeEach } from 'vitest';
import { of } from 'rxjs';
import { ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { EtagInterceptor } from './etag.interceptor';

describe('EtagInterceptor', () => {
  let interceptor: EtagInterceptor;

  beforeEach(() => {
    interceptor = new EtagInterceptor();
  });

  const createMockContext = (
    method = 'GET',
    ifNoneMatch?: string,
  ) => {
    const resHeaders: Record<string, string> = {};
    const statusObj = { code: 200 };

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          method,
          headers: ifNoneMatch ? { 'if-none-match': ifNoneMatch } : {},
        }),
        getResponse: () => ({
          setHeader: (name: string, value: string) => {
            resHeaders[name.toLowerCase()] = value;
          },
          status: (code: number) => {
            statusObj.code = code;
          },
        }),
      }),
    } as unknown as ExecutionContext;

    return { context, headers: resHeaders, statusObj };
  };

  it('should generate weak ETag header for GET request response payload', async () => {
    const mockData = { id: 'opp-101', title: 'Quantum Cryptography Grant' };
    const callHandler: CallHandler = { handle: () => of(mockData) };
    const { context, headers } = createMockContext('GET');

    const result = await new Promise((resolve) => {
      interceptor.intercept(context, callHandler).subscribe(resolve);
    });

    expect(result).toEqual(mockData);
    expect(headers['etag']).toBeDefined();
    expect(headers['etag'].startsWith('W/"')).toBe(true);
  });

  it('should return 304 Not Modified when If-None-Match header matches calculated ETag', async () => {
    const mockData = { id: 'opp-101', title: 'Quantum Cryptography Grant' };
    const callHandler: CallHandler = { handle: () => of(mockData) };

    // First request to obtain ETag
    const firstCall = createMockContext('GET');
    await new Promise((resolve) => {
      interceptor.intercept(firstCall.context, callHandler).subscribe(resolve);
    });
    const calculatedEtag = firstCall.headers['etag'];

    // Second request with If-None-Match
    const secondCall = createMockContext('GET', calculatedEtag);
    const result = await new Promise((resolve) => {
      interceptor.intercept(secondCall.context, callHandler).subscribe(resolve);
    });

    expect(result).toBeNull();
    expect(secondCall.statusObj.code).toBe(HttpStatus.NOT_MODIFIED);
  });
});
