import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RelationshipsModule } from './modules/relationships/relationships.module';
import { RedisModule } from './common/redis/redis.module';
import { ChatModule } from './modules/chat/chat.module';
import { EventsModule } from './modules/events/events.module';
import { OutboxModule } from './common/outbox/outbox.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { EmailModule } from './modules/email/email.module';
import { QueuesModule } from './common/queues/queues.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { UploadModule } from './modules/upload/upload.module';
import { IdempotencyInterceptor } from './common/interceptors/idempotency.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

import { DatabaseDiagnosticService } from './database/database-diagnostic.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => getDatabaseConfig(),
    }),
    RedisModule,
    QueuesModule,
    UsersModule,
    AuthModule,
    OpportunitiesModule,
    BookmarksModule,
    NotificationsModule,
    RelationshipsModule,
    ChatModule,
    EventsModule,
    OutboxModule,
    AssistantModule,
    EmailModule,
    IngestionModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    DatabaseDiagnosticService,
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [DatabaseDiagnosticService],
})
export class AppModule {}
