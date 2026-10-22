import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

interface CacheEntry {
  value: string;
  expiresAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;

  // In-memory fallback cache for development/test environments without Redis
  private readonly memoryCache = new Map<string, CacheEntry>();
  private readonly rateLimitStore = new Map<string, { count: number; resetAt: number }>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST || '127.0.0.1';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = process.env.REDIS_PASSWORD || undefined;

    try {
      this.client = redisUrl
        ? new Redis(redisUrl, {
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            enableOfflineQueue: false,
            connectTimeout: 2000,
          })
        : new Redis({
            host: redisHost,
            port: redisPort,
            password: redisPassword,
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            enableOfflineQueue: false,
            connectTimeout: 2000,
          });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log(' Connected to Redis distributed cache & message broker');
      });

      this.client.on('error', (err) => {
        if (this.isConnected) {
          this.logger.warn(`Redis connection dropped: ${err.message}. Operating in resilient memory mode.`);
        }
        this.isConnected = false;
      });

      await this.client.connect().catch((err) => {
        this.logger.warn(`Redis server unavailable (${err.message}). Using resilient in-memory fallback.`);
        this.isConnected = false;
      });
    } catch (err: any) {
      this.logger.warn(`Failed to initialize Redis client: ${err?.message || err}. Fallback enabled.`);
      this.isConnected = false;
    }

    // Interval to purge expired memory entries every 60s
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.memoryCache.entries()) {
        if (entry.expiresAt > 0 && entry.expiresAt <= now) {
          this.memoryCache.delete(key);
        }
      }
      for (const [key, record] of this.rateLimitStore.entries()) {
        if (record.resetAt <= now) {
          this.rateLimitStore.delete(key);
        }
      }
    }, 60000);
  }

  async onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    if (this.client && this.isConnected) {
      await this.client.quit().catch(() => {});
    }
  }

  /**
   * BullMQ queue connection configuration
   */
  getBullConnection() {
    const redisHost = process.env.REDIS_HOST || '127.0.0.1';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = process.env.REDIS_PASSWORD || undefined;

    return {
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      maxRetriesPerRequest: null,
    };
  }

  /**
   * Retrieves raw client for adapter or pub/sub creation
   */
  getClient(): Redis | null {
    return this.isConnected ? this.client : null;
  }

  /**
   * Creates a dedicated sub/pub client for Socket.io adapter
   */
  createDuplicateClient(): Redis | null {
    if (!this.client || !this.isConnected) return null;
    return this.client.duplicate();
  }

  /**
   * Generic key-value get
   */
  async get(key: string): Promise<string | null> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.get(key);
      } catch (err) {
        this.logger.warn(`Redis get failed for key "${key}", checking memory cache.`);
      }
    }

    const entry = this.memoryCache.get(key);
    if (!entry) return null;
    if (entry.expiresAt > 0 && entry.expiresAt <= Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    return entry.value;
  }

  /**
   * Generic key-value set with optional TTL in seconds
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        if (ttlSeconds && ttlSeconds > 0) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch (err) {
        this.logger.warn(`Redis set failed for key "${key}", using memory cache fallback.`);
      }
    }

    const expiresAt = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : 0;
    this.memoryCache.set(key, { value, expiresAt });
  }

  /**
   * Generic key delete
   */
  async del(key: string): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
      } catch (err) {
        this.logger.warn(`Redis del failed for key "${key}".`);
      }
    }
    this.memoryCache.delete(key);
  }

  /**
   * L2 Cache Segment: Get cached object by subkey
   */
  async l2Get<T = any>(key: string): Promise<T | null> {
    const raw = await this.get(`cambium:cache:l2:${key}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw as any;
    }
  }

  /**
   * L2 Cache Segment: Store object in L2 cache
   */
  async l2Set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await this.set(`cambium:cache:l2:${key}`, serialized, ttlSeconds);
  }

  /**
   * L2 Cache Segment: Invalidate L2 key
   */
  async l2Del(key: string): Promise<void> {
    await this.del(`cambium:cache:l2:${key}`);
  }

  /**
   * Rate Limiting Segment: Sliding window rate limiting
   */
  async checkRateLimit(
    identifier: string,
    limit: number,
    windowSeconds: number,
  ): Promise<RateLimitResult> {
    const key = `cambium:rate-limit:${identifier}`;
    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    if (this.isConnected && this.client) {
      try {
        const pipeline = this.client.pipeline();
        pipeline.incr(key);
        pipeline.ttl(key);
        const results = await pipeline.exec();

        const count = results?.[0]?.[1] as number;
        let ttl = results?.[1]?.[1] as number;

        if (ttl === -1) {
          await this.client.expire(key, windowSeconds);
          ttl = windowSeconds;
        }

        const remaining = Math.max(0, limit - count);
        return {
          allowed: count <= limit,
          remaining,
          resetTime: now + (ttl > 0 ? ttl * 1000 : windowMs),
        };
      } catch (err) {
        this.logger.warn(`Redis rate limit error: ${err}. Falling back to memory rate limiter.`);
      }
    }

    // In-memory rate limiting fallback
    const record = this.rateLimitStore.get(key);
    if (!record || record.resetAt <= now) {
      this.rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
    }

    record.count++;
    const allowed = record.count <= limit;
    const remaining = Math.max(0, limit - record.count);
    return { allowed, remaining, resetTime: record.resetAt };
  }

  /**
   * Zero-Trust JWT Blacklist: Revokes a JWT ID (jti) until token expiration
   */
  async blacklistJti(jti: string, ttlSeconds: number): Promise<void> {
    const key = `blacklist:jti:${jti}`;
    await this.set(key, 'revoked', Math.max(ttlSeconds, 1));
  }

  /**
   * Checks if a JWT ID (jti) has been revoked
   */
  async isBlacklisted(jti: string): Promise<boolean> {
    const key = `blacklist:jti:${jti}`;
    const status = await this.get(key);
    return status === 'revoked';
  }
}
