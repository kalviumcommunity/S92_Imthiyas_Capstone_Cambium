import { describe, it, expect, beforeEach } from 'vitest';
import { TelemetryService } from './telemetry.service';

describe('TelemetryService (OpenTelemetry Distributed Tracing & Latency Percentiles)', () => {
  let service: TelemetryService;

  beforeEach(() => {
    service = new TelemetryService();
  });

  it('should generate valid 32-char hex trace IDs and 16-char hex span IDs', () => {
    const traceId = service.generateTraceId();
    const spanId = service.generateSpanId();

    expect(traceId).toHaveLength(32);
    expect(traceId).toMatch(/^[0-9a-f]{32}$/);
    expect(spanId).toHaveLength(16);
    expect(spanId).toMatch(/^[0-9a-f]{16}$/);
  });

  it('should format and parse W3C compliant traceparent headers', () => {
    const traceId = '4bf92f3577b34da6a3ce929d0e0e4736';
    const spanId = '00f067aa0ba902b7';
    const header = service.formatTraceparent(traceId, spanId);

    expect(header).toBe(`00-${traceId}-${spanId}-01`);

    const parsed = service.parseTraceparent(header);
    expect(parsed).not.toBeNull();
    expect(parsed?.traceId).toBe(traceId);
    expect(parsed?.spanId).toBe(spanId);
  });

  it('should create, record, and end spans with custom attributes', () => {
    const { span, end, setAttribute } = service.startSpan('pgvector.hnsw.search', {
      kind: 'INTERNAL',
      attributes: { 'db.system': 'postgresql', 'vector.dimensions': 768 },
    });

    expect(span.name).toBe('pgvector.hnsw.search');
    expect(span.status).toBe('OK');
    expect(span.attributes['vector.dimensions']).toBe(768);

    setAttribute('search.top_k', 10);
    const completed = end('OK');

    expect(completed.endTime).toBeDefined();
    expect(completed.durationMs).toBeGreaterThanOrEqual(0);
    expect(completed.attributes['search.top_k']).toBe(10);
  });

  it('should compute p50, p90, p95, and p99 latency percentiles and error rates', () => {
    // Record simulated spans with diverse latencies
    const latencies = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    latencies.forEach((lat, i) => {
      const { end } = service.startSpan(`test.op.${i}`);
      const span = end(i === 9 ? 'ERROR' : 'OK');
      // Inject synthetic duration for deterministic percentile testing
      span.durationMs = lat;
      (service as any).latencySamples.push(lat);
    });

    const metrics = service.getMetrics();
    expect(metrics.totalRequests).toBeGreaterThanOrEqual(10);
    expect(metrics.totalErrors).toBeGreaterThanOrEqual(1);
    expect(metrics.errorRatePercent).toBeGreaterThan(0);
    expect(metrics.p50LatencyMs).toBeGreaterThanOrEqual(10);
    expect(metrics.p95LatencyMs).toBeGreaterThanOrEqual(50);
  });

  it('should export OpenTelemetry OTLP JSON formatted traces', () => {
    const { end } = service.startSpan('gemini.embed.text');
    end('OK');

    const otlp = service.getOtlpPayload();
    expect(otlp.resourceSpans).toBeDefined();
    expect(otlp.resourceSpans[0].resource.attributes[0].value.stringValue).toBe('cambium-research-platform');
    expect(otlp.resourceSpans[0].scopeSpans[0].spans.length).toBeGreaterThan(0);
  });
});
