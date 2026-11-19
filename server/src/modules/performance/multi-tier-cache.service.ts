import { Injectable, Logger, Optional } from '@nestjs/common';
import { RedisService } from '../../common/redis/redis.service';

interface L1CacheEntry<T> {
  value: T;
  expiresAt: number;
  tags: string[];
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRatio: number;
  l1Entries: number;
  l2Status: 'CONNECTED' | 'IN_MEMORY_FALLBACK';
}

@Injectable()
export class MultiTierCacheService {
  private readonly logger = new Logger(MultiTierCacheService.name);

  // L1 In-Memory High-Speed Cache: key -> L1CacheEntry
  private readonly l1Cache = new Map<string, L1CacheEntry<any>>();
  private readonly maxL1Entries = 1000;

  // Performance telemetry counters
  private hitsCount = 0;
  private missesCount = 0;

  constructor(
    @Optional()
    private readonly redisService?: RedisService,
  ) {}

  /**
   * Retrieve value checking L1 memory first, falling back to L2 Redis
   */
  async get<T>(key: string): Promise<T | null> {
    const now = Date.now();

    // 1. Check L1 Memory Cache (Sub-millisecond)
    const l1Entry = this.l1Cache.get(key);
    if (l1Entry) {
      if (now < l1Entry.expiresAt) {
        this.hitsCount++;
        return l1Entry.value as T;
      }
      // Expired L1 entry
      this.l1Cache.delete(key);
    }

    // 2. Check L2 Redis Cache
    if (this.redisService) {
      try {
        const l2Value = await this.redisService.get(key);
        if (l2Value) {
          const parsed = JSON.parse(l2Value) as T;
          // Populate L1 cache with remaining TTL
          this.setL1(key, parsed, 60, []);
          this.hitsCount++;
          return parsed;
        }
      } catch (err) {
        this.logger.debug(`L2 Redis read bypassed: ${(err as Error).message}`);
      }
    }

    this.missesCount++;
    return null;
  }

  /**
   * Set value into L1 memory and L2 Redis with TTL
   */
  async set<T>(
    key: string,
    value: T,
    ttlSeconds = 300,
    tags: string[] = [],
  ): Promise<void> {
    // 1. Set into L1
    this.setL1(key, value, ttlSeconds, tags);

    // 2. Set into L2 Redis
    if (this.redisService) {
      try {
        await this.redisService.set(key, JSON.stringify(value), ttlSeconds);
      } catch (err) {
        this.logger.debug(`L2 Redis write bypassed: ${(err as Error).message}`);
      }
    }
  }

  /**
   * Wrap an expensive query/factory with automatic multi-tier caching
   */
  async wrap<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds = 300,
    tags: string[] = [],
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await factory();
    await this.set(key, fresh, ttlSeconds, tags);
    return fresh;
  }

  /**
   * Invalidate a single key across L1 and L2
   */
  async invalidate(key: string): Promise<void> {
    this.l1Cache.delete(key);
    if (this.redisService) {
      try {
        await this.redisService.del(key);
      } catch {}
    }
  }

  /**
   * Invalidate all keys matching a prefix or tag
   */
  async invalidateByPrefix(prefix: string): Promise<number> {
    let count = 0;
    // Invalidate L1
    for (const key of this.l1Cache.keys()) {
      if (key.startsWith(prefix)) {
        this.l1Cache.delete(key);
        count++;
      }
    }

    // Invalidate L2
    if (this.redisService) {
      try {
        const client = (this.redisService as any).client;
        if (client && client.keys) {
          const keys: string[] = await client.keys(`${prefix}*`);
          if (keys.length > 0) {
            await Promise.all(keys.map((k) => this.redisService!.del(k)));
          }
        }
      } catch {}
    }

    return count;
  }

  private setL1<T>(key: string, value: T, ttlSeconds: number, tags: string[]) {
    // Enforce size bound: evict oldest entry if limit reached
    if (this.l1Cache.size >= this.maxL1Entries) {
      const oldestKey = this.l1Cache.keys().next().value;
      if (oldestKey) {
        this.l1Cache.delete(oldestKey);
      }
    }

    this.l1Cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
      tags,
    });
  }

  getMetrics(): CacheMetrics {
    const total = this.hitsCount + this.missesCount;
    const hitRatio = total > 0 ? Number((this.hitsCount / total).toFixed(4)) : 1.0;

    return {
      hits: this.hitsCount,
      misses: this.missesCount,
      hitRatio,
      l1Entries: this.l1Cache.size,
      l2Status: this.redisService ? 'CONNECTED' : 'IN_MEMORY_FALLBACK',
    };
  }

  clear() {
    this.l1Cache.clear();
    this.hitsCount = 0;
    this.missesCount = 0;
  }
}
