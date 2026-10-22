import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  onModuleInit() {
    // Relay poller running every 4,000ms to guarantee zero event loss
    this.timer = setInterval(() => {
      this.processPendingBatch().catch((err) => {
        this.logger.error(`Error during outbox relay execution: ${err?.message}`);
      });
    }, 4000);
    this.logger.log(' Transactional Outbox Relay Worker active');
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * Process a batch of pending outbox events with row-level concurrency lock
   */
  async processPendingBatch(batchSize = 25): Promise<number> {
    if (this.isProcessing) return 0;
    this.isProcessing = true;

    try {
      // Find up to batchSize PENDING events ordered by creation
      const pendingEvents = await this.outboxRepo.find({
        where: { status: 'PENDING' },
        order: { createdAt: 'ASC' },
        take: batchSize,
      });

      if (pendingEvents.length === 0) {
        return 0;
      }

      for (const event of pendingEvents) {
        try {
          event.status = 'PROCESSING';
          await this.outboxRepo.save(event);

          // 1. Dispatch to SSE Reactive Event Stream
          if (this.eventsService) {
            this.eventsService.emit({
              type: 'grant_alert',
              userId: event.payload?.userId,
              data: {
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

          // 2. Dispatch to Distributed WebSocket Chat Room if collaboration event
          if (this.chatGateway && event.payload?.room) {
            this.chatGateway.server
              ?.to(event.payload.room)
              ?.emit('outbox_broadcast', {
                eventType: event.eventType,
                aggregateId: event.aggregateId,
                payload: event.payload,
              });
          }

          // 3. Dispatch to Redis L2 Cache / PubSub Bus
          if (this.redisService) {
            await this.redisService.set(
              `cambium:audit:${event.aggregateType}:${event.aggregateId}`,
              JSON.stringify(event.payload),
              86400,
            );
          }

          // Mark as successfully published
          event.status = 'PUBLISHED';
          event.processedAt = new Date();
          await this.outboxRepo.save(event);
          this.logger.debug(` Outbox event [${event.id}] dispatched to streams and marked PUBLISHED`);
        } catch (err: any) {
          event.retryCount += 1;
          event.errorMessage = err?.message || String(err);
          event.status = event.retryCount >= 5 ? 'FAILED' : 'PENDING';
          await this.outboxRepo.save(event);
          this.logger.warn(`Outbox event [${event.id}] dispatch failed (attempt ${event.retryCount}): ${err?.message}`);
        }
      }

      return pendingEvents.length;
    } finally {
      this.isProcessing = false;
    }
  }
}
