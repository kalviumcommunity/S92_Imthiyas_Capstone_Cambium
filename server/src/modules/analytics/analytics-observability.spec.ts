import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { ProductAnalyticsService } from './product-analytics.service';
import { AiObservabilityService } from './ai-observability.service';
import { AlertEvaluatorService } from './alert-evaluator.service';
import { AnalyticsController } from './analytics.controller';
import { StructuredLoggerService } from '../../common/logging/structured-logger.service';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { AiTelemetryEvent } from './entities/ai-telemetry-event.entity';
import { runDeterministicRagEvaluation } from './ai-eval-dataset';
import { UserRole } from '../users/entities/user.entity';

function createInMemoryEventRepo(store: AnalyticsEvent[] = []) {
  return {
    create: vi.fn((data: any) => ({
      id: `evt-${store.length + 1}`,
      ingestedAt: new Date(),
      ...data,
    })),
    findOne: vi.fn(async ({ where }: any) => {
      if (where?.idempotencyKey) {
        return store.find((e) => e.idempotencyKey === where.idempotencyKey) || null;
      }
      return null;
    }),
    find: vi.fn(async ({ where }: any = {}) => {
      if (where?.organizationId) {
        return store.filter((e) => e.organizationId === where.organizationId);
      }
      return [...store];
    }),
    save: vi.fn(async (entity: AnalyticsEvent) => {
      if (
        entity.idempotencyKey &&
        store.some((e) => e.idempotencyKey === entity.idempotencyKey)
      ) {
        const err: any = new Error('duplicate key');
        err.code = '23505';
        throw err;
      }
      store.push(entity);
      return entity;
    }),
  } as any;
}

describe('Analytics & Observability Engineering Suite', () => {
  let logger: StructuredLoggerService;
  let store: AnalyticsEvent[];
  let analytics: ProductAnalyticsService;

  beforeEach(() => {
    logger = new StructuredLoggerService();
    store = [];
    analytics = new ProductAnalyticsService(createInMemoryEventRepo(store), logger);
  });

  it('1. Rejects invalid canonical event names and backend event spoofing from client intake', async () => {
    await expect(
      analytics.recordClientInteractionEvent(
        { id: 'user-1', email: 'scholar@uni.edu' },
        { eventName: 'Bad Event Name!' },
        true,
      ),
    ).rejects.toThrow(BadRequestException);

    await expect(
      analytics.recordClientInteractionEvent(
        { id: 'user-1', email: 'scholar@uni.edu' },
        { eventName: 'user.signup.completed' },
        true,
      ),
    ).rejects.toThrow(ForbiddenException);

    const denied = await analytics.recordClientInteractionEvent(
      { id: 'user-1', email: 'scholar@uni.edu' },
      { eventName: 'ui.filter.applied' },
      false,
    );
    expect(denied.accepted).toBe(false);
    expect(denied.reason).toBe('optional_analytics_consent_not_granted');
  });

  it('2. Deduplicates duplicate events via idempotencyKey and strips sensitive keys', async () => {
    const first = await analytics.recordBackendEvent({
      eventName: 'opportunity.saved',
      actorId: 'u-1',
      actorEmail: 'elena@oxford.ac.uk',
      idempotencyKey: 'opp_saved:u-1:opp-9',
      properties: {
        opportunityId: 'opp-9',
        rawPrompt: 'SECRET MANUSCRIPT TEXT',
        passwordHash: 'should-never-store',
      },
    });
    const duplicate = await analytics.recordBackendEvent({
      eventName: 'opportunity.saved',
      actorId: 'u-1',
      actorEmail: 'elena@oxford.ac.uk',
      idempotencyKey: 'opp_saved:u-1:opp-9',
    });

    expect(store).toHaveLength(1);
    expect(first?.id).toBe(duplicate?.id);
    expect(store[0].properties.rawPrompt).toBeUndefined();
    expect(store[0].properties.passwordHash).toBeUndefined();
    expect(store[0].properties.opportunityId).toBe('opp-9');
  });

  it('3. Excludes TEST and SYSTEM actors from product metrics, activation, and cohorts', async () => {
    const now = new Date('2026-11-27T12:00:00Z');
    await analytics.recordBackendEvent({
      eventName: 'user.signup.completed',
      actorId: 'e2e-bot',
      actorEmail: 'e2e-runner@cambium.test',
      occurredAt: new Date(now.getTime() - 3600_000),
    });
    await analytics.recordBackendEvent({
      eventName: 'opportunity.search.completed',
      actorId: null,
      occurredAt: new Date(now.getTime() - 1800_000),
    });

    const summary = analytics.computeProductMetricsFromEvents(store, now, 30);
    expect(summary.activitySummary.dau).toBe(0);
    expect(summary.activitySummary.mau).toBe(0);
    expect(summary.metadata.excludedEventCount).toBe(2);
    expect(summary.activation.eligibleSignups).toBe(0);
  });

  it('4. Synthetic multi-actor simulation accurately measures distinct-user funnel, 14d activation & D1/D7 cohorts', async () => {
    const now = new Date('2026-11-27T12:00:00Z');
    const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000);

    // Researcher A: signed up 10d ago, searched, saved, created workspace (Activated!), returned D1 & D7
    await analytics.recordBackendEvent({ eventName: 'user.signup.completed', actorId: 'act-a', actorEmail: 'a@mit.edu', organizationId: 'org-1', occurredAt: daysAgo(10) });
    await analytics.recordBackendEvent({ eventName: 'opportunity.search.completed', actorId: 'act-a', actorEmail: 'a@mit.edu', organizationId: 'org-1', occurredAt: daysAgo(9) }); // D1
    await analytics.recordBackendEvent({ eventName: 'opportunity.saved', actorId: 'act-a', actorEmail: 'a@mit.edu', organizationId: 'org-1', occurredAt: daysAgo(9) });
    await analytics.recordBackendEvent({ eventName: 'workspace.created', actorId: 'act-a', actorEmail: 'a@mit.edu', organizationId: 'org-1', occurredAt: daysAgo(3) }); // D7
    await analytics.recordBackendEvent({ eventName: 'workspace.created', actorId: 'act-a', actorEmail: 'a@mit.edu', organizationId: 'org-1', occurredAt: daysAgo(2) }); // repeat action same user must count distinct = 1!

    // Researcher B: signed up 10d ago, searched only -> not activated
    await analytics.recordBackendEvent({ eventName: 'user.signup.completed', actorId: 'act-b', actorEmail: 'b@mit.edu', organizationId: 'org-1', occurredAt: daysAgo(10) });
    await analytics.recordBackendEvent({ eventName: 'opportunity.search.completed', actorId: 'act-b', actorEmail: 'b@mit.edu', organizationId: 'org-1', occurredAt: daysAgo(10) });

    // Collaborator C: signed up 2d ago, saved & accepted invite -> Activated!
    await analytics.recordBackendEvent({ eventName: 'user.signup.completed', actorId: 'act-c', actorEmail: 'c@mit.edu', organizationId: 'org-1', occurredAt: daysAgo(2) });
    await analytics.recordBackendEvent({ eventName: 'opportunity.saved', actorId: 'act-c', actorEmail: 'c@mit.edu', organizationId: 'org-1', occurredAt: daysAgo(1) });
    await analytics.recordBackendEvent({ eventName: 'collaboration.invitation.accepted', actorId: 'act-c', actorEmail: 'c@mit.edu', organizationId: 'org-1', occurredAt: daysAgo(0.2) });

    const metrics = analytics.computeProductMetricsFromEvents(store, now, 30);
    expect(metrics.activation.eligibleSignups).toBe(3);
    expect(metrics.activation.activatedUsers).toBe(2);
    expect(metrics.activation.activationRatePct).toBeCloseTo(66.7, 1);

    const workspaceStage = metrics.funnel.find((f) => f.eventName === 'workspace.created');
    expect(workspaceStage?.distinctUsers).toBe(1); // deduplicated per distinct human actor
    expect(metrics.activitySummary.dau).toBe(1); // act-c active 0.2d ago
    expect(metrics.activitySummary.mau).toBe(3);
  });

  it('5. Enforces k >= 3 institutional anonymity suppression and caller organizationId scoping', async () => {
    const now = new Date('2026-11-27T12:00:00Z');
    await analytics.recordBackendEvent({ eventName: 'workspace.created', actorId: 'u-small-1', actorEmail: 'u1@small.edu', organizationId: 'org-small', occurredAt: now });
    await analytics.recordBackendEvent({ eventName: 'workspace.created', actorId: 'u-small-2', actorEmail: 'u2@small.edu', organizationId: 'org-small', occurredAt: now });

    const smallOrg = analytics.computeInstitutionalUsage(store, 'org-small', now, 30);
    expect(smallOrg.privacySuppressed).toBe(true);
    expect(smallOrg.summary).toBeNull();

    // Add 3 members to org-large
    for (const id of ['l1', 'l2', 'l3']) {
      await analytics.recordBackendEvent({ eventName: 'workspace.created', actorId: id, actorEmail: `${id}@large.edu`, organizationId: 'org-large', occurredAt: now });
    }
    const largeOrg = analytics.computeInstitutionalUsage(store, 'org-large', now, 30);
    expect(largeOrg.privacySuppressed).toBe(false);
    expect(largeOrg.summary?.workspacesCreated).toBe(3);

    // Controller must block unaffiliated non-admin institutional call
    const controller = new AnalyticsController(
      analytics,
      new AiObservabilityService(),
      new AlertEvaluatorService(),
    );
    await expect(
      controller.getInstitutionalDashboard({
        id: 'u1',
        email: 'u1@none.edu',
        role: UserRole.RD_DIRECTOR,
        organizationId: null,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('6. StructuredLogger scrubs DSNs, JWTs, API keys, emails, and pseudonymizes actorId', () => {
    const entry = logger.emit({
      severity: 'ERROR',
      operation: 'db.query.failed',
      actorId: 'raw-user-uuid-999',
      message: 'Failed postgresql://admin:secret@db:5432/cambium for alice@stanford.edu with Bearer eyJhbGci.123.xyz and key AIzaSyD12345678901234567890',
      context: { rawPrompt: 'Confidential grant draft text', requestId: 'req-123' },
    });

    const serialized = JSON.stringify(entry);
    expect(serialized).not.toContain('raw-user-uuid-999');
    expect(serialized).not.toContain('admin:secret');
    expect(serialized).not.toContain('alice@stanford.edu');
    expect(serialized).not.toContain('eyJhbGci.123.xyz');
    expect(serialized).not.toContain('AIzaSyD12345678901234567890');
    expect(serialized).not.toContain('Confidential grant draft text');
    expect(entry.safeActorHash).toHaveLength(16);
  });

  it('7. Telemetry write failure never blocks or throws to primary workflows', async () => {
    const failingRepo = {
      findOne: vi.fn().mockRejectedValue(new Error('PG timeout')),
      create: vi.fn((x: any) => x),
      save: vi.fn().mockRejectedValue(new Error('ECONNREFUSED')),
    } as any;
    const resilientAnalytics = new ProductAnalyticsService(failingRepo, logger);

    const res = await resilientAnalytics.recordBackendEvent({
      eventName: 'workspace.created',
      actorId: 'u-1',
    });
    expect(res).toBeNull();
  });

  it('8. AlertEvaluatorService fires expected rules & runbook IDs when SLO thresholds breach', () => {
    const evaluator = new AlertEvaluatorService();
    const alerts = evaluator.evaluate({
      totalRequests: 100,
      errorRatePercent: 12.5,
      p95LatencyMs: 2400,
      activeConnections: 45,
      maxConnections: 50,
      activeLocks: 6,
      oldestPendingJobAgeSeconds: 2000,
      deadJobsCount: 5,
      openCircuitBreakers: ['orcid_api'],
      aiCallsCount: 10,
      aiFailureOrFallbackRatePct: 40,
    });

    const ids = alerts.map((a) => a.id);
    expect(ids).toContain('ERROR_RATE_HIGH');
    expect(ids).toContain('LATENCY_P95_ELEVATED');
    expect(ids).toContain('DB_SATURATION_OR_LOCKS');
    expect(ids).toContain('QUEUE_BACKLOG_STALE');
    expect(ids).toContain('CIRCUIT_BREAKER_OPEN');
    expect(ids).toContain('AI_FAILURE_SPIKE');
  });

  it('9. AiObservabilityService computes token/USD cost & offline deterministic RAG benchmark passes', async () => {
    const aiEvents: AiTelemetryEvent[] = [];
    const aiRepo = {
      create: vi.fn((d: any) => ({ id: `ai-${aiEvents.length + 1}`, recordedAt: new Date(), ...d })),
      save: vi.fn(async (e: AiTelemetryEvent) => {
        aiEvents.push(e);
        return e;
      }),
      find: vi.fn(async () => aiEvents),
    } as any;

    const aiObs = new AiObservabilityService(aiRepo, analytics, logger);
    await aiObs.recordAiInteraction({
      provider: 'gemini',
      model: 'gemini-2.0-flash',
      requestType: 'chat',
      inputChars: 4000,
      outputChars: 800,
      latencyMs: 620,
      retrievalDurationMs: 45,
      chunksRetrieved: 3,
      citationCount: 2,
      outcome: 'SUCCESS',
      isLiveProviderCall: true,
    });
    await aiObs.recordAiInteraction({
      provider: 'local-fallback',
      model: 'gemini-offline-fallback',
      requestType: 'chat',
      inputChars: 1200,
      outputChars: 400,
      latencyMs: 30,
      outcome: 'FALLBACK',
      isLiveProviderCall: false,
    });

    const summary = await aiObs.getSummary(24);
    expect(summary.totalCalls).toBe(2);
    expect(summary.outcomes.fallbackRatePct).toBe(50);
    expect(summary.tokensAndCost.totalEstimatedCostUsd).toBeGreaterThan(0);

    const ragEval = runDeterministicRagEvaluation();
    expect(ragEval.recallAt3Pct).toBe(100);
    expect(ragEval.abstentionAccuracyPct).toBe(100);
    expect(ragEval.citationCompletenessPct).toBe(100);
  });
});
