import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConnectionsService } from './connections.service';
import { ConnectionStatus } from './entities/scholar-connection.entity';

describe('ConnectionsService', () => {
  let service: ConnectionsService;
  let mockConnRepo: any;
  let mockFollowRepo: any;
  let mockUserRepo: any;

  beforeEach(() => {
    mockConnRepo = {
      findOne: vi.fn().mockResolvedValue(null),
      find: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(12),
      create: vi.fn((d) => ({ id: 'conn-1', ...d })),
      save: vi.fn((d) => Promise.resolve({ id: 'conn-1', ...d })),
      remove: vi.fn().mockResolvedValue(true),
      createQueryBuilder: vi.fn(() => ({
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([
          {
            id: 'conn-1',
            requesterId: 'u-1',
            addresseeId: 'u-2',
            status: ConnectionStatus.ACCEPTED,
            academicContext: 'Met at NeurIPS',
            requester: { id: 'u-1', fullName: 'Dr. Imthiyas' },
            addressee: { id: 'u-2', fullName: 'Prof. Thorne' },
          },
        ]),
      })),
    };

    mockFollowRepo = {
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn((d) => d),
      save: vi.fn((d) => Promise.resolve(d)),
      remove: vi.fn().mockResolvedValue(true),
      count: vi.fn().mockResolvedValue(48),
    };

    mockUserRepo = {
      findOne: vi.fn().mockResolvedValue({ id: 'u-2', fullName: 'Prof. Thorne' }),
    };

    service = new ConnectionsService(mockConnRepo, mockFollowRepo, mockUserRepo);
  });

  it('should dispatch connection request successfully', async () => {
    const res = await service.requestConnection('u-1', 'u-2', 'Co-authored on Nature paper');
    expect(res.success).toBe(true);
    expect(res.data.status).toBe(ConnectionStatus.PENDING);
    expect(mockConnRepo.save).toHaveBeenCalled();
  });

  it('should prevent connecting with oneself', async () => {
    await expect(service.requestConnection('u-1', 'u-1')).rejects.toThrow();
  });

  it('should accept connection request', async () => {
    mockConnRepo.findOne.mockResolvedValueOnce({
      id: 'conn-1',
      requesterId: 'u-1',
      addresseeId: 'u-2',
      status: ConnectionStatus.PENDING,
      requester: { fullName: 'Dr. Imthiyas' },
    });

    const res = await service.respondToConnection('conn-1', 'u-2', true);
    expect(res.success).toBe(true);
    expect(res.status).toBe(ConnectionStatus.ACCEPTED);
  });

  it('should toggle follow when not following', async () => {
    const res = await service.toggleFollow('u-1', 'u-2');
    expect(res.success).toBe(true);
    expect(res.following).toBe(true);
    expect(mockFollowRepo.save).toHaveBeenCalled();
  });

  it('should return network overview metrics', async () => {
    const res = await service.getNetworkOverview('u-1');
    expect(res.success).toBe(true);
    expect(res.metrics.connections).toBe(12);
    expect(res.metrics.followers).toBe(48);
  });

  it('should remove an active connection', async () => {
    mockConnRepo.findOne.mockResolvedValueOnce({
      id: 'conn-1',
      requesterId: 'u-1',
      addresseeId: 'u-2',
    });

    const res = await service.removeConnection('conn-1', 'u-1');
    expect(res.success).toBe(true);
    expect(mockConnRepo.remove).toHaveBeenCalled();
  });
});
