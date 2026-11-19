import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { createHash } from 'crypto';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    // Only apply ETag calculation on read requests (GET / HEAD)
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // Do not touch null, undefined, or SSE streams
        if (data === null || data === undefined) {
          return data;
        }

        try {
          const stringified = typeof data === 'string' ? data : JSON.stringify(data);
          const hash = createHash('sha1').update(stringified).digest('hex').substring(0, 16);
          const etag = `W/"${hash}"`;

          if (res?.setHeader) {
            res.setHeader('ETag', etag);
          }

          const ifNoneMatch = req.headers['if-none-match'];
          if (ifNoneMatch && (ifNoneMatch === etag || ifNoneMatch === `"${hash}"`)) {
            if (res?.status) {
              res.status(HttpStatus.NOT_MODIFIED);
            }
            return null; // Empty body for 304 Not Modified
          }
        } catch {
          // If hashing fails, pass through original response
        }

        return data;
      }),
    );
  }
}
