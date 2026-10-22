import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OutboxRelayService } from './outbox-relay.service';
import { OutboxEvent } from '../../database/entities/outbox-event.entity';

describe('OutboxRelayService', () => {
  let relayService: OutboxRelayService;
  let mockOutboxRepo: any;
  let mockEventsService: any;
  let mockChatGateway: any;
  let mockRedisService: any;
  let storedEvents: OutboxEvent[];

  beforeEach(() => {
    storedEvents = [
      {
        id: 'outbox-uuid-1',
        aggregateType: 'OPPORTUNITY',
        aggregateId: 'grant-42',
        eventType: 'OPPORTUNITY_CREATED',
        payload: { title: 'DARPA AI Challenge', userId: 'user-alice' },
        status: 'PENDING',
        retryCount: 0,
        createdAt: new Date(),
      } as OutboxEvent,
    ];

    mockOutboxRepo = {
      find: vi.fn().mockImplementation(async () => storedEvents.filter((e) => e.status === 'PENDING')),
      save: vi.fn().mockImplementation(async (event: OutboxEvent) => {
        const idx = storedEvents.findIndex((e) => e.id === event.id);
        if (idx >= 0) storedEvents[idx] = event;
        return event;
      }),
    };

    mockEventsService = {
      emit: vi.fn(),
      dispatchBadgeCount: vi.fn(),
    };

    mockChatGateway = {
      server: {
        to: vi.fn().mockReturnValue({ emit: vi.fn() }),
      },
    };

    mockRedisService = {
      set: vi.fn().mockResolvedValue(undefined),
    };

    relayService = new OutboxRelayService(
      mockOutboxRepo as any,
      mockEventsService as any,
      mockChatGateway as any,
      mockRedisService as any,
    );
  });

  it('should process pending outbox events, dispatch to streams, and update status to PUBLISHED', async () => {
    const processedCount = await relayService.processPendingBatch(10);

    expect(processedCount).toBe(1);
    expect(mockEventsService.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'grant_alert',
        userId: 'user-alice',
      }),
    );
    expect(mockEventsService.dispatchBadgeCount).toHaveBeenCalledWith('user-alice', 1);
    expect(mockRedisService.set).toHaveBeenCalled();
    expect(storedEvents[0].status).toBe('PUBLISHED');
    expect(storedEvents[0].processedAt).toBeDefined();
  });

  it('should return 0 when no pending events exist', async () => {
    storedEvents = [];
    const count = await relayService.processPendingBatch(10);
    expect(count).toBe(0);
  });

  it('should increment retryCount and record error message on dispatch failure', async () => {
    mockEventsService.emit.mockImplementationOnce(() => {
      throw new Error('SSE stream connection dropped');
    });

    await relayService.processPendingBatch(10);

    expect(storedEvents[0].retryCount).toBe(1);
    expect(storedEvents[0].errorMessage).toContain('SSE stream connection dropped');
    expect(storedEvents[0].status).toBe('PENDING'); // Retries allowed
  });
});
