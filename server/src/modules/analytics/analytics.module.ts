import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { AiTelemetryEvent } from './entities/ai-telemetry-event.entity';
import { ClientErrorEvent } from './entities/client-error-event.entity';
import { ProductAnalyticsService } from './product-analytics.service';
import { AiObservabilityService } from './ai-observability.service';
import { AlertEvaluatorService } from './alert-evaluator.service';
import { AnalyticsController } from './analytics.controller';
import { StructuredLoggerService } from '../../common/logging/structured-logger.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AnalyticsEvent, AiTelemetryEvent, ClientErrorEvent]),
  ],
  controllers: [AnalyticsController],
  providers: [
    ProductAnalyticsService,
    AiObservabilityService,
    AlertEvaluatorService,
    StructuredLoggerService,
  ],
  exports: [
    ProductAnalyticsService,
    AiObservabilityService,
    AlertEvaluatorService,
    StructuredLoggerService,
    TypeOrmModule,
  ],
})
export class AnalyticsModule {}
