import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

describe('NotificationsService (Persistent, Paginated, IDOR-Safe)', () => {
  let service: NotificationsService;
  let mockRepo: any;
  let mockEvents: any;
  let mockGateway: any;

  beforeEach(() => {
    mockRepo = {
      findOne: vi.fn(),
      findAndCount: vi.fn().mockResolvedValue([
        [{ id: 'n-1', userId: 'u-1', message: 'Invite', isRead: false }],
        1,
      ]),
      count: vi.fn().mockResolvedValue(1),
      create: vi.fn((d) => ({ id: 'n-new', isRead: false, ...d })),
      save: vi.fn((d) => Promise.resolve({ id: 'n-new', ...d })),
      remove: vi.fn().mockResolvedValue(true),
      createQueryBuilder: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({ affected: 2 }),
      }),
    };
    mockEvents = { dispatchNotification: vi.fn() };
    mockGateway = { broadcastUserNotification: vi.fn() };
    service = new NotificationsService(mockRepo, mockEvents, mockGateway);
  });

  it('should deduplicate notifications sharing the same dedupKey', async () => {
    const existing = { id: 'n-existing', userId: 'u-1', dedupKey: 'invite:p1:u1' };
    mockRepo.findOne.mockResolvedValueOnce(existing);

    const res = await service.create({
      user: 'u-1',
      message: 'Invited',
      dedupKey: 'invite:p1:u1',
    });

    expect(res.deduplicated).toBe(true);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('should block IDOR attempts when marking another user notification as read', async () => {
    mockRepo.findOne.mockResolvedValueOnce({ id: 'n-1', userId: 'u-victim', isRead: false });

    await expect(service.markAsRead('n-1', 'u-attacker')).rejects.toThrow(ForbiddenException);
  });

  it('should set isRead and readAt timestamp for rightful notification owner', async () => {
    mockRepo.findOne.mockResolvedValueOnce({ id: 'n-1', userId: 'u-owner', isRead: false });

    const res = await service.markAsRead('n-1', 'u-owner');
    expect(res.data.isRead).toBe(true);
    expect(res.data.readAt).toBeInstanceOf(Date);
  });

  it('should block IDOR attempts on notification deletion', async () => {
    mockRepo.findOne.mockResolvedValueOnce({ id: 'n-1', userId: 'u-victim' });
    await expect(service.remove('n-1', 'u-attacker')).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if notification does not exist', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.markAsRead('missing', 'u-owner')).rejects.toThrow(NotFoundException);
  });

  it('should return paginated list with total and unreadCount', async () => {
    const res = await service.findByUserId('u-1', { limit: 10, offset: 0 });
    expect(res.success).toBe(true);
    expect(res.total).toBe(1);
    expect(res.unreadCount).toBe(1);
  });
});
