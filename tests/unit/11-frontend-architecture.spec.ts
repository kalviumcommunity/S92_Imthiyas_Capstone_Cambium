import { resolveApiBase, resolveApiV1Base, apiFetch } from '@/lib/http-client';

jest.mock(
  'next/server',
  () => ({
    NextResponse: {
      next: jest.fn(() => ({ cookies: { delete: jest.fn() } })),
      redirect: jest.fn((url: any) => ({ url, cookies: { delete: jest.fn() } })),
    },
  }),
  { virtual: true },
);

describe('Suite 11: Frontend Architecture, State Isolation & API Resilience', () => {
  const originalWindow = (globalThis as any).window;
  const originalDocument = (globalThis as any).document;
  const originalLocalStorage = (globalThis as any).localStorage;
  const originalFetch = global.fetch;

  let storageMap: Map<string, string>;

  beforeEach(() => {
    storageMap = new Map<string, string>();
    const storageMock = {
      getItem: (k: string) => (storageMap.has(k) ? storageMap.get(k)! : null),
      setItem: (k: string, v: string) => storageMap.set(k, String(v)),
      removeItem: (k: string) => storageMap.delete(k),
      clear: () => storageMap.clear(),
    };
    (globalThis as any).localStorage = storageMock;
    (globalThis as any).document = { cookie: '' };
    (globalThis as any).window = {
      location: { hostname: 'localhost' },
      localStorage: storageMock,
    };
  });

  afterEach(() => {
    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
    (globalThis as any).localStorage = originalLocalStorage;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('1. resolves API base and v1 URLs consistently without double slashes', () => {
    const prevEnv = process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_URL = 'https://api.cambium.example/api/';
    expect(resolveApiBase()).toBe('https://api.cambium.example/api');
    expect(resolveApiV1Base()).toBe('https://api.cambium.example/api/v1');

    process.env.NEXT_PUBLIC_API_URL = 'https://api.cambium.example';
    expect(resolveApiV1Base()).toBe('https://api.cambium.example/api/v1');

    process.env.NEXT_PUBLIC_API_URL = prevEnv;
  });

  it('2. apiFetch performs single-flight 401 token refresh via HttpOnly cookie and purges legacy refresh keys', async () => {
    storageMap.set('cambium_token', 'expired-access-token');
    storageMap.set('cambium_refresh_token', 'legacy-leaked-refresh');

    const mockFetch = jest
      .fn()
      // 1. Initial call returns 401
      .mockResolvedValueOnce({ ok: false, status: 401 })
      // 2. Refresh call returns new access token
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ token: 'fresh-access-token' }),
      })
      // 3. Replayed original request succeeds with fresh bearer
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      });

    global.fetch = mockFetch as any;

    const res = await apiFetch('/bookmarks/my/list', { maxRetries: 0 });
    expect(res.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(storageMap.has('cambium_refresh_token')).toBe(false);
    expect(storageMap.get('cambium_token')).toBe('fresh-access-token');

    const replayHeaders = mockFetch.mock.calls[2][1].headers as Headers;
    expect(replayHeaders.get('Authorization')).toBe('Bearer fresh-access-token');
    expect(replayHeaders.get('X-Request-Id')).toBeTruthy();
  });

  it('3. useAuthStore clears React Query cache, subscription store, and user drafts on logout & cross-account switch', async () => {
    const { getBrowserQueryClient } = await import('@/lib/query-client');
    const { useSubscriptionStore } = await import('@/lib/store/useSubscriptionStore');
    const { useAuthStore } = await import('@/lib/store/useAuthStore');

    const qc = getBrowserQueryClient();
    qc.setQueryData(['proposals', 'userA'], [{ id: 'p-1', title: 'Confidential Grant A' }]);
    expect(qc.getQueryData(['proposals', 'userA'])).toBeDefined();

    useSubscriptionStore.getState().upgradePlan('team', 'annual', {
      type: 'card',
      label: 'P-Card',
      identifier: '•••• 4242',
    });
    storageMap.set('cambium_workspace_drafts_v2', '[{"id":"draft-A"}]');

    useAuthStore.getState().setAuth(
      { id: 'user-a', username: 'alice', email: 'alice@mit.edu', fullName: 'Alice' },
      'token-a',
    );

    // Switching straight to User B purges User A caches & billing store
    useAuthStore.getState().setAuth(
      { id: 'user-b', username: 'bob', email: 'bob@stanford.edu', fullName: 'Bob' },
      'token-b',
    );

    expect(qc.getQueryData(['proposals', 'userA'])).toBeUndefined();
    expect(useSubscriptionStore.getState().currentPlan).toBe('free');
    expect(useSubscriptionStore.getState().invoices).toHaveLength(0);
    expect(storageMap.has('cambium_workspace_drafts_v2')).toBe(false);

    // Logout removes session storage and resets auth store
    qc.setQueryData(['proposals', 'userB'], [{ id: 'p-2' }]);
    useAuthStore.getState().logout();
    expect(qc.getQueryData(['proposals', 'userB'])).toBeUndefined();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('4. api.ts routes bookmark & opportunity mutations through instrumented apiFetch', async () => {
    const { toggleBookmark, createOpportunity } = await import('@/lib/api');
    storageMap.set('cambium_token', 'active-token');

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ data: { id: 'opp-99', title: 'NSF AI' } }),
    });
    global.fetch = mockFetch as any;

    await toggleBookmark('opp-99');
    const created = await createOpportunity({
      title: 'NSF AI',
      type: 'Grant',
      organization: 'NSF',
    });

    expect(created.id).toBe('opp-99');
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const headers0 = mockFetch.mock.calls[0][1].headers as Headers;
    expect(headers0.get('Authorization')).toBe('Bearer active-token');
    expect(headers0.get('X-Request-Id')).toBeTruthy();
  });

  it('5. middleware sanitizeInternalRedirect blocks open-redirect vectors while allowing safe deep links', async () => {
    const { sanitizeInternalRedirect } = await import('@/middleware');
    expect(sanitizeInternalRedirect('https://evil.example/login')).toBe('/dashboard');
    expect(sanitizeInternalRedirect('//evil.example/steal')).toBe('/dashboard');
    expect(sanitizeInternalRedirect('/\\evil.example/steal')).toBe('/dashboard');
    expect(sanitizeInternalRedirect('javascript:alert(1)')).toBe('/dashboard');
    expect(sanitizeInternalRedirect('/workspace?createDraft=1&title=NSF')).toBe(
      '/workspace?createDraft=1&title=NSF',
    );
  });
});
