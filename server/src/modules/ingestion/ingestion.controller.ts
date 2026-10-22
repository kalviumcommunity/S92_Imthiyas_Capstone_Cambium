import { Controller, Post, Get, Body, HttpCode, HttpStatus, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';

@ApiTags('Academic Crawlers & Ingestion (BullMQ)')
@Controller('api/v1/ingestion')
export class IngestionController {
  constructor(
    @Inject(IngestionService)
    private readonly ingestionService: IngestionService,
  ) {}

  @Post('trigger')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger automated academic crawler for Grants.gov & OpenAlex' })
  @ApiResponse({ status: 200, description: 'Crawler execution finished or enqueued' })
  async triggerCrawl(
    @Body()
    body: {
      source?: 'grants_gov' | 'openalex' | 'all';
      limit?: number;
      async?: boolean;
    },
  ) {
    const source = body?.source || 'all';
    const limit = body?.limit ? Math.min(body.limit, 50) : 10;
    const isAsync = body?.async ?? false;

    if (isAsync) {
      const job = await this.ingestionService.triggerAsyncCrawl(source, limit);
      return {
        status: 'enqueued',
        jobId: job.id,
        source,
        limit,
        message: 'Crawl job queued on BullMQ ingestion queue.',
      };
    }

    return this.ingestionService.crawlAndIngest(source, limit);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get crawler metrics, queue status, and historical totals' })
  @ApiResponse({ status: 200, description: 'Current crawler status and queue depth' })
  async getStatus() {
    return this.ingestionService.getStatus();
  }
}
