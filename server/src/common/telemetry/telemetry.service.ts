import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export type SpanKind = 'SERVER' | 'CLIENT' | 'INTERNAL' | 'PRODUCER' | 'CONSUMER';
export type SpanStatus = 'OK' | 'ERROR';

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  kind: SpanKind;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  status: SpanStatus;
  attributes: Record<string, any>;
  errorMessage?: string;
}

export interface TelemetryMetrics {
  totalRequests: number;
  totalErrors: number;
  errorRatePercent: number;
  p50LatencyMs: number;
  p90LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  activeSpansCount: number;
  recordedTracesCount: number;
  uptimeSeconds: number;
}

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  // In-memory trace buffer & active spans
  private readonly recentSpans: Span[] = [];
  private readonly activeSpans = new Map<string, Span>();
  private readonly maxBufferSize = 500;

  // Latency metrics tracking
  private readonly latencySamples: number[] = [];
  private readonly maxSamples = 1000;
  private totalRequests = 0;
  private totalErrors = 0;
  private readonly startTime = Date.now();

  /**
   * Generates a 32-character hex trace ID (16 bytes)
   */
  generateTraceId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Generates a 16-character hex span ID (8 bytes)
   */
  generateSpanId(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  /**
   * Formats a W3C compliant traceparent header: 00-{traceId}-{spanId}-01
   */
  formatTraceparent(traceId: string, spanId: string): string {
    return `00-${traceId}-${spanId}-01`;
  }

  /**
   * Parses an incoming W3C traceparent header: 00-{traceId}-{spanId}-{flags}
   */
  parseTraceparent(header?: string): { traceId: string; spanId: string } | null {
    if (!header || typeof header !== 'string') return null;
    const parts = header.trim().split('-');
    if (parts.length >= 4 && parts[1]?.length === 32 && parts[2]?.length === 16) {
      return { traceId: parts[1], spanId: parts[2] };
    }
    return null;
  }

  /**
   * Starts a new distributed tracing span
   */
  startSpan(
    name: string,
    options?: {
      parentTraceparent?: string;
      parentTraceId?: string;
      parentSpanId?: string;
      kind?: SpanKind;
      attributes?: Record<string, any>;
    },
  ): {
    span: Span;
    end: (status?: SpanStatus, errorMessage?: string) => Span;
    setAttribute: (key: string, value: any) => void;
  } {
    let traceId = options?.parentTraceId;
    let parentSpanId = options?.parentSpanId;

    if (options?.parentTraceparent) {
      const parsed = this.parseTraceparent(options.parentTraceparent);
      if (parsed) {
        traceId = parsed.traceId;
        parentSpanId = parsed.spanId;
      }
    }

    if (!traceId) {
      traceId = this.generateTraceId();
    }

    const spanId = this.generateSpanId();
    const span: Span = {
      traceId,
      spanId,
      parentSpanId,
      name,
      kind: options?.kind || 'INTERNAL',
      startTime: Date.now(),
      status: 'OK',
      attributes: options?.attributes ? { ...options.attributes } : {},
    };

    this.activeSpans.set(spanId, span);

    return {
      span,
      setAttribute: (key: string, value: any) => {
        span.attributes[key] = value;
      },
      end: (status: SpanStatus = 'OK', errorMessage?: string): Span => {
        span.endTime = Date.now();
        span.durationMs = Math.max(0, span.endTime - span.startTime);
        span.status = status;
        if (errorMessage) {
          span.errorMessage = errorMessage;
        }

        this.activeSpans.delete(spanId);
        this.recordSpan(span);
        return span;
      },
    };
  }

  /**
   * Records a completed span into metrics and buffer
   */
  private recordSpan(span: Span) {
    this.totalRequests++;
    if (span.status === 'ERROR') {
      this.totalErrors++;
    }

    if (typeof span.durationMs === 'number') {
      this.latencySamples.push(span.durationMs);
      if (this.latencySamples.length > this.maxSamples) {
        this.latencySamples.shift();
      }
    }

    this.recentSpans.unshift(span);
    if (this.recentSpans.length > this.maxBufferSize) {
      this.recentSpans.pop();
    }
  }

  /**
   * Returns calculated percentile latencies (p50, p90, p95, p99)
   */
  getMetrics(): TelemetryMetrics {
    const sorted = [...this.latencySamples].sort((a, b) => a - b);
    const getPercentile = (p: number) => {
      if (sorted.length === 0) return 0;
      const index = Math.min(Math.floor((p / 100) * sorted.length), sorted.length - 1);
      return sorted[index];
    };

    const errorRate = this.totalRequests > 0 ? (this.totalErrors / this.totalRequests) * 100 : 0;

    return {
      totalRequests: this.totalRequests,
      totalErrors: this.totalErrors,
      errorRatePercent: +errorRate.toFixed(2),
      p50LatencyMs: getPercentile(50),
      p90LatencyMs: getPercentile(90),
      p95LatencyMs: getPercentile(95),
      p99LatencyMs: getPercentile(99),
      activeSpansCount: this.activeSpans.size,
      recordedTracesCount: this.recentSpans.length,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  /**
   * Retrieves recent traces
   */
  getRecentSpans(limit = 50): Span[] {
    return this.recentSpans.slice(0, Math.min(limit, this.maxBufferSize));
  }

  /**
   * OpenTelemetry OTLP JSON trace export payload (Grafana / Jaeger / Tempo compatible)
   */
  getOtlpPayload() {
    const spans = this.getRecentSpans(100);
    return {
      resourceSpans: [
        {
          resource: {
            attributes: [
              { key: 'service.name', value: { stringValue: 'cambium-research-platform' } },
              { key: 'service.version', value: { stringValue: '2.0.0' } },
              { key: 'deployment.environment', value: { stringValue: process.env.NODE_ENV || 'development' } },
            ],
          },
          scopeSpans: [
            {
              scope: { name: '@cambium/telemetry', version: '2.0.0' },
              spans: spans.map((s) => ({
                traceId: s.traceId,
                spanId: s.spanId,
                parentSpanId: s.parentSpanId || '',
                name: s.name,
                kind: s.kind === 'SERVER' ? 1 : s.kind === 'CLIENT' ? 2 : 0,
                startTimeUnixNano: `${s.startTime}000000`,
                endTimeUnixNano: `${(s.endTime || s.startTime)}000000`,
                status: { code: s.status === 'OK' ? 1 : 2, message: s.errorMessage || '' },
                attributes: Object.entries(s.attributes).map(([k, v]) => ({
                  key: k,
                  value: typeof v === 'number' ? { intValue: v } : { stringValue: String(v) },
                })),
              })),
            },
          ],
        },
      ],
    };
  }
}
