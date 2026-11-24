import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OutboxEvent } from '../../database/entities/outbox-event.entity';
import { EventsService } from '../../modules/events/events.service';
import { ChatGateway } from '../../modules/chat/chat.gateway';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class OutboxRelayService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxRelayService.name);
  private timer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor(
    @InjectRepository(OutboxEvent)
    private readonly outboxRepo: Repository<OutboxEvent>,
    @Optional() private readonly eventsService?: EventsService,
    @Optional() private readonly chatGateway?: ChatGateway,
    @Optional() private readonly redisService?: RedisService,
    @Optional() private readonly dataSource?: DataSource,
  ) {}

  onModuleInit() {
    this.timer = setInterval(() => {
      this.processPendingBatch().catch((err) => {
        this.logger.error(`Error during outbox relay execution: ${err?.message}`);
      });
    }, 4000);
    this.logger.log('Transactional Outbox Relay Worker active');
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * Claim and dispatch a batch of pending outbox events.
   * Uses PostgreSQL FOR UPDATE SKIP LOCKED when DataSource is initialized so
   * multiple API replicas never double-dispatch the same event.
   */
  async processPendingBatch(batchSize = 25): Promise<number> {
    if (this.isProcessing) return 0;
    this.isProcessing = true;

    try {
      const pendingEvents = await this.claimPendingEvents(batchSize);
      if (pendingEvents.length === 0) {
        return 0;
      }

      for (const event of pendingEvents) {
        try {
          if (!this.dataSource?.isInitialized) {
            event.status = 'PROCESSING';
            await this.outboxRepo.save(event);
          }

          const targetRoom =
            event.payload?.room ||
            (event.payload?.projectId ? `workspace:${event.payload.projectId}` : undefined);

          if (this.eventsService) {
            this.eventsService.emit({
              type: 'grant_alert',
              id: event.id,
              userId: event.payload?.userId,
              data: {
                eventId: event.id,
                eventType: event.eventType,
                aggregateType: event.aggregateType,
                aggregateId: event.aggregateId,
                payload: event.payload,
              },
            });

            if (event.payload?.userId) {
              this.eventsService.dispatchBadgeCount(event.payload.userId, 1);
            }
          }

          if (this.chatGateway?.server) {
            if (targetRoom) {
              this.chatGateway.server.to(targetRoom).emit('outbox_broadcast', {
                eventId: event.id,
                eventType: event.eventType,
                aggregateType: event.aggregateType,
                aggregateId: event.aggregateId,
                payload: event.payload,
              });
            }
            if (event.payload?.userId) {
              this.chatGateway.broadcastUserNotification?.(event.payload.userId, {
                eventId: event.id,
                eventType: event.eventType,
                aggregateId: event.aggregateId,
                payload: event.payload,
              });
            }
          }

          if (this.redisService) {
            await this.redisService.set(
              `cambium:audit:${event.aggregateType}:${event.aggregateId}`,
              JSON.stringify(event.payload),
              86400,
            );
          }

          event.status = 'PUBLISHED';
          event.processedAt = new Date();
          await this.outboxRepo.save(event);
        } catch (err: any) {
          event.retryCount += 1;
          event.errorMessage = err?.message || String(err);
          event.status = event.retryCount >= 5 ? 'FAILED' : 'PENDING';
          await this.outboxRepo.save(event);
          this.logger.warn(
            `Outbox event [${event.id}] dispatch failed (attempt ${event.retryCount}): ${err?.message}`,
          );
        }
      }

      return pendingEvents.length;
    } finally {
      this.isProcessing = false;
    }
  }

  private async claimPendingEvents(batchSize: number): Promise<OutboxEvent[]> {
    if (this.dataSource && this.dataSource.isInitialized) {
      return this.dataSource.transaction(async (manager) => {
        const repo = manager.getRepository(OutboxEvent);
        const events = await repo
          .createQueryBuilder('evt')
          .setLock('pessimistic_write')
          .setOnLocked('skip_locked')
          .where('evt.status = :status', { status: 'PENDING' })
          .orderBy('evt.createdAt', 'ASC')
          .take(batchSize)
          .getMany();

        if (events.length > 0) {
          for (const evt of events) {
            evt.status = 'PROCESSING';
          }
          await repo.save(events);
        }
        return events;
      });
    }

    return this.outboxRepo.find({
      where: { status: 'PENDING' },
      order: { createdAt: 'ASC' },
      take: batchSize,
    });
  }
}
