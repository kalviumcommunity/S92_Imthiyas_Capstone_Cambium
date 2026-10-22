import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ResearchOpportunity } from '../opportunities/entities/research-opportunity.entity';
import { Tag } from '../opportunities/entities/tag.entity';
import { GeminiEmbeddingService } from '../ai/gemini-embedding.service';
import { GrantsGovCrawler, CrawledOpportunity } from './crawlers/grants-gov.crawler';
import { OpenAlexCrawler } from './crawlers/openalex.crawler';
import { QueueService } from '../../common/queues/queue.service';
import { QUEUE_NAMES, IngestionJobData } from '../../common/queues/queue.constants';

export interface CrawlExecutionResult {
  source: 'grants_gov' | 'openalex' | 'all';
  totalDiscovered: number;
  newlyIngested: number;
  skippedDuplicates: number;
  durationMs: number;
  timestamp: string;
  items: Array<{ title: string; organization: string; id: string; status: 'created' | 'duplicate' }>;
}

@Injectable()
export class IngestionService implements OnModuleInit {
  private readonly logger = new Logger(IngestionService.name);

  private lastExecution: CrawlExecutionResult | null = null;
  private totalIngestedHistorical = 0;

  constructor(
    @InjectRepository(ResearchOpportunity)
    private readonly oppRepo: Repository<ResearchOpportunity>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    @Inject(GeminiEmbeddingService)
    private readonly geminiEmbeddingService: GeminiEmbeddingService,
    @Inject(GrantsGovCrawler)
    private readonly grantsGovCrawler: GrantsGovCrawler,
    @Inject(OpenAlexCrawler)
    private readonly openAlexCrawler: OpenAlexCrawler,
    @Inject(QueueService)
    private readonly queueService: QueueService,
  ) {}

  onModuleInit() {
    // Register asynchronous background BullMQ worker
    this.queueService.registerProcessor(QUEUE_NAMES.INGESTION, async (job) => {
      const data: IngestionJobData = job.data;
      this.logger.log(` BullMQ Ingestion Worker processing job ${job.id} for source: ${data.source}`);
      return this.crawlAndIngest(data.source, data.limit || 10);
    });
  }

  /**
   * Execute crawler, check for duplicates, generate Gemini 768-dim embeddings, and persist to PostgreSQL
   */
  async crawlAndIngest(
    source: 'grants_gov' | 'openalex' | 'all' = 'all',
    limit = 10,
  ): Promise<CrawlExecutionResult> {
    const startTime = Date.now();
    this.logger.log(` Starting automated academic crawler pipeline for source: [${source}] (Limit: ${limit})`);

    const candidates: CrawledOpportunity[] = [];

    if (source === 'grants_gov' || source === 'all') {
      const grants = await this.grantsGovCrawler.crawl(limit);
      candidates.push(...grants);
    }

    if (source === 'openalex' || source === 'all') {
      const papers = await this.openAlexCrawler.crawl(limit);
      candidates.push(...papers);
    }

    let newlyIngested = 0;
    let skippedDuplicates = 0;
    const itemsReport: Array<{ title: string; organization: string; id: string; status: 'created' | 'duplicate' }> = [];

    for (const item of candidates) {
      // Duplicate detection by title or link
      const existing = await this.oppRepo.findOne({
        where: [{ title: item.title }, { link: item.link }],
      });

      if (existing) {
        skippedDuplicates++;
        itemsReport.push({
          title: item.title,
          organization: item.organization,
          id: existing.id,
          status: 'duplicate',
        });
        continue;
      }

      // Resolve or create tags
      const tagEntities: Tag[] = [];
      if (item.tags && item.tags.length > 0) {
        for (const tagName of item.tags) {
          let tag = await this.tagRepo.findOne({ where: { name: tagName } });
          if (!tag) {
            tag = this.tagRepo.create({ name: tagName });
            tag = await this.tagRepo.save(tag);
          }
          tagEntities.push(tag);
        }
      }

      // Compute high-dimensional semantic embedding via Google Gemini text-embedding-004
      const embeddingText = `${item.title}. ${item.organization}. ${item.description}`;
      const embeddingResult = await this.geminiEmbeddingService.generateEmbedding(embeddingText);

      // Persist to PostgreSQL 3NF table
      const newOpp = this.oppRepo.create({
        title: item.title,
        organization: item.organization,
        type: item.type,
        deadline: item.deadline,
        description: item.description,
        link: item.link,
        tags: tagEntities,
        embedding: embeddingResult.embedding,
      });

      const saved = (await this.oppRepo.save(newOpp)) as ResearchOpportunity;
      newlyIngested++;
      this.totalIngestedHistorical++;

      itemsReport.push({
        title: saved.title,
        organization: saved.organization,
        id: saved.id,
        status: 'created',
      });
    }

    const durationMs = Date.now() - startTime;
    const result: CrawlExecutionResult = {
      source,
      totalDiscovered: candidates.length,
      newlyIngested,
      skippedDuplicates,
      durationMs,
      timestamp: new Date().toISOString(),
      items: itemsReport,
    };

    this.lastExecution = result;
    this.logger.log(
      ` Crawler run finished in ${durationMs}ms: Discovered ${candidates.length}, Ingested ${newlyIngested}, Duplicates ${skippedDuplicates}`,
    );

    return result;
  }

  /**
   * Enqueue asynchronous crawler run via BullMQ
   */
  async triggerAsyncCrawl(source: 'grants_gov' | 'openalex' | 'all' = 'all', limit = 10) {
    return this.queueService.addIngestionJob({
      source,
      limit,
      triggeredBy: 'manual-api',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get overall ingestion service metrics and queue state
   */
  async getStatus() {
    const totalCount = await this.oppRepo.count();
    const queueMetrics = await this.queueService.getMetrics();

    return {
      status: 'active',
      totalCatalogOpportunities: totalCount,
      totalIngestedHistorical: this.totalIngestedHistorical,
      lastExecution: this.lastExecution,
      queues: queueMetrics,
      crawlers: [
        { name: 'GrantsGovCrawler', type: 'Federal Grants (NSF/NIH/DOE)', status: 'ready' },
        { name: 'OpenAlexCrawler', type: 'Scholarly Works & CFPs', status: 'ready' },
      ],
    };
  }
}
