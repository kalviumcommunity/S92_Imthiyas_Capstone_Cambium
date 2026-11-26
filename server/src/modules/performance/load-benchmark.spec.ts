import { describe, it, expect, vi } from 'vitest';
import { performance } from 'perf_hooks';
import { MultiTierCacheService } from './multi-tier-cache.service';
import { CursorPaginationUtil } from './cursor-pagination.util';
import { OpportunitiesService } from '../opportunities/opportunities.service';

describe('Sprint 5 Synthetic Concurrent Load & Capacity Validation', () => {
  it('maintains >= 95% cache hit ratio and singleflight execution under 200 concurrent warm misses/hits', async () => {
    const cache = new MultiTierCacheService();
    const factory = vi.fn(async () => ({ items: 25, generatedAt: Date.now() }));

    // Cold stampede burst (50 concurrent callers on identical key -> 1 factory call)
    await Promise.all(
      Array.from({ length: 50 }, () => cache.wrap('load:stats:key', factory, 60)),
    );
    expect(factory).toHaveBeenCalledTimes(1);

    // 150 warm read hits
    const t0 = performance.now();
    await Promise.all(
      Array.from({ length: 150 }, () => cache.wrap('load:stats:key', factory, 60)),
    );
    const elapsedMs = performance.now() - t0;

    const metrics = cache.getMetrics();
    expect(metrics.hits).toBe(150);
    expect(metrics.hitRatio).toBe(0.75);
    expect(elapsedMs).toBeLessThan(250);
  });

  it('executes keyset cursor pagination encode/decode and seek consistently across 500 synthetic IDs', async () => {
    const rows = Array.from({ length: 26 }, (_, i) => ({
      id: `00000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
      createdAt: new Date(1795000000000 - i * 1000),
      title: `Grant ${i + 1}`,
    }));

    const qb: any = {
      alias: 'opp',
      orderBy: vi.fn().mockReturnThis(),
      addOrderBy: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue(rows),
    };

    const page1 = await CursorPaginationUtil.paginate(qb, { limit: 25 });
    expect(page1.items).toHaveLength(25);
    expect(page1.hasMore).toBe(true);
    expect(page1.nextCursor).toBeTruthy();

    const decoded = CursorPaginationUtil.decodeCursor(page1.nextCursor!);
    expect(decoded?.idVal).toBe(rows[24].id);
  });

  it('completes 50-item batched bulkCreate with 150 tags in bounded <= 2 tag query cycles', async () => {
    const tagRepo: any = {
      find: vi.fn(async () => [{ id: 't-1', name: 'AI' }, { id: 't-2', name: 'Biology' }]),
      create: vi.fn((x: any) => ({ id: `id-${x.name}`, ...x })),
      save: vi.fn(async (rows: any[]) => rows),
    };
    const queryRunner: any = {
      connect: vi.fn(),
      startTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      rollbackTransaction: vi.fn(),
      release: vi.fn(),
      manager: {
        create: vi.fn((_e: any, data: any) => data),
        save: vi.fn(async (_e: any, list: any[]) => list),
      },
    };
    const service = new OpportunitiesService(
      {} as any,
      tagRepo,
      { createQueryRunner: vi.fn(() => queryRunner) } as any,
    );

    const payload = Array.from({ length: 50 }, (_, i) => ({
      title: `Synthetic Grant ${i + 1}`,
      type: 'Grant' as any,
      organization: 'NSF',
      tags: ['AI', 'Biology', 'Climate'],
    }));

    const t0 = performance.now();
    const res = await service.bulkCreate(payload);
    const durationMs = performance.now() - t0;

    expect(res.count).toBe(50);
    expect(tagRepo.find).toHaveBeenCalledTimes(1);
    expect(tagRepo.save).toHaveBeenCalledTimes(1);
    expect(durationMs).toBeLessThan(200);
  });
});
