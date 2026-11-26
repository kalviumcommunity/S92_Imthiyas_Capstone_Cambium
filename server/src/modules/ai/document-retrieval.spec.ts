import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DocumentParserService } from '../reader/document-parser.service';
import { DocumentRetrievalService } from './document-retrieval.service';
import { HybridSearchService } from '../opportunities/hybrid-search.service';

describe('Sprint 2: Document Chunking, Parameterized PGVector & ACL Retrieval', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('1. DocumentParserService preserves headings, overlap, SHA-256 content hashes, and avoids duplicate re-writes', async () => {
    const parser = new DocumentParserService();
    const manuscript = [
      'Abstract',
      'We evaluate quantum surface codes across noisy superconducting processors.',
      '',
      'Methodology',
      'A '.repeat(900) + 'First sentence completes here. Second sentence carries overlap.',
      'Results',
      'Measured logical error suppression by 2.4x relative to baseline.',
    ].join('\n\n');

    const parsed = await parser.parseAndChunk(manuscript, 'Surface Code Study', false);
    expect(parsed.totalChunks).toBeGreaterThanOrEqual(2);
    expect(parsed.chunks[0].sectionHeader).toBe('Abstract');
    expect(parsed.chunks[0].contentHash).toMatch(/^[a-f0-9]{64}$/);
    expect(parsed.chunks[0].estimatedTokens).toBeGreaterThan(0);

    // Idempotent skip when stored hashes match exactly
    const mockChunkRepo: any = {
      find: vi.fn(async () => parsed.chunks.map((c) => ({ contentHash: c.contentHash }))),
      delete: vi.fn(),
      create: vi.fn((x: any) => x),
      save: vi.fn(),
    };
    const parserWithRepo = new DocumentParserService(undefined, mockChunkRepo);
    const secondRun = await parserWithRepo.ingestDocumentChunks({
      documentId: 'doc-1',
      ownerId: 'user-a',
      title: 'Surface Code Study',
      rawText: manuscript,
    });

    expect(secondRun.skippedUnchanged).toBe(parsed.totalChunks);
    expect(mockChunkRepo.delete).not.toHaveBeenCalled();
    expect(mockChunkRepo.save).not.toHaveBeenCalled();
  });

  it('2. HybridSearchService parameterizes vector literals instead of string interpolation', async () => {
    const qb: any = {
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      addSelect: vi.fn().mockReturnThis(),
      setParameter: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      getRawAndEntities: vi.fn(async () => ({ entities: [], raw: [] })),
      getMany: vi.fn(async () => []),
    };
    const oppRepo: any = { createQueryBuilder: vi.fn(() => qb) };
    const hybrid = new HybridSearchService(oppRepo);

    await hybrid.search({ query: 'quantum error correction', limit: 5 });
    const addSelectCall = qb.addSelect.mock.calls[0]?.[0];
    expect(addSelectCall).toBe('opp.embedding <=> :vectorLiteral::vector');
    expect(qb.setParameter).toHaveBeenCalledWith(
      'vectorLiteral',
      expect.stringMatching(/^\[.*\]$/),
    );
  });

  it('3. DocumentRetrievalService enforces ACL WHERE clause BEFORE pgvector ranking & deduplicates by contentHash', async () => {
    const qb: any = {
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      addSelect: vi.fn().mockReturnThis(),
      setParameter: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      getRawAndEntities: vi.fn(async () => ({
        entities: [
          {
            id: 'c-1',
            documentId: 'doc-a',
            title: 'User A Private Lab Note',
            sectionHeader: 'Methods',
            pageNumber: 2,
            content: 'Private experimental protocol',
            contentHash: 'hash-same',
            visibility: 'PRIVATE',
            ownerId: 'user-a',
          },
          {
            id: 'c-dup',
            documentId: 'doc-a-copy',
            title: 'Duplicate Chunk',
            sectionHeader: 'Methods',
            pageNumber: 2,
            content: 'Private experimental protocol',
            contentHash: 'hash-same',
            visibility: 'PRIVATE',
            ownerId: 'user-a',
          },
        ],
        raw: [{ rawDistance: '0.12' }, { rawDistance: '0.14' }],
      })),
      getMany: vi.fn(async () => []),
    };
    const chunkRepo: any = { createQueryBuilder: vi.fn(() => qb) };
    const retrieval = new DocumentRetrievalService(chunkRepo);

    const out = await retrieval.retrieveAuthorizedChunks({
      query: 'experimental protocol',
      caller: { id: 'user-a', organizationId: 'org-1' },
      memberWorkspaceIds: ['ws-1'],
      topK: 5,
    });

    // ACL filter applied in SQL WHERE with callerId, wsIds, and orgId
    const [whereSql, whereParams] = qb.where.mock.calls[0];
    expect(whereSql).toContain("chunk.visibility = 'PUBLIC'");
    expect(whereSql).toContain('chunk.ownerId = :callerId');
    expect(whereSql).toContain('chunk.workspaceId IN (:...wsIds)');
    expect(whereSql).toContain('chunk.organizationId = :orgId');
    expect(whereParams).toEqual({
      callerId: 'user-a',
      wsIds: ['ws-1'],
      orgId: 'org-1',
    });

    // Deduplicated by contentHash
    expect(out.chunks).toHaveLength(1);
    expect(out.chunks[0].chunk.id).toBe('c-1');
  });
});
