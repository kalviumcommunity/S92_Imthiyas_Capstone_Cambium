import {
  hasOptionalAnalyticsConsent,
  sanitizeClientErrorPayload,
  trackOptionalClientEvent,
} from '@/lib/api';

describe('Suite 11: Analytics Client Consent Gate & Error Boundary Sanitization', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    const store: Record<string, string> = {};
    Object.defineProperty(global, 'window', {
      value: { location: { pathname: '/workspace', hostname: 'localhost' } },
      configurable: true,
    });
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => {
          store[k] = v;
        },
        removeItem: (k: string) => {
          delete store[k];
        },
      },
      configurable: true,
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('blocks optional client analytics transmission unless consent level === "all" or optionalAnalytics === true', async () => {
    const fetchSpy = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchSpy as any;

    expect(hasOptionalAnalyticsConsent()).toBe(false);
    const blocked = await trackOptionalClientEvent({ eventName: 'ui.filter.applied' });
    expect(blocked.dispatched).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();

    localStorage.setItem('cambium-cookie-consent', JSON.stringify({ level: 'essential' }));
    expect(hasOptionalAnalyticsConsent()).toBe(false);
    const essentialOnly = await trackOptionalClientEvent({ eventName: 'ui.filter.applied' });
    expect(essentialOnly.dispatched).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();

    localStorage.setItem('cambium-cookie-consent', JSON.stringify({ level: 'all' }));
    expect(hasOptionalAnalyticsConsent()).toBe(true);
    const granted = await trackOptionalClientEvent({ eventName: 'ui.filter.applied' });
    expect(granted.dispatched).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('strips Bearer tokens, emails, and query strings from client route error payloads', () => {
    const clean = sanitizeClientErrorPayload({
      route: '/workspace?secretToken=abc&user=alice@stanford.edu',
      errorName: 'ChunkLoadError',
      errorDigest: 'digest-77',
      message: 'Failed fetching for scholar@mit.edu with Bearer eyJhbGci.123.abc',
    });

    expect(clean.route).toBe('/workspace');
    expect(clean.message).not.toContain('scholar@mit.edu');
    expect(clean.message).not.toContain('eyJhbGci.123.abc');
    expect(clean.message).toContain('[REDACTED_EMAIL]');
    expect(clean.message).toContain('Bearer [REDACTED]');
  });
});
