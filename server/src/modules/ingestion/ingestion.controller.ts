import { Controller, Post, Get, Body, HttpCode, HttpStatus, Query, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Academic Crawlers & Ingestion (BullMQ)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('api/v1/ingestion')
export class IngestionController {
  constructor(
    @Inject(IngestionService)
    private readonly ingestionService: IngestionService,
  ) {}

  @Post('trigger')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger automated academic crawler for Grants.gov, OpenAlex, arXiv, Crossref, & DOAJ' })
  @ApiResponse({ status: 200, description: 'Crawler execution finished or enqueued' })
  async triggerCrawl(
    @Body()
    body: {
      source?: 'grants_gov' | 'openalex' | 'arxiv' | 'crossref' | 'doaj' | 'all';
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
