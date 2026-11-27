import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { AiTelemetryEvent } from './entities/ai-telemetry-event.entity';
import { ClientErrorEvent } from './entities/client-error-event.entity';
import { ProductAnalyticsService } from './product-analytics.service';
import { StructuredLoggerService } from '../../common/logging/structured-logger.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AnalyticsEvent, AiTelemetryEvent, ClientErrorEvent]),
  ],
  providers: [ProductAnalyticsService, StructuredLoggerService],
  exports: [ProductAnalyticsService, StructuredLoggerService, TypeOrmModule],
})
export class AnalyticsModule {}
