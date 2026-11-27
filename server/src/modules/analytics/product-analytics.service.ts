import { Injectable, Optional, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AnalyticsEvent,
  AnalyticsActorKind,
  AnalyticsOutcome,
} from './entities/analytics-event.entity';
import { CANONICAL_EVENT_NAME_REGEX, RecordClientEventDto } from './dto/analytics.dto';
import { StructuredLoggerService } from '../../common/logging/structured-logger.service';

export interface BackendEventInput {
  eventName: string;
  actorId?: string | null;
  actorEmail?: string | null;
  actorKind?: AnalyticsActorKind;
  organizationId?: string | null;
  workspaceId?: string | null;
  idempotencyKey?: string | null;
  outcome?: AnalyticsOutcome;
  schemaVersion?: string;
  occurredAt?: Date;
  properties?: Record<string, unknown>;
}

export const BACKEND_AUTHORITATIVE_EVENTS = new Set<string>([
  'user.signup.completed',
  'user.login.completed',
  'user.login.failed',
  'opportunity.search.completed',
  'opportunity.saved',
  'opportunity.removed',
  'workspace.created',
  'workspace.member.invited',
  'collaboration.invitation.accepted',
  'collaboration.invitation.declined',
  'document.upload.completed',
  'document.upload.failed',
  'document.ocr.completed',
  'ai.assistant.requested',
  'ai.assistant.responded',
  'ai.assistant.failed',
]);

const BANNED_PROPERTY_KEYS =
  /^(password|passwordhash|token|refreshtoken|accesstoken|secret|apikey|content|documenttext|extractedtext|abstract|rawprompt|querytext|messages|email|phone|ssn)$/i;

@Injectable()
export class ProductAnalyticsService {
  constructor(
    @Optional()
    @InjectRepository(AnalyticsEvent)
    private readonly eventRepo?: Repository<AnalyticsEvent>,
    @Optional()
    private readonly structuredLogger?: StructuredLoggerService,
  ) {}

  classifyActor(actorId?: string | null, actorEmail?: string | null): AnalyticsActorKind {
    const email = (actorEmail || '').toLowerCase();
    if (
      email.endsWith('@cambium.test') ||
      email.endsWith('@example.com') ||
      email.startsWith('e2e-') ||
      email.startsWith('qa-') ||
      process.env.CAMBIUM_TEST_ACTOR === 'true'
    ) {
      return 'TEST';
    }
    if (!actorId) return 'SYSTEM';
    return 'HUMAN';
  }

  sanitizeProperties(raw?: Record<string, unknown>): Record<string, unknown> {
    if (!raw || typeof raw !== 'object') return {};
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (BANNED_PROPERTY_KEYS.test(key)) continue;
      if (typeof value === 'string') {
        sanitized[key] = this.structuredLogger
          ? this.structuredLogger.scrubString(value).slice(0, 120)
          : value.slice(0, 120);
      } else if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  /**
   * Non-blocking authoritative backend domain event recorder with idempotency deduplication.
   * Never throws into caller business paths.
   */
  async recordBackendEvent(input: BackendEventInput): Promise<AnalyticsEvent | null> {
    if (!CANONICAL_EVENT_NAME_REGEX.test(input.eventName)) {
      this.structuredLogger?.emit({
        severity: 'WARN',
        operation: 'analytics.invalid_event_name',
        message: `Rejected invalid event name format: ${input.eventName}`,
      });
      return null;
    }

    if (!this.eventRepo) return null;

    try {
      if (input.idempotencyKey) {
        const existing = await this.eventRepo.findOne({
          where: { idempotencyKey: input.idempotencyKey },
        });
        if (existing) return existing;
      }

      const actorKind =
        input.actorKind || this.classifyActor(input.actorId, input.actorEmail);

      const entity = this.eventRepo.create({
        eventName: input.eventName,
        schemaVersion: input.schemaVersion || '1.0.0',
        idempotencyKey: input.idempotencyKey || null,
        actorId: input.actorId || null,
        actorKind,
        organizationId: input.organizationId || null,
        workspaceId: input.workspaceId || null,
        source: 'backend',
        outcome: input.outcome || 'SUCCESS',
        properties: this.sanitizeProperties(input.properties),
        occurredAt: input.occurredAt || new Date(),
      });

      return await this.eventRepo.save(entity);
    } catch (err: any) {
      // PostgreSQL unique_violation 23505 means duplicate idempotencyKey racing cleanly -> ignore
      if (err?.code === '23505' && input.idempotencyKey) {
        return await this.eventRepo
          .findOne({ where: { idempotencyKey: input.idempotencyKey } })
          .catch(() => null);
      }
      this.structuredLogger?.emit({
        severity: 'WARN',
        operation: 'analytics.record_failed',
        errorCategory: err?.name || 'TelemetryError',
        message: err?.message || 'Failed writing analytics event',
      });
      return null;
    }
  }

  /**
   * Client interaction intake: enforces canonical naming and blocks spoofing of backend-only domain events.
   */
  async recordClientInteractionEvent(
    actor: { id: string; email?: string | null; organizationId?: string | null },
    dto: RecordClientEventDto,
    consentGranted: boolean,
  ): Promise<{ accepted: boolean; reason?: string; id?: string }> {
    if (!consentGranted) {
      return { accepted: false, reason: 'optional_analytics_consent_not_granted' };
    }
    if (!CANONICAL_EVENT_NAME_REGEX.test(dto.eventName)) {
      throw new BadRequestException('Invalid canonical event name');
    }
    if (BACKEND_AUTHORITATIVE_EVENTS.has(dto.eventName)) {
      throw new ForbiddenException(
        `Event "${dto.eventName}" is backend-authoritative and cannot be emitted by client`,
      );
    }
    if (!this.eventRepo) {
      return { accepted: false, reason: 'analytics_store_unavailable' };
    }

    try {
      if (dto.idempotencyKey) {
        const existing = await this.eventRepo.findOne({
          where: { idempotencyKey: dto.idempotencyKey },
        });
        if (existing) return { accepted: true, id: existing.id };
      }

      const entity = this.eventRepo.create({
        eventName: dto.eventName,
        schemaVersion: dto.schemaVersion || '1.0.0',
        idempotencyKey: dto.idempotencyKey || null,
        actorId: actor.id,
        actorKind: this.classifyActor(actor.id, actor.email),
        organizationId: actor.organizationId || null,
        workspaceId: dto.workspaceId || null,
        source: 'client',
        outcome: dto.outcome || 'SUCCESS',
        properties: this.sanitizeProperties(dto.properties),
        occurredAt: new Date(),
      });
      const saved = await this.eventRepo.save(entity);
      return { accepted: true, id: saved.id };
    } catch (err: any) {
      if (err?.code === '23505') return { accepted: true };
      return { accepted: false, reason: 'persistence_error' };
    }
  }

  /**
   * Computes honest distinct-user funnels, activation, active users (DAU/WAU/MAU),
   * and cohort retention strictly excluding actorKind IN ('TEST', 'SYSTEM').
   */
  computeProductMetricsFromEvents(events: AnalyticsEvent[], now = new Date(), windowDays = 30) {
    const cutoff = new Date(now.getTime() - windowDays * 86_400_000);
    const humanEvents = events.filter(
      (e) => e.actorKind === 'HUMAN' && !!e.actorId && new Date(e.occurredAt) >= cutoff,
    );
    const excludedCount = events.filter((e) => e.actorKind !== 'HUMAN').length;

    const distinctActorsFor = (eventName: string, outcome?: AnalyticsOutcome) => {
      const set = new Set<string>();
      for (const e of humanEvents) {
        if (
          e.eventName === eventName &&
          e.actorId &&
          (!outcome || e.outcome === outcome)
        ) {
          set.add(e.actorId);
        }
      }
      return set;
    };

    const dayAgo = new Date(now.getTime() - 86_400_000);
    const weekAgo = new Date(now.getTime() - 7 * 86_400_000);

    const dauSet = new Set<string>();
    const wauSet = new Set<string>();
    const mauSet = new Set<string>();
    const orgSet = new Set<string>();
    const institutionalActorSet = new Set<string>();

    for (const e of humanEvents) {
      if (!e.actorId) continue;
      const ts = new Date(e.occurredAt);
      mauSet.add(e.actorId);
      if (ts >= weekAgo) wauSet.add(e.actorId);
      if (ts >= dayAgo) dauSet.add(e.actorId);
      if (e.organizationId) {
        orgSet.add(e.organizationId);
        institutionalActorSet.add(e.actorId);
      }
    }

    // Signup timestamps and milestone events across all time for cohort retention & activation
    const allHuman = events.filter((e) => e.actorKind === 'HUMAN' && !!e.actorId);
    const signupTimeByUser = new Map<string, Date>();
    const eventsByUser = new Map<string, AnalyticsEvent[]>();

    for (const e of allHuman) {
      if (!e.actorId) continue;
      const list = eventsByUser.get(e.actorId) || [];
      list.push(e);
      eventsByUser.set(e.actorId, list);
      if (e.eventName === 'user.signup.completed' && e.outcome === 'SUCCESS') {
        const ts = new Date(e.occurredAt);
        const prev = signupTimeByUser.get(e.actorId);
        if (!prev || ts < prev) signupTimeByUser.set(e.actorId, ts);
      }
    }

    // Activation definition: user signed up, then within 14 days saved >=1 opportunity
    // AND completed at least one deep step (workspace.created, document.upload.completed, or collaboration.invitation.accepted)
    let eligibleSignups = 0;
    let activatedUsers = 0;
    const cohortMap = new Map<
      string,
      { signedUp: number; d1: number; d7: number; d30: number }
    >();

    for (const [actorId, signupTs] of signupTimeByUser.entries()) {
      const cohortWeek = signupTs.toISOString().slice(0, 10);
      const cohort = cohortMap.get(cohortWeek) || { signedUp: 0, d1: 0, d7: 0, d30: 0 };
      cohort.signedUp += 1;

      const userEvents = eventsByUser.get(actorId) || [];
      const windowEnd14d = signupTs.getTime() + 14 * 86_400_000;

      if (signupTs >= cutoff) {
        eligibleSignups += 1;
        const savedOpp = userEvents.some(
          (e) =>
            e.eventName === 'opportunity.saved' &&
            e.outcome === 'SUCCESS' &&
            new Date(e.occurredAt).getTime() <= windowEnd14d,
        );
        const deepStep = userEvents.some(
          (e) =>
            (e.eventName === 'workspace.created' ||
              e.eventName === 'document.upload.completed' ||
              e.eventName === 'collaboration.invitation.accepted') &&
            e.outcome === 'SUCCESS' &&
            new Date(e.occurredAt).getTime() <= windowEnd14d,
        );
        if (savedOpp && deepStep) activatedUsers += 1;
      }

      const returnedWithin = (minDays: number, maxDays: number) =>
        userEvents.some((e) => {
          if (e.eventName === 'user.signup.completed') return false;
          const diffDays = (new Date(e.occurredAt).getTime() - signupTs.getTime()) / 86_400_000;
          return diffDays >= minDays && diffDays <= maxDays;
        });

      if (returnedWithin(1, 2)) cohort.d1 += 1;
      if (returnedWithin(6, 8)) cohort.d7 += 1;
      if (returnedWithin(28, 32)) cohort.d30 += 1;
      cohortMap.set(cohortWeek, cohort);
    }

    const funnelStages = [
      { stage: 'Signed Up', eventName: 'user.signup.completed' },
      { stage: 'Searched Opportunities', eventName: 'opportunity.search.completed' },
      { stage: 'Saved Opportunity', eventName: 'opportunity.saved' },
      { stage: 'Created Workspace', eventName: 'workspace.created' },
      { stage: 'Uploaded Document', eventName: 'document.upload.completed' },
      { stage: 'Used AI Assistant', eventName: 'ai.assistant.responded' },
      { stage: 'Accepted Collaboration', eventName: 'collaboration.invitation.accepted' },
    ];

    const funnel = funnelStages.map((s) => ({
      stage: s.stage,
      eventName: s.eventName,
      distinctUsers: distinctActorsFor(s.eventName, 'SUCCESS').size,
    }));

    const failureCounts: Record<string, number> = {};
    for (const e of humanEvents) {
      if (e.outcome === 'FAILURE') {
        failureCounts[e.eventName] = (failureCounts[e.eventName] || 0) + 1;
      }
    }

    return {
      metadata: {
        windowDays,
        generatedAt: now.toISOString(),
        exclusions: ['TEST', 'SYSTEM'],
        excludedEventCount: excludedCount,
        totalIncludedEvents: humanEvents.length,
      },
      activitySummary: {
        dau: dauSet.size,
        wau: wauSet.size,
        mau: mauSet.size,
        stickinessRatio: mauSet.size > 0 ? Number((dauSet.size / mauSet.size).toFixed(3)) : 0,
        activeOrganizations: orgSet.size,
        institutionalActiveUsers: institutionalActorSet.size,
        totalSignedUpAccountsTracked: signupTimeByUser.size,
      },
      activation: {
        activatedUsers,
        eligibleSignups,
        activationRatePct:
          eligibleSignups > 0
            ? Number(((activatedUsers / eligibleSignups) * 100).toFixed(1))
            : 0,
        definition:
          'Distinct human accounts with opportunity.saved + (workspace.created | document.upload.completed | collaboration.invitation.accepted) within 14d of signup',
      },
      funnel,
      cohorts: Array.from(cohortMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-8)
        .map(([cohortDate, c]) => ({
          cohortDate,
          signedUp: c.signedUp,
          d1RetainedPct: c.signedUp > 0 ? Number(((c.d1 / c.signedUp) * 100).toFixed(1)) : 0,
          d7RetainedPct: c.signedUp > 0 ? Number(((c.d7 / c.signedUp) * 100).toFixed(1)) : 0,
          d30RetainedPct: c.signedUp > 0 ? Number(((c.d30 / c.signedUp) * 100).toFixed(1)) : 0,
        })),
      failuresByEvent: failureCounts,
    };
  }

  async getProductDashboardMetrics(windowDays = 30) {
    if (!this.eventRepo) {
      return this.computeProductMetricsFromEvents([], new Date(), windowDays);
    }
    const events = await this.eventRepo.find({
      order: { occurredAt: 'DESC' },
      take: 10000,
    });
    return this.computeProductMetricsFromEvents(events, new Date(), windowDays);
  }
}
