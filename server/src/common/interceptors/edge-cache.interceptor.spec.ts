import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EdgeCacheInterceptor } from './edge-cache.interceptor';
import { of } from 'rxjs';

describe('EdgeCacheInterceptor', () => {
  let interceptor: EdgeCacheInterceptor;
  let mockReflector: any;

  beforeEach(() => {
    mockReflector = {
      getAllAndOverride: vi.fn().mockReturnValue({
        maxAge: 3600,
        sMaxAge: 86400,
        staleWhileRevalidate: 86400,
        tags: ['grants', 'catalog'],
        public: true,
      }),
    };
    interceptor = new EdgeCacheInterceptor(mockReflector as any);
  });

  const createMockContext = (method = 'GET', headers: Record<string, string> = {}) => {
    const req = {
      method,
      headers,
    };
    const setHeaderMock = vi.fn();
    const statusMock = vi.fn();
    const res = {
      setHeader: setHeaderMock,
      status: statusMock,
    };

    return {
      context: {
        switchToHttp: () => ({
          getRequest: () => req,
          getResponse: () => res,
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as any,
      res,
    };
  };

  it('should attach RFC Cache-Control and Cloudflare Enterprise CDN headers on GET requests', () => {
    const { context, res } = createMockContext('GET');
    const next = { handle: () => of({ opportunities: [{ id: '1', title: 'Quantum Grant' }] }) };

    const observable = interceptor.intercept(context, next);
    observable.subscribe((result) => {
      expect(result).toBeDefined();
      expect(res.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      );
      expect(res.setHeader).toHaveBeenCalledWith(
        'Cloudflare-CDN-Cache-Control',
        'max-age=86400, stale-while-revalidate=86400',
      );
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Tag', 'grants,catalog');
      expect(res.setHeader).toHaveBeenCalledWith('ETag', expect.stringMatching(/^"[a-f0-9]{32}"$/));
    });
  });

  it('should return HTTP 304 Not Modified when client provides matching If-None-Match ETag', () => {
    const samplePayload = { status: 'healthy' };
    const { context, res } = createMockContext('GET');
    const next = { handle: () => of(samplePayload) };

    // Run first time to compute ETag
    let computedEtag = '';
    interceptor.intercept(context, next).subscribe(() => {
      const calls = res.setHeader.mock.calls;
      const etagCall = calls.find((c: any) => c[0] === 'ETag');
      computedEtag = etagCall[1];
    });

    // Run second time with client sending If-None-Match
    const { context: conditionalContext, res: conditionalRes } = createMockContext('GET', {
      'if-none-match': computedEtag,
    });

    interceptor.intercept(conditionalContext, next).subscribe((result) => {
      expect(conditionalRes.status).toHaveBeenCalledWith(304);
      expect(result).toBeNull();
    });
  });

  it('should pass through non-GET requests without edge cache headers', () => {
    const { context, res } = createMockContext('POST');
    const next = { handle: () => of({ created: true }) };

    const observable = interceptor.intercept(context, next);
    observable.subscribe((result) => {
      expect(result).toEqual({ created: true });
      expect(res.setHeader).not.toHaveBeenCalled();
    });
  });
});
