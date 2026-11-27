import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

export type LogSeverity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface StructuredLogInput {
  severity?: LogSeverity;
  operation: string;
  requestId?: string;
  traceId?: string;
  actorId?: string;
  durationMs?: number;
  errorCategory?: string;
  message?: string;
  context?: Record<string, any>;
}

const SENSITIVE_KEY_PATTERN =
  /^(password|passwordHash|refreshToken|token|accessToken|secret|apiKey|authorization|cookie|documentSnippet|messages|content|abstract|text|rawPrompt|email|phone|address|connectionString)$/i;

@Injectable()
export class StructuredLoggerService {
  private readonly serviceName = 'cambium-api';
  private readonly environment = process.env.NODE_ENV || 'development';

  scrubString(raw: string): string {
    if (!raw) return '';
    return raw
      .replace(/postgres(?:ql)?:\/\/[^\s'"]+/gi, 'postgresql://[REDACTED_DSN]')
      .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [REDACTED_TOKEN]')
      .replace(/AIza[0-9A-Za-z-_]{20,}/g, '[REDACTED_API_KEY]')
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED_EMAIL]')
      .slice(0, 500);
  }

  scrubObject(input: Record<string, any> | undefined, depth = 0): Record<string, any> | undefined {
    if (!input || typeof input !== 'object' || depth > 3) return undefined;
    const output: Record<string, any> = {};
    for (const [k, v] of Object.entries(input)) {
      if (SENSITIVE_KEY_PATTERN.test(k)) {
        output[k] = '[REDACTED]';
      } else if (typeof v === 'string') {
        output[k] = this.scrubString(v);
      } else if (typeof v === 'number' || typeof v === 'boolean' || v === null) {
        output[k] = v;
      } else if (Array.isArray(v)) {
        output[k] = `[Array(${v.length})]`;
      } else if (typeof v === 'object') {
        output[k] = this.scrubObject(v, depth + 1) ?? '[Object]';
      }
    }
    return output;
  }

  pseudonymizeActor(actorId?: string): string | undefined {
    if (!actorId) return undefined;
    return createHash('sha256').update(`cambium-actor:${actorId}`).digest('hex').slice(0, 16);
  }

  formatEntry(input: StructuredLogInput) {
    return {
      timestamp: new Date().toISOString(),
      severity: input.severity || 'INFO',
      service: this.serviceName,
      env: this.environment,
      operation: input.operation,
      ...(input.requestId ? { requestId: input.requestId } : {}),
      ...(input.traceId ? { traceId: input.traceId } : {}),
      ...(input.actorId ? { safeActorHash: this.pseudonymizeActor(input.actorId) } : {}),
      ...(typeof input.durationMs === 'number' ? { durationMs: input.durationMs } : {}),
      ...(input.errorCategory ? { errorCategory: input.errorCategory } : {}),
      ...(input.message ? { message: this.scrubString(input.message) } : {}),
      ...(input.context ? { context: this.scrubObject(input.context) } : {}),
    };
  }

  emit(input: StructuredLogInput): Record<string, any> {
    const entry = this.formatEntry(input);
    if (process.env.NODE_ENV !== 'test') {
      const line = JSON.stringify(entry);
      if (entry.severity === 'ERROR') console.error(line);
      else if (entry.severity === 'WARN') console.warn(line);
      else console.log(line);
    }
    return entry;
  }
}
