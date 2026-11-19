import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupProject } from './entities/group-project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectActivityLog } from './entities/project-activity-log.entity';
import { WorkspaceComment } from './entities/workspace-comment.entity';
import { User } from '../users/entities/user.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { EventsModule } from '../events/events.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupProject,
      ProjectMember,
      ProjectActivityLog,
      WorkspaceComment,
      User,
    ]),
    NotificationsModule,
    EventsModule,
    ChatModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
