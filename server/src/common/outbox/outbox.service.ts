import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { OutboxEvent } from '../../database/entities/outbox-event.entity';

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(
    @InjectRepository(OutboxEvent)
    private readonly outboxRepo: Repository<OutboxEvent>,
  ) {}

  /**
   * MAANG Transactional Outbox: Writes the event record within the caller's active database transaction.
   * Guarantees zero dual-write discrepancies between the primary entity mutation and event dispatch.
   */
  async emitWithinTransaction(
    manager: EntityManager,
    aggregateType: string,
    aggregateId: string,
    eventType: string,
    payload: Record<string, any>,
  ): Promise<OutboxEvent> {
    const event = manager.create(OutboxEvent, {
      aggregateType,
      aggregateId,
      eventType,
      payload,
      status: 'PENDING',
      retryCount: 0,
    });

    const saved = await manager.save(OutboxEvent, event);
    this.logger.debug(
      `Outbox event staged within transaction: [${aggregateType}:${aggregateId}] -> ${eventType}`,
    );
    return saved;
  }

  /**
   * Standalone outbox emit outside an explicit transaction
   */
  async emit(
    aggregateType: string,
    aggregateId: string,
    eventType: string,
    payload: Record<string, any>,
  ): Promise<OutboxEvent> {
    const event = this.outboxRepo.create({
      aggregateType,
      aggregateId,
      eventType,
      payload,
      status: 'PENDING',
      retryCount: 0,
    });

    return this.outboxRepo.save(event);
  }
}
