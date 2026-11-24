import { Controller, Get, Post, HttpCode, HttpStatus, Query, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutboxEvent } from '../../database/entities/outbox-event.entity';
import { OutboxRelayService } from './outbox-relay.service';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { Roles } from '../../modules/auth/decorators/roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';

@ApiTags('Transactional Outbox')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.RD_DIRECTOR, UserRole.COMPLIANCE_OFFICER)
@Controller('api/v1/outbox')
export class OutboxController {
  constructor(
    @InjectRepository(OutboxEvent)
    private readonly outboxRepo: Repository<OutboxEvent>,
    @Inject(OutboxRelayService)
    private readonly outboxRelay: OutboxRelayService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Inspect recent outbox events and their publishing statuses (Admin/Director)' })
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

  @Post('replay-failed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Re-queue dead-letter FAILED outbox events back to PENDING' })
  async replayFailed() {
    const res = await this.outboxRepo
      .createQueryBuilder()
      .update(OutboxEvent)
      .set({ status: 'PENDING', retryCount: 0 })
      .where('status = :status', { status: 'FAILED' })
      .execute();

    return {
      success: true,
      requeuedCount: res.affected || 0,
      timestamp: new Date().toISOString(),
    };
  }
}
