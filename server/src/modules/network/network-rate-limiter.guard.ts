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
export interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
}

export const RateLimit = (limit: number, windowSeconds = 60) =>
  SetMetadata(RATE_LIMIT_KEY, { limit, windowSeconds } as RateLimitOptions);

interface ClientBucket {
  timestamps: number[];
  resetTime: number;
}

@Injectable()
export class NetworkRateLimiterGuard implements CanActivate {
  // In-memory sliding window bucket store: clientKey -> ClientBucket
  private static readonly buckets = new Map<string, ClientBucket>();
  private readonly defaultLimit = 120; // 120 req/min
  private readonly defaultWindowSeconds = 60;

  constructor(private readonly reflector?: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    // Check custom route options
    const options = this.reflector?.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const limit = options?.limit ?? this.defaultLimit;
    const windowMs = (options?.windowSeconds ?? this.defaultWindowSeconds) * 1000;
    const now = Date.now();

    // Identify client by authenticated user ID or forwarded IP
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      '127.0.0.1';
    const userId = req.user?.id || req.headers['x-user-id'];
    const clientKey = userId ? `user:${userId}` : `ip:${clientIp}`;

    let bucket = NetworkRateLimiterGuard.buckets.get(clientKey);
    if (!bucket || now > bucket.resetTime) {
      bucket = {
        timestamps: [],
        resetTime: now + windowMs,
      };
      NetworkRateLimiterGuard.buckets.set(clientKey, bucket);
    }

    // Filter out timestamps older than sliding window
    const windowStart = now - windowMs;
    bucket.timestamps = bucket.timestamps.filter((ts) => ts > windowStart);

    const remaining = Math.max(0, limit - bucket.timestamps.length);
    const resetSeconds = Math.ceil((bucket.resetTime - now) / 1000);

    // Set standard IETF rate-limit headers
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

  /**
   * Helper for tests to reset bucket state
   */
  static clearBuckets() {
    NetworkRateLimiterGuard.buckets.clear();
  }
}
