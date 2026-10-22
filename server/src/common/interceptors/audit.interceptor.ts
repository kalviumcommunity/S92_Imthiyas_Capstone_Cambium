import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Optional,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { createHash } from 'crypto';
import { AuditLog, AuditAction } from '../../database/entities/audit-log.entity';

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    @Optional()
    @Inject(DataSource)
    private readonly dataSource?: DataSource,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const method = req.method;

    // Only audit mutating state transitions
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const path = req.originalUrl || req.url;
    // Skip health checks, auth login/refresh, and testing endpoints
    if (path.includes('/auth/') || path.includes('/health') || path.includes('/ai-test')) {
      return next.handle();
    }

    const user = req.user;
    const body = { ...req.body };
    // Redact sensitive credential fields before auditing
    delete body.password;
    delete body.refreshToken;
    delete body.token;

    return next.handle().pipe(
      tap({
        next: async (resData) => {
          try {
            await this.recordAuditReceipt({
              method,
              path,
              userId: user?.id,
              payload: body,
              responseData: resData,
            });
          } catch (err: any) {
            this.logger.error(`Failed to write cryptographic audit receipt: ${err.message}`);
          }
        },
      }),
    );
  }

  private async recordAuditReceipt(info: {
    method: string;
    path: string;
    userId?: string;
    payload: any;
    responseData: any;
  }) {
    if (!this.dataSource || !this.dataSource.isInitialized) return;

    const auditRepo = this.dataSource.getRepository(AuditLog);

    // Fetch the most recent hash to maintain cryptographic chain
    const latestRecord = await auditRepo.findOne({
      order: { createdAt: 'DESC' },
    });

    const previousHash = latestRecord?.currentHash || GENESIS_HASH;

    let action: AuditAction = 'UPDATE';
    if (info.method === 'POST') action = 'CREATE';
    if (info.method === 'DELETE') action = 'DELETE';

    const entityName = info.path.split('/')[2] || 'system_resource';
    const entityId =
      info.responseData?.data?.id ||
      info.responseData?.id ||
      info.payload?.id ||
      info.path.split('/').pop() ||
      'unknown-entity';

    const timestamp = new Date();
    const payloadStr = JSON.stringify({
      path: info.path,
      payload: info.payload,
      responseId: info.responseData?.data?.id || info.responseData?.id,
    });

    // Compute H_n = SHA256(H_n-1 || payload || timestamp)
    const currentHash = createHash('sha256')
      .update(previousHash + payloadStr + timestamp.toISOString())
      .digest('hex');

    const auditEntry = auditRepo.create({
      entityName,
      entityId: String(entityId),
      action,
      userId: info.userId,
      payload: {
        path: info.path,
        method: info.method,
        sample: info.payload,
      },
      previousHash,
      currentHash,
      createdAt: timestamp,
    });

    await auditRepo.save(auditEntry);
    this.logger.debug(` Immutable SHA-256 receipt recorded: [${currentHash.slice(0, 12)}...] for ${action} on ${entityName}`);
  }
}
