import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchOpportunity } from './entities/research-opportunity.entity';
import { Tag } from './entities/tag.entity';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResearchOpportunity, Tag])],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService],
  exports: [OpportunitiesService, TypeOrmModule],
})
export class OpportunitiesModule {}
