import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ResearchOpportunity } from '../opportunities/entities/research-opportunity.entity';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { RelationshipsService } from './relationships.service';
import { RelationshipsController } from './relationships.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ResearchOpportunity, Bookmark, Notification]),
  ],
  controllers: [RelationshipsController],
  providers: [RelationshipsService],
  exports: [RelationshipsService],
})
export class RelationshipsModule {}
