import {
  apiFetch,
  computeJitteredBackoffMs,
  generateRequestId,
  isRequestSafeToRetry,
} from '@/lib/http-client';

describe('Suite 10: HTTP Network Resilience, Correlation IDs & Safe Retry Rules', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('should attach X-Request-Id header on every outbound request', async () => {
    const reqId = generateRequestId();
    expect(reqId.length).toBeGreaterThan(8);

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
    global.fetch = mockFetch as any;

    await apiFetch('http://localhost:5000/api/v1/health', { maxRetries: 0 });
    const [, init] = mockFetch.mock.calls[0];
    expect((init.headers as Headers).get('X-Request-Id')).toBeTruthy();
  });

  it('should safely retry idempotent GET requests on 503 with exponential jitter', async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, status: 200 });
    global.fetch = mockFetch as any;

    const res = await apiFetch('http://localhost:5000/api/v1/projects', {
      method: 'GET',
      maxRetries: 2,
    });

    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should NEVER auto-retry non-idempotent POST requests lacking Idempotency-Key', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: false, status: 503 });
    global.fetch = mockFetch as any;

    const res = await apiFetch('http://localhost:5000/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify({ title: 'Grant Submission' }),
      maxRetries: 3,
    });

    expect(res.status).toBe(503);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should allow retry for POST mutations only when explicit Idempotency-Key is supplied', async () => {
    const hWithout = new Headers();
    const hWith = new Headers({ 'Idempotency-Key': 'tx-grant-001' });
    expect(isRequestSafeToRetry('POST', hWithout)).toBe(false);
    expect(isRequestSafeToRetry('POST', hWith)).toBe(true);

    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, status: 201 });
    global.fetch = mockFetch as any;

    const res = await apiFetch('http://localhost:5000/api/v1/funding/expenses', {
      method: 'POST',
      idempotencyKey: 'tx-grant-001',
      body: JSON.stringify({ amount: 5000 }),
      maxRetries: 1,
    });

    expect(res.status).toBe(201);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should calculate bounded exponential backoff with jitter', () => {
    const delay0 = computeJitteredBackoffMs(0, 300, 8000);
    const delay2 = computeJitteredBackoffMs(2, 300, 8000);
    expect(delay0).toBeGreaterThanOrEqual(150);
    expect(delay0).toBeLessThanOrEqual(300);
    expect(delay2).toBeGreaterThanOrEqual(600);
    expect(delay2).toBeLessThanOrEqual(1200);
  });
});
