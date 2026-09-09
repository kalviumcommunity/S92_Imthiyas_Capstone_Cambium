import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpportunitiesService } from './opportunities.service';
import { NotFoundException } from '@nestjs/common';

describe('OpportunitiesService', () => {
  let oppService: OpportunitiesService;
  let mockOppRepo: any;
  let mockTagRepo: any;
  let mockDataSource: any;

  beforeEach(() => {
    mockOppRepo = {
      createQueryBuilder: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        addSelect: vi.fn().mockReturnThis(),
        getRawOne: vi.fn().mockResolvedValue({
          total: 10,
          grants: 4,
          cfps: 3,
          journals: 2,
          papers: 1,
        }),
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        getManyAndCount: vi.fn().mockResolvedValue([[], 0]),
      }),
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      remove: vi.fn(),
    };

    mockTagRepo = {
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    };

    mockDataSource = {
      createQueryRunner: vi.fn(),
    };

    oppService = new OpportunitiesService(
      mockOppRepo as any,
      mockTagRepo as any,
      mockDataSource as any,
    );
  });

  it('should return aggregated opportunity stats', async () => {
    const res = await oppService.getOpportunityStats();
    expect(res.success).toBe(true);
    expect(res.stats.total).toBe(10);
    expect(res.stats.grants).toBe(4);
    expect(res.stats.cfps).toBe(3);
    expect(res.stats.journals).toBe(2);
    expect(res.stats.papers).toBe(1);
  });

  it('should throw NotFoundException if opportunity does not exist', async () => {
    mockOppRepo.findOne.mockResolvedValue(null);
    await expect(oppService.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
  });
});
