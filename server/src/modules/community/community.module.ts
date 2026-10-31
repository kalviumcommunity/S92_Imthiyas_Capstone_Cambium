import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicPost } from './entities/academic-post.entity';
import { Comment } from './entities/comment.entity';
import { PostReaction } from './entities/post-reaction.entity';
import { User } from '../users/entities/user.entity';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AcademicPost, Comment, PostReaction, User]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService],
})
export class CommunityModule {}
