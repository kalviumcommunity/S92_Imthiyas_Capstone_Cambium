import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const RATE_LIMIT_KEY = 'cambium_rate_limit';
export const SKIP_RATE_LIMIT_KEY = 'cambium_skip_rate_limit';

export interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
}

export const RateLimit = (limit: number, windowSeconds = 60) =>
  SetMetadata(RATE_LIMIT_KEY, { limit, windowSeconds } as RateLimitOptions);

export const SkipRateLimit = () => SetMetadata(SKIP_RATE_LIMIT_KEY, true);

interface ClientBucket {
  timestamps: number[];
  resetTime: number;
}

@Injectable()
export class NetworkRateLimiterGuard implements CanActivate {
  private static readonly buckets = new Map<string, ClientBucket>();
  private static readonly MAX_TRACKED_BUCKETS = 10000;
  private readonly defaultLimit = 120; // 120 req/min
  private readonly defaultWindowSeconds = 60;

  constructor(private readonly reflector?: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (typeof context.getType === 'function' && context.getType() !== 'http') {
      return true;
    }

    const skip = this.reflector?.getAllAndOverride<boolean>(SKIP_RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();
    if (!req) return true;

    const urlPath = req.url || req.originalUrl || '';
    if (urlPath.startsWith('/health') || urlPath === '/api/v1/network/ping') {
      return true;
    }

    const options = this.reflector?.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const limit = options?.limit ?? this.defaultLimit;
    const windowMs = (options?.windowSeconds ?? this.defaultWindowSeconds) * 1000;
    const now = Date.now();

    // Key ONLY by authenticated JWT user ID or verified IP (never trust client x-user-id header)
    const clientIp =
      req.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers?.['x-real-ip'] ||
      req.socket?.remoteAddress ||
      '127.0.0.1';
    const verifiedUserId = req.user?.id;
    const clientKey = verifiedUserId ? `user:${verifiedUserId}` : `ip:${clientIp}`;

    if (NetworkRateLimiterGuard.buckets.size > NetworkRateLimiterGuard.MAX_TRACKED_BUCKETS) {
      for (const [k, b] of NetworkRateLimiterGuard.buckets.entries()) {
        if (now > b.resetTime) {
          NetworkRateLimiterGuard.buckets.delete(k);
        }
      }
    }

    let bucket = NetworkRateLimiterGuard.buckets.get(clientKey);
    if (!bucket || now > bucket.resetTime) {
      bucket = {
        timestamps: [],
        resetTime: now + windowMs,
      };
      NetworkRateLimiterGuard.buckets.set(clientKey, bucket);
    }

    const windowStart = now - windowMs;
    bucket.timestamps = bucket.timestamps.filter((ts) => ts > windowStart);

    const remaining = Math.max(0, limit - bucket.timestamps.length);
    const resetSeconds = Math.max(1, Math.ceil((bucket.resetTime - now) / 1000));

    if (res?.setHeader) {
      res.setHeader('X-RateLimit-Limit', limit.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader('X-RateLimit-Reset', bucket.resetTime.toString());
    }

    if (bucket.timestamps.length >= limit) {
      if (res?.setHeader) {
        res.setHeader('Retry-After', resetSeconds.toString());
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Network rate limit exceeded. Maximum ${limit} requests per ${windowMs / 1000}s.`,
          retryAfterSeconds: resetSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    bucket.timestamps.push(now);
    return true;
  }

  static clearBuckets() {
    NetworkRateLimiterGuard.buckets.clear();
  }
}
