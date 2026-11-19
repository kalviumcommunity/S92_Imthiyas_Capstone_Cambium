import { Module, Global } from '@nestjs/common';
import { CircuitBreakerService } from './circuit-breaker.service';
import { GracefulDegradationInterceptor } from './graceful-degradation.interceptor';

@Global()
@Module({
  providers: [CircuitBreakerService, GracefulDegradationInterceptor],
  exports: [CircuitBreakerService, GracefulDegradationInterceptor],
})
export class ResilienceModule {}
