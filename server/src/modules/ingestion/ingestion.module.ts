import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchOpportunity } from '../opportunities/entities/research-opportunity.entity';
import { Tag } from '../opportunities/entities/tag.entity';
import { AiModule } from '../ai/ai.module';
import { QueuesModule } from '../../common/queues/queues.module';
import { GrantsGovCrawler } from './crawlers/grants-gov.crawler';
import { OpenAlexCrawler } from './crawlers/openalex.crawler';
import { ArxivCrawler } from './crawlers/arxiv.crawler';
import { CrossrefCrawler } from './crawlers/crossref.crawler';
import { DoajCrawler } from './crawlers/doaj.crawler';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResearchOpportunity, Tag]),
    AiModule,
    QueuesModule,
  ],
  controllers: [IngestionController],
  providers: [
    GrantsGovCrawler,
    OpenAlexCrawler,
    ArxivCrawler,
    CrossrefCrawler,
    DoajCrawler,
    IngestionService,
  ],
  exports: [IngestionService],
})
export class IngestionModule {}
