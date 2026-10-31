import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupProject } from './entities/group-project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectActivityLog } from './entities/project-activity-log.entity';
import { User } from '../users/entities/user.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupProject,
      ProjectMember,
      ProjectActivityLog,
      User,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
