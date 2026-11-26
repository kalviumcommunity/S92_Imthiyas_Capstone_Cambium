import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MultiTierCacheService } from './multi-tier-cache.service';

describe('MultiTierCacheService', () => {
  let service: MultiTierCacheService;

  beforeEach(() => {
    service = new MultiTierCacheService();
    service.clear();
  });

  it('should store and retrieve values from L1 in-memory cache', async () => {
    await service.set('test:key:1', { name: 'NIH Grant 2026' }, 60);
    const cached = await service.get<{ name: string }>('test:key:1');

    expect(cached).toEqual({ name: 'NIH Grant 2026' });
    const metrics = service.getMetrics();
    expect(metrics.hits).toBe(1);
    expect(metrics.misses).toBe(0);
    expect(metrics.hitRatio).toBe(1.0);
  });

  it('should return null and record miss for non-existent or expired keys', async () => {
    const missing = await service.get('test:missing');
    expect(missing).toBeNull();

    const metrics = service.getMetrics();
    expect(metrics.misses).toBe(1);
  });

  it('should wrap expensive query with automatic memoization', async () => {
    const factory = vi.fn().mockResolvedValue({ totalGrants: 42 });

    // 1st call executes factory
    const result1 = await service.wrap('stats:opps', factory, 60);
    expect(result1).toEqual({ totalGrants: 42 });
    expect(factory).toHaveBeenCalledTimes(1);

    // 2nd call hits L1 cache with 0 factory executions
    const result2 = await service.wrap('stats:opps', factory, 60);
    expect(result2).toEqual({ totalGrants: 42 });
    expect(factory).toHaveBeenCalledTimes(1);

    const metrics = service.getMetrics();
    expect(metrics.hits).toBe(1);
  });

  it('should invalidate keys by prefix matching', async () => {
    await service.set('opp:1', { title: 'Grant A' }, 60);
    await service.set('opp:2', { title: 'Grant B' }, 60);
    await service.set('user:1', { name: 'Scholar' }, 60);

    const purged = await service.invalidateByPrefix('opp:');
    expect(purged).toBe(2);

    expect(await service.get('opp:1')).toBeNull();
    expect(await service.get('opp:2')).toBeNull();
    expect(await service.get('user:1')).toEqual({ name: 'Scholar' });
  });

  it('should coalesce concurrent cache misses for the same key via singleflight', async () => {
    let resolver: (val: any) => void = () => {};
    const pending = new Promise((res) => {
      resolver = res;
    });
    const factory = vi.fn(() => pending);

    const calls = Promise.all([
      service.wrap('hot:stats', factory, 60),
      service.wrap('hot:stats', factory, 60),
      service.wrap('hot:stats', factory, 60),
    ]);
    resolver({ ok: true });
    const results = await calls;

    expect(factory).toHaveBeenCalledTimes(1);
    expect(results).toEqual([{ ok: true }, { ok: true }, { ok: true }]);
  });
});
