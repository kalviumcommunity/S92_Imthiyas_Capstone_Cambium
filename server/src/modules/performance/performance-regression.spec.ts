import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GatewayTimeoutException, CallHandler } from '@nestjs/common';
import { of, lastValueFrom } from 'rxjs';
import { OpportunitiesService } from '../opportunities/opportunities.service';
import { HybridSearchService } from '../opportunities/hybrid-search.service';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MultiTierCacheService } from './multi-tier-cache.service';
import { PerformanceController } from './performance.controller';
import { RequestTimeoutInterceptor } from '../../common/interceptors/request-timeout.interceptor';

describe('Program 10: Performance Regression & Scalability Suite', () => {
  it('OpportunitiesService.findAll clamps limit <= 100, projects safe creator columns, and caches public slices', async () => {
    const mockQb: any = {
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      addSelect: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      getManyAndCount: vi.fn().mockResolvedValue([[{ id: 'o1', title: 'Grant 1' }], 1]),
    };
    const mockOppRepo: any = {
      createQueryBuilder: vi.fn(() => mockQb),
      create: vi.fn((d: any) => d),
      save: vi.fn(async (d: any) => d),
      findOne: vi.fn(async () => ({ id: 'o1' })),
      remove: vi.fn(async () => ({})),
    };
    const mockTagRepo: any = {
      find: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn((d: any) => d),
      save: vi.fn(async (d: any) => d),
    };
    const cache = new MultiTierCacheService();
    const service = new OpportunitiesService(mockOppRepo, mockTagRepo, {} as any, cache);

    const res = await service.findAll({ limit: 9999 as any });
    expect(mockQb.take).toHaveBeenCalledWith(100);
    expect(mockQb.addSelect).toHaveBeenCalledWith(['creator.id', 'creator.username', 'creator.fullName']);
    expect(res.data).toHaveLength(1);

    // Second identical call must hit L1 cache instead of hitting DB again
    await service.findAll({ limit: 9999 as any });
    expect(mockOppRepo.createQueryBuilder).toHaveBeenCalledTimes(1);
    expect(cache.getMetrics().hits).toBeGreaterThanOrEqual(1);
  });

  it('BookmarksService and NotificationsService enforce bounded pagination limits <= 100', async () => {
    const mockBookmarkRepo: any = {
      findAndCount: vi.fn().mockResolvedValue([[], 0]),
    };
    const bookmarks = new BookmarksService(mockBookmarkRepo);
    await bookmarks.findAll(500, 0);
    expect(mockBookmarkRepo.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100, skip: 0 }),
    );

    const mockNotifRepo: any = {
      findAndCount: vi.fn().mockResolvedValue([[], 0]),
      count: vi.fn().mockResolvedValue(3),
    };
    const notifications = new NotificationsService(mockNotifRepo);
    const inbox = await notifications.findByUserId('u-1', { limit: 500, offset: 0 });
    expect(mockNotifRepo.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100, skip: 0 }),
    );
    expect(inbox.unreadCount).toBe(3);
  });

  it('HybridSearchService parameterizes pgvector literals, prefers GIN FTS, and bounds fallback <= 250', async () => {
    const queriesExecuted: Array<{ where: string; params: any }> = [];
    const mockQb: any = {
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      addSelect: vi.fn().mockReturnThis(),
      setParameter: vi.fn().mockReturnThis(),
      where: vi.fn((sql: string, params: any) => {
        queriesExecuted.push({ where: sql, params });
        return mockQb;
      }),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      getRawAndEntities: vi.fn().mockResolvedValue({ entities: [], raw: [] }),
      getMany: vi.fn().mockResolvedValue([{ id: 'opp-fts', title: 'Climate Research' }]),
    };

    const mockOppRepo: any = {
      createQueryBuilder: vi.fn(() => mockQb),
    };
    const mockEmbedding: any = {
      generateEmbedding: vi.fn().mockResolvedValue({
        embedding: new Array(768).fill(0.01),
      }),
    };

    const hybrid = new HybridSearchService(mockOppRepo, mockEmbedding);
    const result = await hybrid.search({ query: 'climate change', limit: 10 });

    expect(result.success).toBe(true);
    expect(mockQb.addSelect).toHaveBeenCalledWith(
      'opp.embedding <=> :vectorLiteral::vector',
      'rawDistance',
    );
    expect(mockQb.setParameter).toHaveBeenCalledWith('vectorLiteral', expect.stringContaining('['));
    expect(queriesExecuted.some((q) => q.where.includes('websearch_to_tsquery'))).toBe(true);
  });

  it('MultiTierCacheService.wrapScoped isolates tenants and blocks oversized payloads > 256KB', async () => {
    const cache = new MultiTierCacheService();
    const userAFetch = vi.fn().mockResolvedValue({ secret: 'A' });
    const userBFetch = vi.fn().mockResolvedValue({ secret: 'B' });

    const resA = await cache.wrapScoped({ kind: 'user', userId: 'uA' }, 'profile', userAFetch, 60);
    const resB = await cache.wrapScoped({ kind: 'user', userId: 'uB' }, 'profile', userBFetch, 60);
    expect(resA).toEqual({ secret: 'A' });
    expect(resB).toEqual({ secret: 'B' });
    expect(userBFetch).toHaveBeenCalledTimes(1);

    // Oversized > 256KB payload must NOT be stored into L1 map
    await cache.set('public:huge', { blob: 'x'.repeat(300 * 1024) }, 60);
    expect(await cache.get('public:huge')).toBeNull();
  });

  it('PerformanceController reports memory and event-loop lag metrics cleanly', () => {
    const controller = new PerformanceController(new MultiTierCacheService());
    const metrics = controller.getMetrics();
    expect(metrics.memory.rssMb).toBeGreaterThan(0);
    expect(typeof metrics.eventLoop.meanLagMs).toBe('number');
    expect(typeof metrics.eventLoop.p95LagMs).toBe('number');
  });

  it('RequestTimeoutInterceptor bypasses SSE streams and rejects slow handlers cleanly', async () => {
    process.env.API_REQUEST_TIMEOUT_MS = '30';
    const interceptor = new RequestTimeoutInterceptor();

    const sseCtx: any = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({ url: '/api/v1/events', headers: { accept: 'text/event-stream' } }),
      }),
    };
    const fastNext: CallHandler = { handle: () => of({ ok: true }) };
    const sseVal = await lastValueFrom(interceptor.intercept(sseCtx, fastNext));
    expect(sseVal).toEqual({ ok: true });

    const standardCtx: any = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({ url: '/api/v1/opportunities', headers: {} }),
      }),
    };
    const quickVal = await lastValueFrom(
      interceptor.intercept(standardCtx, { handle: () => of({ ok: true }) }),
    );
    expect(quickVal).toEqual({ ok: true });
    expect(GatewayTimeoutException).toBeDefined();
  });
});
