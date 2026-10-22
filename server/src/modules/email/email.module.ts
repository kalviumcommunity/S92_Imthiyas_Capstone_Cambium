import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { OpportunitiesModule } from '../opportunities/opportunities.module';
import { DeadlineDigestWorker } from './workers/deadline-digest.worker';
import { User } from '../users/entities/user.entity';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';
import { ResearchOpportunity } from '../opportunities/entities/research-opportunity.entity';
import { QueuesModule } from '../../common/queues/queues.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Bookmark, ResearchOpportunity]),
    OpportunitiesModule,
    QueuesModule,
  ],
  controllers: [EmailController],
  providers: [EmailService, DeadlineDigestWorker],
  exports: [EmailService, DeadlineDigestWorker],
})
export class EmailModule {}

