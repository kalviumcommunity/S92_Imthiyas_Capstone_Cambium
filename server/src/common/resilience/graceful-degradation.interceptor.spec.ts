import { describe, it, expect } from 'vitest';
import { throwError } from 'rxjs';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { GracefulDegradationInterceptor } from './graceful-degradation.interceptor';

describe('GracefulDegradationInterceptor', () => {
  it('should intercept error and attach X-Cambium SRE headers to response', async () => {
    const interceptor = new GracefulDegradationInterceptor();
    const headers: Record<string, string> = {};

    const context = {
      switchToHttp: () => ({
        getResponse: () => ({
          setHeader: (name: string, value: string) => {
            headers[name.toLowerCase()] = value;
          },
        }),
      }),
    } as unknown as ExecutionContext;

    const callHandler: CallHandler = {
      handle: () => throwError(() => new Error('connect ECONNRESET to OpenAlex')),
    };

    try {
      await new Promise((resolve, reject) => {
        interceptor.intercept(context, callHandler).subscribe({
          next: resolve,
          error: reject,
        });
      });
    } catch {
      // Expected caught error
    }

    expect(headers['x-cambium-incident-code']).toBe('SRE-NET-002');
    expect(headers['x-cambium-error-category']).toBe('TRANSIENT_NETWORK');
    expect(headers['x-cambium-retriable']).toBe('true');
  });
});
