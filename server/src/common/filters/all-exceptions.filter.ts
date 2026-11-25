import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

const PG_ERROR_MAP: Record<string, { status: number; code: string; message: string }> = {
  '23505': {
    status: HttpStatus.CONFLICT,
    code: 'UNIQUE_CONSTRAINT_VIOLATION',
    message: 'A record with these unique attributes already exists.',
  },
  '23503': {
    status: HttpStatus.BAD_REQUEST,
    code: 'FOREIGN_KEY_VIOLATION',
    message: 'Referenced resource does not exist or cannot be linked.',
  },
  '23514': {
    status: HttpStatus.BAD_REQUEST,
    code: 'CHECK_CONSTRAINT_VIOLATION',
    message: 'Submitted values violate domain integrity bounds.',
  },
  '22P02': {
    status: HttpStatus.BAD_REQUEST,
    code: 'INVALID_IDENTIFIER_FORMAT',
    message: 'Invalid identifier or parameter syntax provided.',
  },
};

/**
 * Global exception normalizer ensuring consistent API error contracts and
 * preventing raw PostgreSQL driver details or stack traces from leaking to clients.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      return;
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request & { requestId?: string }>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message: string | string[] = 'An unexpected error occurred. Please retry shortly.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (body && typeof body === 'object') {
        const record = body as Record<string, any>;
        message = record.message || exception.message;
        errorCode = record.errorCode || record.error || HttpStatus[status] || errorCode;
      }
    } else if (
      exception instanceof SyntaxError ||
      (exception as any)?.type === 'entity.parse.failed'
    ) {
      status = HttpStatus.BAD_REQUEST;
      errorCode = 'MALFORMED_JSON_BODY';
      message = 'Request body contains malformed JSON.';
    } else {
      const driverCode = (exception as any)?.code || (exception as any)?.driverError?.code;
      if (typeof driverCode === 'string' && PG_ERROR_MAP[driverCode]) {
        const mapped = PG_ERROR_MAP[driverCode];
        status = mapped.status;
        errorCode = mapped.code;
        message = mapped.message;
      } else if (exception instanceof Error) {
        this.logger.error(
          `Unhandled error on ${req?.method} ${req?.url} [reqId=${req?.requestId || 'none'}]: ${exception.message}`,
          exception.stack,
        );
      }
    }

    res.status(status).json({
      success: false,
      statusCode: status,
      errorCode,
      message,
      requestId: req?.requestId || undefined,
      path: req?.url,
      timestamp: new Date().toISOString(),
    });
  }
}
