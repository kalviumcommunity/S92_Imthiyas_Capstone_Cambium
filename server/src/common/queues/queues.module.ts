import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { BackgroundJob } from '../../database/entities/background-job.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([BackgroundJob])],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueuesModule {}
