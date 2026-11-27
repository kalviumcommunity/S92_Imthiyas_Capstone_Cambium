import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  GatewayTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

const DEFAULT_REQUEST_TIMEOUT_MS = parseInt(
  process.env.API_REQUEST_TIMEOUT_MS || '20000',
  10,
);

/**
 * Prevents non-streaming HTTP routes from hanging indefinitely under saturation or slow upstream I/O.
 * Automatically bypasses SSE event streams and multipart uploads.
 */
@Injectable()
export class RequestTimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const url: string = req?.url || req?.originalUrl || '';
    const accept: string = String(req?.headers?.accept || '');

    if (
      accept.includes('text/event-stream') ||
      url.includes('/events') ||
      url.includes('/assistant/stream') ||
      url.includes('/upload')
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      timeout(DEFAULT_REQUEST_TIMEOUT_MS),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new GatewayTimeoutException(
                `Request exceeded ${DEFAULT_REQUEST_TIMEOUT_MS}ms processing budget`,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
