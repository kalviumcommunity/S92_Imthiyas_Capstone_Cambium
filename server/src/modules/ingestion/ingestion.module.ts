import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchOpportunity } from '../opportunities/entities/research-opportunity.entity';
import { Tag } from '../opportunities/entities/tag.entity';
import { AiModule } from '../ai/ai.module';
import { QueuesModule } from '../../common/queues/queues.module';
import { GrantsGovCrawler } from './crawlers/grants-gov.crawler';
import { OpenAlexCrawler } from './crawlers/openalex.crawler';
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
    IngestionService,
  ],
  exports: [IngestionService],
})
export class IngestionModule {}
