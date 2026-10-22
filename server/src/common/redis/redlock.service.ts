import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { RedisService } from './redis.service';
import { randomUUID } from 'crypto';

export interface DistributedLock {
  lockId: string;
  resource: string;
  expiresAt: number;
}

@Injectable()
export class RedlockService {
  private readonly logger = new Logger(RedlockService.name);

  // In-memory fallback lock store for development/testing without Redis
  private readonly memoryLocks = new Map<string, { lockId: string; expiresAt: number }>();

  // Lua script ensuring only the lock owner who holds the matching lockId can release it
  private readonly RELEASE_LUA_SCRIPT = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  constructor(private readonly redisService: RedisService) {}

  /**
   * Acquire a distributed concurrency lock on a given resource with automatic retry and jitter
   * @param resource e.g. "crawler:grants-gov:OPP-89210"
   * @param ttlMs Lock time-to-live in milliseconds (default 10,000ms = 10s)
   * @param maxRetries Maximum attempts before giving up (default 3)
   * @param retryDelayMs Initial delay between retries with exponential jitter
   */
  async acquire(
    resource: string,
    ttlMs = 10000,
    maxRetries = 3,
    retryDelayMs = 150,
  ): Promise<DistributedLock | null> {
    const lockKey = `cambium:lock:${resource}`;
    const lockId = randomUUID();

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const client = this.redisService.getClient();

      if (client) {
        try {
          // Atomic SET ... PX ... NX
          const result = await client.set(lockKey, lockId, 'PX', ttlMs, 'NX');
          if (result === 'OK') {
            return { lockId, resource, expiresAt: Date.now() + ttlMs };
          }
        } catch (err: any) {
          this.logger.warn(`Redis lock acquisition error on attempt ${attempt + 1}: ${err.message}`);
        }
      } else {
        // Resilient in-memory fallback
        const existing = this.memoryLocks.get(lockKey);
        const now = Date.now();
        if (!existing || existing.expiresAt <= now) {
          this.memoryLocks.set(lockKey, { lockId, expiresAt: now + ttlMs });
          return { lockId, resource, expiresAt: now + ttlMs };
        }
      }

      if (attempt < maxRetries) {
        // Exponential backoff with random jitter between 50-150ms
        const jitter = Math.floor(Math.random() * 100);
        const delay = retryDelayMs * Math.pow(1.5, attempt) + jitter;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    return null;
  }

  /**
   * Release a distributed lock atomically
   */
  async release(lock: DistributedLock): Promise<boolean> {
    const lockKey = `cambium:lock:${lock.resource}`;
    const client = this.redisService.getClient();

    if (client) {
      try {
        const result = await client.eval(
          this.RELEASE_LUA_SCRIPT,
          1,
          lockKey,
          lock.lockId,
        );
        return result === 1;
      } catch (err: any) {
        this.logger.warn(`Redis lock release error: ${err.message}`);
        return false;
      }
    } else {
      const existing = this.memoryLocks.get(lockKey);
      if (existing && existing.lockId === lock.lockId) {
        this.memoryLocks.delete(lockKey);
        return true;
      }
      return false;
    }
  }

  /**
   * High-level execution wrapper executing task within a distributed lock
   * Automatically acquires, executes, and releases the lock with zero leaks.
   */
  async withLock<T>(
    resource: string,
    task: () => Promise<T>,
    ttlMs = 15000,
  ): Promise<T> {
    const lock = await this.acquire(resource, ttlMs);
    if (!lock) {
      throw new ConflictException(
        `Resource "${resource}" is currently locked by a concurrent crawler worker or process.`,
      );
    }

    try {
      return await task();
    } finally {
      await this.release(lock).catch((err) => {
        this.logger.warn(`Failed to cleanly release lock on resource "${resource}": ${err?.message}`);
      });
    }
  }
}
