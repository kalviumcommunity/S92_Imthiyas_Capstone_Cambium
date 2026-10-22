import { Controller, Get, Post, HttpCode, HttpStatus, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutboxEvent } from '../../database/entities/outbox-event.entity';
import { OutboxRelayService } from './outbox-relay.service';

@ApiTags('Transactional Outbox')
@Controller('api/v1/outbox')
export class OutboxController {
  constructor(
    @InjectRepository(OutboxEvent)
    private readonly outboxRepo: Repository<OutboxEvent>,
    @Inject(OutboxRelayService)
    private readonly outboxRelay: OutboxRelayService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Inspect recent outbox events and their publishing statuses' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED'] })
  @ApiResponse({ status: 200, description: 'List of outbox events' })
  async getEvents(@Query('status') status?: any) {
    const where = status ? { status } : {};
    return this.outboxRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  @Post('process')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger an immediate on-demand sweep of pending outbox events' })
  @ApiResponse({ status: 200, description: 'Batch process summary' })
  async triggerRelayProcess() {
    const processed = await this.outboxRelay.processPendingBatch(50);
    return {
      success: true,
      processedEvents: processed,
      timestamp: new Date().toISOString(),
    };
  }
}
