import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchContribution } from './entities/research-contribution.entity';
import { User } from '../users/entities/user.entity';
import { GroupProject } from '../projects/entities/group-project.entity';
import { ContributionsService } from './contributions.service';
import { ContributionsController } from './contributions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResearchContribution, User, GroupProject]),
  ],
  controllers: [ContributionsController],
  providers: [ContributionsService],
  exports: [ContributionsService],
})
export class ContributionsModule {}

