import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScholarConnection } from './entities/scholar-connection.entity';
import { ScholarFollow } from './entities/scholar-follow.entity';
import { User } from '../users/entities/user.entity';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScholarConnection, ScholarFollow, User]),
  ],
  controllers: [ConnectionsController],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
