import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { createHash } from 'crypto';
import { EDGE_CACHE_METADATA_KEY, EdgeCacheOptions } from '../decorators/edge-cache.decorator';

@Injectable()
export class EdgeCacheInterceptor implements NestInterceptor {
  private readonly reflector: Reflector;

  constructor(reflector?: Reflector) {
    this.reflector = reflector || new Reflector();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    // Edge cache headers apply only to idempotent read operations (GET, HEAD)
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next.handle();
    }

    const options = this.reflector.getAllAndOverride<EdgeCacheOptions>(
      EDGE_CACHE_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!options) {
      return next.handle();
    }

    const maxAge = options.maxAge ?? 3600;
    const sMaxAge = options.sMaxAge ?? 86400;
    const swr = options.staleWhileRevalidate ?? 86400;
    const isPublic = options.public !== false;

    const cacheControlValue = [
      isPublic ? 'public' : 'private',
      `max-age=${maxAge}`,
      `s-maxage=${sMaxAge}`,
      `stale-while-revalidate=${swr}`,
    ].join(', ');

    // RFC 9111 & Cloudflare Enterprise standard headers
    res.setHeader('Cache-Control', cacheControlValue);
    res.setHeader('CDN-Cache-Control', `max-age=${sMaxAge}, stale-while-revalidate=${swr}`);
    res.setHeader('Cloudflare-CDN-Cache-Control', `max-age=${sMaxAge}, stale-while-revalidate=${swr}`);

    if (options.tags && options.tags.length > 0) {
      res.setHeader('Cache-Tag', options.tags.join(','));
    }

    return next.handle().pipe(
      map((body) => {
        if (!body) return body;

        // Generate strong cryptographic ETag
        const serialized = typeof body === 'string' ? body : JSON.stringify(body);
        const etag = `"${createHash('md5').update(serialized).digest('hex')}"`;
        res.setHeader('ETag', etag);

        // Check Client's If-None-Match condition for HTTP 304 Not Modified
        const rawIfNoneMatch = req.headers['if-none-match'];
        const ifNoneMatch = Array.isArray(rawIfNoneMatch) ? rawIfNoneMatch[0] : rawIfNoneMatch;
        if (
          ifNoneMatch &&
          (ifNoneMatch === '*' ||
            ifNoneMatch.replace(/"/g, '') === etag.replace(/"/g, '') ||
            ifNoneMatch === etag)
        ) {
          res.status(304);
          return null;
        }

        return body;
      }),
    );
  }
}
