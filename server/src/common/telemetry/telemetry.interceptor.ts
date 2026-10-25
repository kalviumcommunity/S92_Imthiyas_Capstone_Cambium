import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TelemetryService } from './telemetry.service';

@Injectable()
export class TelemetryInterceptor implements NestInterceptor {
  constructor(private readonly telemetryService: TelemetryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const parentTraceparent = req.headers['traceparent'] || req.headers['x-traceparent'];
    const path = req.route?.path || req.url || 'unknown';
    const method = req.method || 'GET';

    const { span, end, setAttribute } = this.telemetryService.startSpan(
      `HTTP ${method} ${path}`,
      {
        parentTraceparent: typeof parentTraceparent === 'string' ? parentTraceparent : undefined,
        kind: 'SERVER',
        attributes: {
          'http.method': method,
          'http.target': req.url,
          'http.route': path,
          'http.user_agent': req.headers['user-agent'] || 'unknown',
          'http.client_ip': req.ip || req.connection?.remoteAddress,
        },
      },
    );

    // Inject W3C TraceContext into response headers
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('x-trace-id', span.traceId);
      res.setHeader('x-span-id', span.spanId);
      res.setHeader('traceparent', this.telemetryService.formatTraceparent(span.traceId, span.spanId));
    }

    return next.handle().pipe(
      tap(() => {
        const statusCode = res.statusCode || 200;
        setAttribute('http.status_code', statusCode);
        end(statusCode >= 400 ? 'ERROR' : 'OK');
      }),
      catchError((err) => {
        const statusCode = err.status || 500;
        setAttribute('http.status_code', statusCode);
        end('ERROR', err.message || 'Internal Server Error');
        throw err;
      }),
    );
  }
}
