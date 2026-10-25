import { Module, Global } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { TelemetryInterceptor } from './telemetry.interceptor';

@Global()
@Module({
  controllers: [TelemetryController],
  providers: [TelemetryService, TelemetryInterceptor],
  exports: [TelemetryService, TelemetryInterceptor],
})
export class TelemetryModule {}
