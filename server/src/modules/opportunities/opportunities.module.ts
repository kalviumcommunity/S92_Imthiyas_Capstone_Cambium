import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchOpportunity } from './entities/research-opportunity.entity';
import { Tag } from './entities/tag.entity';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';
import { HybridSearchService } from './hybrid-search.service';
import { AiModule } from '../ai/ai.module';
import { CloudflarePurgeService } from '../../common/services/cloudflare-purge.service';
import { EdgeCacheInterceptor } from '../../common/interceptors/edge-cache.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResearchOpportunity, Tag]),
    AiModule,
  ],
  controllers: [OpportunitiesController],
  providers: [
    OpportunitiesService,
    HybridSearchService,
    CloudflarePurgeService,
    EdgeCacheInterceptor,
  ],
  exports: [
    OpportunitiesService,
    HybridSearchService,
    CloudflarePurgeService,
    TypeOrmModule,
  ],
})
export class OpportunitiesModule {}
