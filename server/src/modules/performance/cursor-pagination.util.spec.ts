import { describe, it, expect, vi } from 'vitest';
import { CursorPaginationUtil } from './cursor-pagination.util';

describe('CursorPaginationUtil', () => {
  it('should encode and decode base64url cursor payloads symmetrically', () => {
    const sortVal = '2026-11-19T04:00:00.000Z';
    const idVal = 'b7c3e590-71a2-4d2a-892a-0a7146522c19';

    const encoded = CursorPaginationUtil.encodeCursor(sortVal, idVal);
    expect(typeof encoded).toBe('string');
    expect(encoded).not.toContain('=');

    const decoded = CursorPaginationUtil.decodeCursor(encoded);
    expect(decoded).toEqual({ sortVal, idVal });
  });

  it('should return null for malformed cursor strings safely without throwing', () => {
    expect(CursorPaginationUtil.decodeCursor('invalid-cursor-string')).toBeNull();
    expect(CursorPaginationUtil.decodeCursor('')).toBeNull();
  });

  it('should apply deterministic keyset filtering and return nextCursor when hasMore is true', async () => {
    const mockItems = [
      { id: '1', createdAt: '2026-11-19T03:00:00Z', title: 'A' },
      { id: '2', createdAt: '2026-11-19T02:00:00Z', title: 'B' },
      { id: '3', createdAt: '2026-11-19T01:00:00Z', title: 'C' }, // limit + 1 probe
    ];

    const mockQb = {
      alias: 'opp',
      orderBy: vi.fn().mockReturnThis(),
      addOrderBy: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue(mockItems),
    } as any;

    const result = await CursorPaginationUtil.paginate(mockQb, {
      limit: 2,
      sortField: 'createdAt',
      sortOrder: 'DESC',
    });

    expect(result.items.length).toBe(2);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBeDefined();

    const decoded = CursorPaginationUtil.decodeCursor(result.nextCursor!);
    expect(decoded).toEqual({
      sortVal: '2026-11-19T02:00:00Z',
      idVal: '2',
    });
  });
});
