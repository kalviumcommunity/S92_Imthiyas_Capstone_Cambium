import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Optional } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MultiTierCacheService } from './multi-tier-cache.service';
import { QueueService } from '../../common/queues/queue.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Performance Engineering')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('api/v1/performance')
export class PerformanceController {
  constructor(
    private readonly cacheService: MultiTierCacheService,
    @Optional() private readonly queueService?: QueueService,
  ) {}

  @Get('metrics')
  @ApiOperation({
    summary: 'Inspect L1/L2 cache hit ratios, queue depth, memory allocation, and query performance telemetry',
  })
  @ApiResponse({
    status: 200,
    description: 'Real-time performance, queue, and caching metrics',
  })
  async getMetrics() {
    const mem = process.memoryUsage();
    const cacheMetrics = this.cacheService.getMetrics();
    const queueMetrics = this.queueService ? await this.queueService.getMetrics() : null;

    return {
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      cache: cacheMetrics,
      queues: queueMetrics,
      memory: {
        rssMb: Math.round(mem.rss / (1024 * 1024)),
        heapTotalMb: Math.round(mem.heapTotal / (1024 * 1024)),
        heapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
        externalMb: Math.round(mem.external / (1024 * 1024)),
      },
      optimizationTier: {
        pgvectorIndex: 'HNSW Cosine Distance (M=16, efConstruction=64)',
        cacheStrategy: 'L1 In-Memory Map (LRU TTL) + L2 Redis Distributed',
        paginationStrategy: 'Keyset Deterministic Cursor Seek O(1)',
      },
    };
  }

  @Post('cache/purge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Purge cache keys by prefix or clear complete L1 cache' })
  async purgeCache(@Body() body: { prefix?: string }) {
    if (body.prefix) {
      const purged = await this.cacheService.invalidateByPrefix(body.prefix);
      return { success: true, purgedCount: purged, prefix: body.prefix };
    }
    this.cacheService.clear();
    return { success: true, message: 'L1 performance cache cleared' };
  }
}
