import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { AiTelemetryEvent, AiOutcome } from './entities/ai-telemetry-event.entity';
import { ProductAnalyticsService } from './product-analytics.service';
import { StructuredLoggerService } from '../../common/logging/structured-logger.service';

export interface RecordAiTelemetryInput {
  requestId?: string;
  actorId?: string | null;
  provider: string;
  model: string;
  requestType: 'chat' | 'embedding' | 'rerank' | 'eval';
  inputChars: number;
  outputChars: number;
  latencyMs: number;
  retrievalDurationMs?: number;
  chunksRetrieved?: number;
  citationCount?: number;
  toolSuccessCount?: number;
  toolFailureCount?: number;
  outcome: AiOutcome;
  failureCategory?: string | null;
  aiPrivacyMode?: string;
  isLiveProviderCall?: boolean;
}

/**
 * Reference public token pricing (USD per 1M tokens) used strictly for cost estimation.
 * Offline/deterministic fallbacks are always billed at $0.00.
 */
const MODEL_COST_PER_MILLION_USD: Record<string, { input: number; output: number }> = {
  'gemini-2.0-flash': { input: 0.1, output: 0.4 },
  'gemini-1.5-flash': { input: 0.075, output: 0.3 },
  'gemini-embedding-001': { input: 0.0, output: 0.0 },
};

@Injectable()
export class AiObservabilityService {
  constructor(
    @Optional()
    @InjectRepository(AiTelemetryEvent)
    private readonly aiRepo?: Repository<AiTelemetryEvent>,
    @Optional()
    private readonly productAnalytics?: ProductAnalyticsService,
    @Optional()
    private readonly structuredLogger?: StructuredLoggerService,
  ) {}

  estimateTokens(chars: number): number {
    if (!chars || chars <= 0) return 0;
    return Math.ceil(chars / 4);
  }

  estimateCostUsd(
    model: string,
    inputTokens: number,
    outputTokens: number,
    isLiveProviderCall = true,
  ): number {
    if (!isLiveProviderCall) return 0;
    const rate = MODEL_COST_PER_MILLION_USD[model] || { input: 0.1, output: 0.4 };
    const usd =
      (inputTokens / 1_000_000) * rate.input +
      (outputTokens / 1_000_000) * rate.output;
    return Number(usd.toFixed(6));
  }

  async recordAiInteraction(input: RecordAiTelemetryInput): Promise<AiTelemetryEvent | null> {
    const requestId = input.requestId || randomUUID();
    const inputTokensEst = this.estimateTokens(input.inputChars);
    const outputTokensEst = this.estimateTokens(input.outputChars);
    const estimatedCostUsd = this.estimateCostUsd(
      input.model,
      inputTokensEst,
      outputTokensEst,
      input.isLiveProviderCall ?? !input.model.includes('fallback'),
    );

    this.structuredLogger?.emit({
      severity: input.outcome === 'FAILURE' ? 'ERROR' : input.outcome === 'FALLBACK' ? 'WARN' : 'INFO',
      operation: `ai.${input.requestType}`,
      requestId,
      actorId: input.actorId || undefined,
      durationMs: input.latencyMs,
      errorCategory: input.failureCategory || undefined,
      context: {
        provider: input.provider,
        model: input.model,
        outcome: input.outcome,
        inputTokensEst,
        outputTokensEst,
        estimatedCostUsd,
        chunksRetrieved: input.chunksRetrieved ?? 0,
        citationCount: input.citationCount ?? 0,
      },
    });

    if (input.requestType === 'chat' && this.productAnalytics) {
      void this.productAnalytics.recordBackendEvent({
        eventName:
          input.outcome === 'FAILURE' ? 'ai.assistant.failed' : 'ai.assistant.responded',
        actorId: input.actorId || null,
        outcome: input.outcome === 'FAILURE' ? 'FAILURE' : 'SUCCESS',
        properties: {
          model: input.model,
          outcome: input.outcome,
          latencyMs: input.latencyMs,
          citationCount: input.citationCount ?? 0,
        },
      });
    }

    if (!this.aiRepo) return null;

    try {
      const entity = this.aiRepo.create({
        requestId,
        actorId: input.actorId || null,
        provider: input.provider,
        model: input.model,
        requestType: input.requestType,
        inputTokensEst,
        outputTokensEst,
        estimatedCostUsd,
        latencyMs: Math.round(input.latencyMs),
        retrievalDurationMs: Math.round(input.retrievalDurationMs || 0),
        chunksRetrieved: input.chunksRetrieved || 0,
        citationCount: input.citationCount || 0,
        toolSuccessCount: input.toolSuccessCount || 0,
        toolFailureCount: input.toolFailureCount || 0,
        outcome: input.outcome,
        failureCategory: input.failureCategory || null,
        aiPrivacyMode: input.aiPrivacyMode || 'local_only',
      });
      return await this.aiRepo.save(entity);
    } catch {
      return null;
    }
  }

  summarizeEvents(events: AiTelemetryEvent[], windowHours = 24) {
    const cutoff = Date.now() - windowHours * 3_600_000;
    const recent = events.filter((e) => new Date(e.recordedAt).getTime() >= cutoff);
    const totalCalls = recent.length;
    const successCount = recent.filter((e) => e.outcome === 'SUCCESS').length;
    const fallbackCount = recent.filter((e) => e.outcome === 'FALLBACK').length;
    const failureCount = recent.filter((e) => e.outcome === 'FAILURE').length;

    const latencies = recent.map((e) => e.latencyMs).sort((a, b) => a - b);
    const p95LatencyMs =
      latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.95)] || latencies[latencies.length - 1] : 0;
    const avgLatencyMs =
      latencies.length > 0
        ? Math.round(latencies.reduce((s, v) => s + v, 0) / latencies.length)
        : 0;

    const totalCostUsd = Number(
      recent.reduce((sum, e) => sum + Number(e.estimatedCostUsd || 0), 0).toFixed(6),
    );
    const totalInputTokens = recent.reduce((sum, e) => sum + (e.inputTokensEst || 0), 0);
    const totalOutputTokens = recent.reduce((sum, e) => sum + (e.outputTokensEst || 0), 0);
    const chatEvents = recent.filter((e) => e.requestType === 'chat');
    const avgCitationsPerChat =
      chatEvents.length > 0
        ? Number(
            (
              chatEvents.reduce((s, e) => s + (e.citationCount || 0), 0) / chatEvents.length
            ).toFixed(2),
          )
        : 0;

    const successfulWorkflows = recent.filter(
      (e) => e.outcome === 'SUCCESS' && e.requestType === 'chat',
    ).length;

    return {
      windowHours,
      totalCalls,
      outcomes: {
        successCount,
        fallbackCount,
        failureCount,
        fallbackRatePct:
          totalCalls > 0 ? Number(((fallbackCount / totalCalls) * 100).toFixed(1)) : 0,
        failureRatePct:
          totalCalls > 0 ? Number(((failureCount / totalCalls) * 100).toFixed(1)) : 0,
      },
      latency: { avgLatencyMs, p95LatencyMs },
      retrievalQuality: {
        avgChunksRetrieved:
          chatEvents.length > 0
            ? Number(
                (
                  chatEvents.reduce((s, e) => s + (e.chunksRetrieved || 0), 0) /
                  chatEvents.length
                ).toFixed(2),
              )
            : 0,
        avgCitationsPerChat,
        toolSuccessTotal: recent.reduce((s, e) => s + (e.toolSuccessCount || 0), 0),
        toolFailureTotal: recent.reduce((s, e) => s + (e.toolFailureCount || 0), 0),
      },
      tokensAndCost: {
        totalInputTokens,
        totalOutputTokens,
        totalEstimatedCostUsd: totalCostUsd,
        costPerSuccessfulWorkflowUsd:
          successfulWorkflows > 0
            ? Number((totalCostUsd / successfulWorkflows).toFixed(6))
            : 0,
        pricingNote: 'Estimated from character/4 token heuristic and reference Gemini Flash rates; deterministic offline fallbacks cost $0.00.',
      },
    };
  }

  async getSummary(windowHours = 24) {
    if (!this.aiRepo) return this.summarizeEvents([], windowHours);
    const events = await this.aiRepo.find({
      order: { recordedAt: 'DESC' },
      take: 2000,
    });
    return this.summarizeEvents(events, windowHours);
  }
}
