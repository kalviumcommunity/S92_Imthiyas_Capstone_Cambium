import { Module } from '@nestjs/common';
import { NetworkDiagnosticsController } from './network-diagnostics.controller';
import { NetworkDiagnosticsService } from './network-diagnostics.service';
import { NetworkRateLimiterGuard } from './network-rate-limiter.guard';
import { EtagInterceptor } from './etag.interceptor';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [NetworkDiagnosticsController],
  providers: [
    NetworkDiagnosticsService,
    NetworkRateLimiterGuard,
    EtagInterceptor,
  ],
  exports: [
    NetworkDiagnosticsService,
    NetworkRateLimiterGuard,
    EtagInterceptor,
  ],
})
export class NetworkModule {}
