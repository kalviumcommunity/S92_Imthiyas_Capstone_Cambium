/**
 * Cambium QA Sprint 1 — Frontend Validation, Middleware, HTTP Client & Auth Store Tests
 *
 * Exercises client schemas, Next.js Edge middleware route protection, bounded retry /
 * single-flight 401 refresh in apiFetch, and Zustand session lifecycle using deterministic mocks.
 */
import { SYNTHETIC_ACTORS, buildSyntheticTestJwt } from '../fixtures/synthetic-actors';

jest.mock(
  'next/server',
  () => {
    class MockNextResponse {
      public readonly status: number;
      public readonly headers: Map<string, string>;
      public readonly deletedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];
      public readonly location?: string;

      constructor(status: number, location?: string) {
        this.status = status;
        this.location = location;
        this.headers = new Map();
      }

      cookies = {
        set: (name: string, _value: string, options: Record<string, unknown> = {}) => {
          this.deletedCookies.push({ name, options });
        },
        delete: (name: string) => {
          this.deletedCookies.push({ name, options: { maxAge: 0 } });
        },
      };

      static redirect(url: URL) {
        return new MockNextResponse(307, url.toString());
      }

      static next() {
        return new MockNextResponse(200);
      }
    }

    return { NextResponse: MockNextResponse };
  },
  { virtual: true },
);

import { loginSchema, registerSchema } from '../../client/lib/schemas/auth';
import { middleware, sanitizeInternalRedirect } from '../../client/middleware';
import { apiFetch, isRequestSafeToRetry, resolveApiV1Base } from '../../client/lib/http-client';

function createMemoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
  };
}

function makeNextRequest(pathname: string, search = '', token?: string) {
  const fullUrl = `http://localhost:3000${pathname}${search}`;
  return {
    nextUrl: {
      pathname,
      search,
    },
    url: fullUrl,
    cookies: {
      get: (name: string) =>
        name === 'cambium_token' && token ? { name, value: token } : undefined,
    },
  } as unknown as Parameters<typeof middleware>[0];
}

describe('QA Sprint 1 — Frontend Form Schemas (Zod)', () => {
  test('loginSchema enforces minimum usernameOrEmail and password lengths', () => {
    const shortBoth = loginSchema.safeParse({ usernameOrEmail: 'ab', password: '123' });
    expect(shortBoth.success).toBe(false);
    if (!shortBoth.success) {
      const paths = shortBoth.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('usernameOrEmail');
      expect(paths).toContain('password');
    }

    const valid = loginSchema.safeParse({
      usernameOrEmail: SYNTHETIC_ACTORS.RESEARCHER_A.email,
      password: 'CorrectHorseBattery99!',
    });
    expect(valid.success).toBe(true);
  });

  test('registerSchema rejects disallowed username chars and invalid emails', () => {
    const invalidUsername = registerSchema.safeParse({
      username: 'bad-user!',
      fullName: 'Ada',
      email: 'not-an-email',
      password: 'Password123!',
    });
    expect(invalidUsername.success).toBe(false);
    if (!invalidUsername.success) {
      const fields = invalidUsername.error.issues.map((i) => i.path[0]);
      expect(fields).toEqual(expect.arrayContaining(['username', 'email']));
    }

    const valid = registerSchema.safeParse({
      username: 'ada_lovelace_qa',
      fullName: SYNTHETIC_ACTORS.PI_STANFORD.fullName,
      email: SYNTHETIC_ACTORS.PI_STANFORD.email,
      password: 'StrongPassword123!',
      institution: SYNTHETIC_ACTORS.PI_STANFORD.institution,
      researchInterests: 'Graph Neural Networks, Bioengineering',
    });
    expect(valid.success).toBe(true);
  });
});

describe('QA Sprint 1 — Next.js Auth Middleware & Redirect Sanitization', () => {
  test('sanitizeInternalRedirect blocks open-redirect vectors and preserves safe paths', () => {
    expect(sanitizeInternalRedirect('https://evil.example.invalid/phish')).toBe('/dashboard');
    expect(sanitizeInternalRedirect('//evil.example.invalid/phish')).toBe('/dashboard');
    expect(sanitizeInternalRedirect('dashboard')).toBe('/dashboard');
    expect(sanitizeInternalRedirect('/dashboard\nSet-Cookie: evil=1')).toBe('/dashboard');
    expect(sanitizeInternalRedirect('/opportunities?track=climate#results')).toBe(
      '/opportunities?track=climate#results',
    );
  });

  test('redirects unauthenticated requests on protected routes to /sign-in with redirect param', () => {
    for (const route of ['/dashboard', '/workspace/upload', '/audit', '/settings', '/agent-reader']) {
      const res = middleware(makeNextRequest(route, '?tab=active')) as unknown as {
        status: number;
        location: string;
      };
      expect(res.status).toBe(307);
      const parsed = new URL(res.location);
      expect(parsed.pathname).toBe('/sign-in');
      expect(parsed.searchParams.get('notice')).toBe('auth_required');
      expect(parsed.searchParams.get('redirect')).toBe(`${route}?tab=active`);
    }
  });

  test('clears expired or malformed cambium_token cookies before redirecting', () => {
    const expiredJwt = buildSyntheticTestJwt(SYNTHETIC_ACTORS.RESEARCHER_A, { expiresInSec: -60 });
    const expiredRes = middleware(makeNextRequest('/dashboard', '', expiredJwt)) as unknown as {
      status: number;
      deletedCookies: Array<{ name: string; options: Record<string, unknown> }>;
    };
    expect(expiredRes.status).toBe(307);
    expect(expiredRes.deletedCookies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'cambium_token',
          options: expect.objectContaining({ maxAge: 0 }),
        }),
      ]),
    );

    const malformedRes = middleware(makeNextRequest('/portfolio', '', 'not.a.jwt')) as unknown as {
      status: number;
      deletedCookies: Array<{ name: string; options: Record<string, unknown> }>;
    };
    expect(malformedRes.status).toBe(307);
    expect(malformedRes.deletedCookies.length).toBeGreaterThan(0);
  });

  test('allows valid unexpired JWT session cookie through protected routes', () => {
    const validJwt = buildSyntheticTestJwt(SYNTHETIC_ACTORS.RESEARCHER_A, { expiresInSec: 900 });
    const res = middleware(makeNextRequest('/dashboard', '', validJwt)) as unknown as {
      status: number;
    };
    expect(res.status).toBe(200);
  });
});

describe('QA Sprint 1 — Frontend HTTP Client & Auth Store Session Contracts', () => {
  const originalWindow = (globalThis as Record<string, unknown>).window;
  const originalLocalStorage = (globalThis as Record<string, unknown>).localStorage;
  const originalDocument = (globalThis as Record<string, unknown>).document;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    const storage = createMemoryStorage();
    (globalThis as Record<string, unknown>).localStorage = storage;
    (globalThis as Record<string, unknown>).document = { cookie: '' };
    (globalThis as Record<string, unknown>).window = {
      location: { hostname: 'localhost' },
      localStorage: storage,
    };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalWindow === undefined) delete (globalThis as Record<string, unknown>).window;
    else (globalThis as Record<string, unknown>).window = originalWindow;
    if (originalLocalStorage === undefined) delete (globalThis as Record<string, unknown>).localStorage;
    else (globalThis as Record<string, unknown>).localStorage = originalLocalStorage;
    if (originalDocument === undefined) delete (globalThis as Record<string, unknown>).document;
    else (globalThis as Record<string, unknown>).document = originalDocument;
  });

  test('isRequestSafeToRetry permits GET and Idempotency-Key mutations, rejects bare POST', () => {
    expect(isRequestSafeToRetry('GET', new Headers())).toBe(true);
    expect(isRequestSafeToRetry('POST', new Headers())).toBe(false);
    expect(
      isRequestSafeToRetry('POST', new Headers({ 'Idempotency-Key': 'qa-idem-key-1' })),
    ).toBe(true);
    expect(resolveApiV1Base()).toBe('http://localhost:5000/api/v1');
  });

  test('apiFetch retries idempotent GET on 503 and does not retry unkeyed POST', async () => {
    const getFetch = jest
      .fn()
      .mockResolvedValueOnce(new Response('unavailable', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    globalThis.fetch = getFetch as unknown as typeof fetch;

    const okRes = await apiFetch('/opportunities', { method: 'GET', maxRetries: 1 });
    expect(okRes.status).toBe(200);
    expect(getFetch).toHaveBeenCalledTimes(2);

    const postFetch = jest
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ error: 'busy' }), { status: 503 }));
    globalThis.fetch = postFetch as unknown as typeof fetch;

    const failPost = await apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' }),
      maxRetries: 2,
    });
    expect(failPost.status).toBe(503);
    expect(postFetch).toHaveBeenCalledTimes(1);
  });

  test('apiFetch executes 401 token refresh once and replays original request with new Bearer token', async () => {
    const oldToken = buildSyntheticTestJwt(SYNTHETIC_ACTORS.RESEARCHER_A, { expiresInSec: 60 });
    const freshToken = buildSyntheticTestJwt(SYNTHETIC_ACTORS.RESEARCHER_A, { expiresInSec: 1800 });
    localStorage.setItem('cambium_token', oldToken);

    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'expired' }), { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ accessToken: freshToken }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ items: ['grant-1'] }), { status: 200 }),
      );
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    const res = await apiFetch('/bookmarks', { method: 'GET', maxRetries: 0 });
    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(3);
    const replayCallHeaders = mockFetch.mock.calls[2][1]?.headers as Headers;
    expect(replayCallHeaders.get('Authorization')).toBe(`Bearer ${freshToken}`);
    expect(localStorage.getItem('cambium_token')).toBe(freshToken);
  });

  test('useAuthStore setAuth and logout manage localStorage and cookie boundaries cleanly', async () => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuthStore } = require('../../client/lib/store/useAuthStore');
    const jwt = buildSyntheticTestJwt(SYNTHETIC_ACTORS.RESEARCHER_B);

    useAuthStore.getState().setAuth(
      {
        id: SYNTHETIC_ACTORS.RESEARCHER_B.id,
        username: 'dr_b_qa',
        email: SYNTHETIC_ACTORS.RESEARCHER_B.email,
        fullName: '',
        name: SYNTHETIC_ACTORS.RESEARCHER_B.fullName,
      },
      jwt,
    );

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.fullName).toBe(SYNTHETIC_ACTORS.RESEARCHER_B.fullName);
    expect(localStorage.getItem('cambium_token')).toBe(jwt);

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
    expect(localStorage.getItem('cambium_token')).toBeNull();
    expect(localStorage.getItem('cambium_user')).toBeNull();
  });
});
