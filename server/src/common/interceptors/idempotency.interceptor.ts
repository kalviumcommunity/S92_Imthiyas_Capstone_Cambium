import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { RedisService } from '../redis/redis.service';
import { IDEMPOTENT_METADATA_KEY, IdempotentOptions } from '../decorators/idempotent.decorator';

interface CachedIdempotencyRecord {
  state: 'PROCESSING' | 'COMPLETED';
  statusCode?: number;
  body?: any;
  createdAt: string;
}

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // Only apply to HTTP requests
    if (typeof context.getType === 'function' && context.getType() !== 'http') {
      return next.handle();
    }

    const httpContext = typeof context.switchToHttp === 'function' ? context.switchToHttp() : null;
    const req = httpContext?.getRequest ? httpContext.getRequest<Request>() : null;
    const res = httpContext?.getResponse ? httpContext.getResponse<Response>() : null;

    if (!req || !req.headers) {
      return next.handle();
    }

    // Idempotency applies only to mutating state operations
    if (req.method && !['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next.handle();
    }

    const options =
      this.reflector?.getAllAndOverride<IdempotentOptions>(IDEMPOTENT_METADATA_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || {};

    const rawKey = req.headers['idempotency-key'] || req.headers['x-idempotency-key'];
    const idempotencyKey = Array.isArray(rawKey) ? rawKey[0] : rawKey;

    // Check if idempotency is mandatory for this mutation
    if (options.required && !idempotencyKey) {
      throw new BadRequestException(
        'Idempotency-Key header is mandatory for this mutation to prevent duplicate grant submissions',
      );
    }

    // If no key provided and not strictly required, pass through
    if (!idempotencyKey) {
      return next.handle();
    }

    // Build unique cache key scoped by user and endpoint
    const userId = (req as any).user?.id || 'anonymous';
    const redisKey = `idempotency:${userId}:${req.method}:${req.path}:${idempotencyKey}`;
    const ttlSeconds = options.ttlSeconds || 86400; // Default 24 hours

    // Inspect Redis for previous mutation state
    const existingRaw = await this.redisService.get(redisKey);
    if (existingRaw) {
      try {
        const record: CachedIdempotencyRecord = JSON.parse(existingRaw);

        if (record.state === 'PROCESSING') {
          throw new ConflictException(
            'A mutation with this Idempotency-Key is currently in progress. Please retry momentarily.',
          );
        }

        if (record.state === 'COMPLETED') {
          this.logger.log(`Idempotency HIT for key "${idempotencyKey}" on ${req.method} ${req.path}`);
          res.setHeader('X-Cache', 'HIT-IDEMPOTENCY');
          res.setHeader('X-Idempotency-Key', idempotencyKey);
          if (record.statusCode) {
            res.status(record.statusCode);
          }
          return of(record.body);
        }
      } catch (err: any) {
        if (err instanceof ConflictException) throw err;
        this.logger.warn(`Failed to parse cached idempotency record: ${err?.message}`);
      }
    }

    // Set lock in Redis with 60s timeout for processing
    const initialRecord: CachedIdempotencyRecord = {
      state: 'PROCESSING',
      createdAt: new Date().toISOString(),
    };
    await this.redisService.set(redisKey, JSON.stringify(initialRecord), 60);

    return next.handle().pipe(
      tap(async (responseBody) => {
        const completedRecord: CachedIdempotencyRecord = {
          state: 'COMPLETED',
          statusCode: res.statusCode,
          body: responseBody,
          createdAt: new Date().toISOString(),
        };
        await this.redisService.set(redisKey, JSON.stringify(completedRecord), ttlSeconds);
        res.setHeader('X-Cache', 'MISS-STORED');
        res.setHeader('X-Idempotency-Key', idempotencyKey);
      }),
      catchError((err) => {
        // Clear lock on server error to permit scholar to retry
        this.redisService.del(redisKey).catch(() => {});
        return throwError(() => err);
      }),
    );
  }
}
