import { Injectable } from '@nestjs/common';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface ActiveAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  summary: string;
  metricValue: number | string;
  threshold: number | string;
  runbookId: string;
}

export interface AlertEvaluationInput {
  totalRequests: number;
  errorRatePercent: number;
  p95LatencyMs: number;
  activeConnections: number;
  maxConnections: number;
  activeLocks?: number;
  slowQueriesCount?: number;
  oldestPendingJobAgeSeconds?: number;
  deadJobsCount?: number;
  openCircuitBreakers?: string[];
  aiCallsCount?: number;
  aiFailureOrFallbackRatePct?: number;
}

@Injectable()
export class AlertEvaluatorService {
  evaluate(input: AlertEvaluationInput): ActiveAlert[] {
    const alerts: ActiveAlert[] = [];

    if (input.totalRequests >= 20 && input.errorRatePercent > 10) {
      alerts.push({
        id: 'ERROR_RATE_HIGH',
        severity: 'CRITICAL',
        title: 'API HTTP 5xx Error Rate Critical',
        summary: 'Backend error rate exceeded 10% over active request window.',
        metricValue: `${input.errorRatePercent}%`,
        threshold: '> 10%',
        runbookId: 'RB-OBS-01',
      });
    } else if (input.totalRequests >= 10 && input.errorRatePercent > 3) {
      alerts.push({
        id: 'ERROR_RATE_HIGH',
        severity: 'WARNING',
        title: 'API HTTP Error Rate Elevated',
        summary: 'Backend error rate exceeded 3% warning threshold.',
        metricValue: `${input.errorRatePercent}%`,
        threshold: '> 3%',
        runbookId: 'RB-OBS-01',
      });
    }

    if (input.p95LatencyMs > 2000) {
      alerts.push({
        id: 'LATENCY_P95_ELEVATED',
        severity: 'CRITICAL',
        title: 'API p95 Latency Above 2s Budget',
        summary: 'Tail API latency crossed critical 2000ms SLO threshold.',
        metricValue: `${input.p95LatencyMs}ms`,
        threshold: '> 2000ms',
        runbookId: 'RB-OBS-02',
      });
    } else if (input.p95LatencyMs > 750) {
      alerts.push({
        id: 'LATENCY_P95_ELEVATED',
        severity: 'WARNING',
        title: 'API p95 Latency Above 750ms Target',
        summary: 'Tail API latency exceeded 750ms warning threshold.',
        metricValue: `${input.p95LatencyMs}ms`,
        threshold: '> 750ms',
        runbookId: 'RB-OBS-02',
      });
    }

    const poolRatio =
      input.maxConnections > 0 ? input.activeConnections / input.maxConnections : 0;
    if (poolRatio >= 0.85 || (input.activeLocks || 0) >= 5) {
      alerts.push({
        id: 'DB_SATURATION_OR_LOCKS',
        severity: 'CRITICAL',
        title: 'PostgreSQL Pool Saturation or Lock Contention',
        summary: 'Database connection pool utilization >= 85% or blocking locks >= 5.',
        metricValue: `pool=${Math.round(poolRatio * 100)}%, locks=${input.activeLocks || 0}`,
        threshold: 'pool >= 85% or locks >= 5',
        runbookId: 'RB-OBS-03',
      });
    } else if ((input.slowQueriesCount || 0) >= 3) {
      alerts.push({
        id: 'DB_SATURATION_OR_LOCKS',
        severity: 'WARNING',
        title: 'Slow PostgreSQL Queries Detected',
        summary: 'Multiple active queries exceeded 1000ms runtime.',
        metricValue: input.slowQueriesCount || 0,
        threshold: '>= 3 queries > 1000ms',
        runbookId: 'RB-OBS-03',
      });
    }

    const jobAge = input.oldestPendingJobAgeSeconds || 0;
    const dead = input.deadJobsCount || 0;
    if (jobAge > 1800 || dead >= 5) {
      alerts.push({
        id: 'QUEUE_BACKLOG_STALE',
        severity: 'CRITICAL',
        title: 'Background Job Queue Stalled or Dead-Letter Spike',
        summary: 'Oldest queued job age > 30m or dead-letter queue >= 5.',
        metricValue: `age=${jobAge}s, dead=${dead}`,
        threshold: 'age > 1800s or dead >= 5',
        runbookId: 'RB-OBS-04',
      });
    } else if (jobAge > 300 || dead >= 1) {
      alerts.push({
        id: 'QUEUE_BACKLOG_STALE',
        severity: 'WARNING',
        title: 'Background Queue Backlog Growing',
        summary: 'Pending background jobs delayed > 5m or dead-letter jobs present.',
        metricValue: `age=${jobAge}s, dead=${dead}`,
        threshold: 'age > 300s or dead >= 1',
        runbookId: 'RB-OBS-04',
      });
    }

    if (input.openCircuitBreakers && input.openCircuitBreakers.length > 0) {
      alerts.push({
        id: 'CIRCUIT_BREAKER_OPEN',
        severity: 'WARNING',
        title: 'External Provider Circuit Breaker OPEN',
        summary: `Degraded upstream services operating in fallback mode: ${input.openCircuitBreakers.join(', ')}`,
        metricValue: input.openCircuitBreakers.length,
        threshold: '0 OPEN breakers',
        runbookId: 'RB-OBS-05',
      });
    }

    if ((input.aiCallsCount || 0) >= 5 && (input.aiFailureOrFallbackRatePct || 0) > 25) {
      alerts.push({
        id: 'AI_FAILURE_SPIKE',
        severity: 'WARNING',
        title: 'AI Workflow Fallback / Failure Rate Spike',
        summary: 'Gemini provider calls degraded into fallback/error above 25%.',
        metricValue: `${input.aiFailureOrFallbackRatePct}%`,
        threshold: '> 25%',
        runbookId: 'RB-OBS-06',
      });
    }

    return alerts;
  }
}
