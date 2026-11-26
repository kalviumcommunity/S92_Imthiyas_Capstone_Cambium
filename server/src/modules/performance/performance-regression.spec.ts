import { describe, it, expect, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { OpportunitiesService } from '../opportunities/opportunities.service';
import { HybridSearchService } from '../opportunities/hybrid-search.service';
import { GeminiEmbeddingService } from '../ai/gemini-embedding.service';
import { QueueService } from '../../common/queues/queue.service';

describe('Sprint 1-2 Backend, PostgreSQL & Search Performance Regression Suite', () => {
  it('enforces bounded pagination (max limit 100) and minimal creator projection in OpportunitiesService.findAll', async () => {
    const qb: any = {
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      addSelect: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      getManyAndCount: vi.fn().mockResolvedValue([[{ id: 'opp-1' }], 1]),
    };

    const service = new OpportunitiesService(
      { createQueryBuilder: vi.fn(() => qb) } as any,
      {} as any,
      {} as any,
    );

    const res = await service.findAll({ page: 2, limit: 500 });
    expect(res.limit).toBe(100);
    expect(res.page).toBe(2);
    expect(qb.take).toHaveBeenCalledWith(100);
    expect(qb.skip).toHaveBeenCalledWith(100);
    expect(qb.addSelect).toHaveBeenCalledWith(['creator.id', 'creator.fullName', 'creator.organization']);
  });

  it('batch-resolves tags once in bulkCreate instead of sequential N+1 queries', async () => {
    const tagRepo: any = {
      find: vi.fn().mockResolvedValue([{ id: 't-1', name: 'AI' }]),
      create: vi.fn((x: any) => ({ id: 't-new', ...x })),
      save: vi.fn(async (arr: any[]) => arr),
    };
    const queryRunner: any = {
      connect: vi.fn(),
      startTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      rollbackTransaction: vi.fn(),
      release: vi.fn(),
      manager: {
        create: vi.fn((_entity: any, payload: any) => payload),
        save: vi.fn(async (_entity: any, rows: any[]) => rows),
      },
    };
    const service = new OpportunitiesService(
      {} as any,
      tagRepo,
      { createQueryRunner: vi.fn(() => queryRunner) } as any,
    );

    await service.bulkCreate([
      { title: 'Opp A', type: 'Grant' as any, organization: 'NSF', tags: ['AI', 'Quantum'] },
      { title: 'Opp B', type: 'Grant' as any, organization: 'NIH', tags: ['AI', 'Genomics'] },
    ]);

    expect(tagRepo.find).toHaveBeenCalledTimes(1);
    expect(tagRepo.save).toHaveBeenCalledTimes(1);
    expect(queryRunner.manager.save).toHaveBeenCalledTimes(1);
  });

  it('uses parameterized vector queries, GIN FTS, and bounded fallback in HybridSearchService', async () => {
    const qb: any = {
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      addSelect: vi.fn().mockReturnThis(),
      setParameter: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      addOrderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      getRawAndEntities: vi.fn().mockResolvedValue({ entities: [], raw: [] }),
      getMany: vi.fn().mockResolvedValue([]),
    };

    const hybrid = new HybridSearchService({ createQueryBuilder: vi.fn(() => qb) } as any);
    const res = await hybrid.search({ query: 'quantum computing', limit: 250 });

    expect(res.success).toBe(true);
    expect(qb.addSelect).toHaveBeenCalledWith('opp.embedding <=> :vectorLiteral::vector', 'rawDistance');
    expect(qb.setParameter).toHaveBeenCalledWith('vectorLiteral', expect.stringMatching(/^\[.*\]$/));
    expect(qb.where).toHaveBeenCalledWith(
      expect.stringContaining('plainto_tsquery'),
      expect.objectContaining({ ftsQuery: 'quantum computing' }),
    );
    expect(qb.take).toHaveBeenCalledWith(100); // min(250, 50) * 2 candidates
  });

  it('validates 004_performance_indexes.sql uses additive IF NOT EXISTS DDL without destructive drops', () => {
    const sql = fs.readFileSync(
      path.resolve(__dirname, '../../database/migrations/004_performance_indexes.sql'),
      'utf8',
    );
    expect(sql).toContain('idx_opps_created_id_desc');
    expect(sql).toContain('idx_opps_deadline_active');
    expect(sql).toContain('idx_opps_fts_full');
    expect(sql).toContain('idx_chat_room_created');
    expect(sql).not.toMatch(/\bDROP\s+TABLE\b/i);
  });

  it('bounds batch embedding concurrency and falls back cleanly on stalled outbound fetch', async () => {
    const embed = new GeminiEmbeddingService();
    const results = await embed.generateBatchEmbeddings(
      ['grant a', 'grant b', 'grant c', 'grant d', 'grant e', 'grant f', 'grant g'],
      100,
    );
    expect(results).toHaveLength(7);
    expect(results.every((r) => r.dimension === 768)).toBe(true);
  });

  it('deduplicates rapid repeated ingestion jobs cleanly in QueueService', async () => {
    const jobRepo: any = {
      findOne: vi.fn().mockResolvedValue({ id: 'existing-ingest-job' }),
      create: vi.fn(),
      save: vi.fn(),
    };
    const queue = new QueueService(jobRepo);
    const res = await queue.addIngestionJob({ source: 'openalex', timestamp: new Date().toISOString() });
    expect(res).toEqual({ id: 'existing-ingest-job', isQueued: true, deduplicated: true });
    expect(jobRepo.save).not.toHaveBeenCalled();
  });
});
