import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxEvent } from '../../database/entities/outbox-event.entity';
import { OutboxService } from './outbox.service';
import { OutboxRelayService } from './outbox-relay.service';
import { OutboxController } from './outbox.controller';
import { EventsModule } from '../../modules/events/events.module';
import { ChatModule } from '../../modules/chat/chat.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([OutboxEvent]),
    EventsModule,
    ChatModule,
  ],
  controllers: [OutboxController],
  providers: [OutboxService, OutboxRelayService],
  exports: [OutboxService, OutboxRelayService, TypeOrmModule],
})
export class OutboxModule {}
