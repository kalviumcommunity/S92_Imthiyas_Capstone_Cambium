import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let redisService: RedisService;

  beforeEach(async () => {
    redisService = new RedisService();
    await redisService.onModuleInit();
  });

  afterEach(async () => {
    await redisService.onModuleDestroy();
  });

  it('should store and retrieve key-value pairs in resilient memory mode', async () => {
    await redisService.set('test_key', 'cambium_value');
    const val = await redisService.get('test_key');
    expect(val).toBe('cambium_value');
  });

  it('should delete keys properly', async () => {
    await redisService.set('key_to_delete', 'value');
    await redisService.del('key_to_delete');
    const val = await redisService.get('key_to_delete');
    expect(val).toBeNull();
  });

  it('should blacklist and verify jti revocation status', async () => {
    const testJti = 'test-jti-uuid-9999';
    expect(await redisService.isBlacklisted(testJti)).toBe(false);

    await redisService.blacklistJti(testJti, 3600);
    expect(await redisService.isBlacklisted(testJti)).toBe(true);
  });
});
