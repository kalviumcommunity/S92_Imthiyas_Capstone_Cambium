import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MultiTierCacheService } from './multi-tier-cache.service';

@ApiTags('Performance Engineering')
@Controller('api/v1/performance')
export class PerformanceController {
  constructor(private readonly cacheService: MultiTierCacheService) {}

  @Get('metrics')
  @ApiOperation({
    summary: 'Inspect L1/L2 cache hit ratios, memory allocation, and query performance telemetry',
  })
  @ApiResponse({
    status: 200,
    description: 'Real-time performance and caching metrics',
  })
  getMetrics() {
    const mem = process.memoryUsage();
    const cacheMetrics = this.cacheService.getMetrics();

    return {
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      cache: cacheMetrics,
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
