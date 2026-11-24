import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Optional,
  Inject,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { randomUUID } from 'crypto';
import { TelemetryService } from './telemetry.service';

@Injectable()
export class TelemetryInterceptor implements NestInterceptor {
  private readonly telemetryService: TelemetryService;
  private readonly logger = new Logger(TelemetryInterceptor.name);

  constructor(
    @Optional()
    @Inject(TelemetryService)
    telemetryService?: TelemetryService,
  ) {
    this.telemetryService = telemetryService || new TelemetryService();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (
      context.getType() !== 'http' ||
      !this.telemetryService ||
      typeof this.telemetryService.startSpan !== 'function'
    ) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const incomingReqId = req.headers['x-request-id'];
    const requestId =
      typeof incomingReqId === 'string' && incomingReqId.trim().length > 0
        ? incomingReqId.trim().slice(0, 64)
        : randomUUID();
    req.requestId = requestId;

    const parentTraceparent = req.headers['traceparent'] || req.headers['x-traceparent'];
    const path = req.route?.path || req.url?.split('?')[0] || 'unknown';
    const method = req.method || 'GET';

    const { span, end, setAttribute } = this.telemetryService.startSpan(
      `HTTP ${method} ${path}`,
      {
        parentTraceparent: typeof parentTraceparent === 'string' ? parentTraceparent : undefined,
        kind: 'SERVER',
        attributes: {
          'http.method': method,
          'http.route': path,
          'cambium.request_id': requestId,
        },
      },
    );

    if (res && typeof res.setHeader === 'function') {
      res.setHeader('X-Request-Id', requestId);
      res.setHeader('x-trace-id', span.traceId);
      res.setHeader('x-span-id', span.spanId);
      res.setHeader('traceparent', this.telemetryService.formatTraceparent(span.traceId, span.spanId));
    }

    return next.handle().pipe(
      tap(() => {
        const statusCode = res.statusCode || 200;
        setAttribute('http.status_code', statusCode);
        const completed = end(statusCode >= 400 ? 'ERROR' : 'OK');
        if (statusCode >= 500 || (completed.durationMs ?? 0) > 1500) {
          this.logger.log(
            JSON.stringify({
              level: statusCode >= 500 ? 'error' : 'warn',
              requestId,
              traceId: span.traceId,
              method,
              route: path,
              statusCode,
              durationMs: completed.durationMs,
            }),
          );
        }
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
