import { Module, Global } from '@nestjs/common';
import { MultiTierCacheService } from './multi-tier-cache.service';
import { PerformanceController } from './performance.controller';
import { RedisModule } from '../../common/redis/redis.module';

@Global()
@Module({
  imports: [RedisModule],
  controllers: [PerformanceController],
  providers: [MultiTierCacheService],
  exports: [MultiTierCacheService],
})
export class PerformanceModule {}
