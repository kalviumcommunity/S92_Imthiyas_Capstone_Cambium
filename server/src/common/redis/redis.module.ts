import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedlockService } from './redlock.service';

@Global()
@Module({
  providers: [RedisService, RedlockService],
  exports: [RedisService, RedlockService],
})
export class RedisModule {}
