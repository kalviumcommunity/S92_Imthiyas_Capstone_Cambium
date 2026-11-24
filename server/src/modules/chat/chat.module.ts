import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatMessage } from './entities/chat-message.entity';
import { GroupProject } from '../projects/entities/group-project.entity';
import { ProjectMember } from '../projects/entities/project-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage, GroupProject, ProjectMember])],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
