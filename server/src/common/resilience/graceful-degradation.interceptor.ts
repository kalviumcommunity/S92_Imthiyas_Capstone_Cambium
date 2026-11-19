import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { SreErrorClassifier } from './sre-error-classifier';

@Injectable()
export class GracefulDegradationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GracefulDegradationInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const res = http.getResponse();

    return next.handle().pipe(
      catchError((error) => {
        const classification = SreErrorClassifier.classify(error);

        // Attach structured SRE diagnostics headers to response
        if (res?.setHeader) {
          res.setHeader('X-Cambium-Incident-Code', classification.incidentCode);
          res.setHeader('X-Cambium-Error-Category', classification.category);
          res.setHeader('X-Cambium-Retriable', classification.isRetriable.toString());
        }

        this.logger.warn(
          `[SRE Telemetry] Intercepted error (${classification.incidentCode}): ${classification.category} - ${classification.recommendedAction}`,
        );

        return throwError(() => error);
      }),
    );
  }
}
