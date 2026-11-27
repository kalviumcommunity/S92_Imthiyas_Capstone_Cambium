import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  Optional,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { ProductAnalyticsService } from './product-analytics.service';
import { AiObservabilityService } from './ai-observability.service';
import { AlertEvaluatorService } from './alert-evaluator.service';
import { runDeterministicRagEvaluation } from './ai-eval-dataset';
import { RecordClientErrorDto, RecordClientEventDto } from './dto/analytics.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { TelemetryService } from '../../common/telemetry/telemetry.service';
import { QueueService } from '../../common/queues/queue.service';
import { CircuitBreakerService } from '../../common/resilience/circuit-breaker.service';

@ApiTags('Product Analytics & Observability')
@Controller('api/v1')
export class AnalyticsController {
  constructor(
    private readonly productAnalytics: ProductAnalyticsService,
    private readonly aiObservability: AiObservabilityService,
    private readonly alertEvaluator: AlertEvaluatorService,
    @Optional() private readonly telemetryService?: TelemetryService,
    @Optional() private readonly queueService?: QueueService,
    @Optional() private readonly circuitBreaker?: CircuitBreakerService,
    @Optional() private readonly dataSource?: DataSource,
  ) {}

  @Get('analytics/dashboards/product')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.RD_DIRECTOR,
    UserRole.UNIVERSITY_LEADERSHIP,
    UserRole.COMPLIANCE_OFFICER,
  )
  @ApiOperation({
    summary: 'Product analytics dashboard: DAU/WAU/MAU, activation, funnels & cohort retention (TEST/SYSTEM excluded)',
  })
  async getProductDashboard(@Query('windowDays') windowDays?: string) {
    const parsedDays = Math.min(90, Math.max(1, Number(windowDays) || 30));
    return this.productAnalytics.getProductDashboardMetrics(parsedDays);
  }

  @Get('analytics/dashboards/engineering')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.RD_DIRECTOR,
    UserRole.UNIVERSITY_LEADERSHIP,
    UserRole.COMPLIANCE_OFFICER,
  )
  @ApiOperation({
    summary: 'Engineering observability dashboard: API latency, DB connections/locks, queue lag, circuit breakers & alerts',
  })
  async getEngineeringDashboard() {
    const telemetry = this.telemetryService?.getMetrics() || {
      totalRequests: 0,
      totalErrors: 0,
      errorRatePercent: 0,
      p50LatencyMs: 0,
      p90LatencyMs: 0,
      p95LatencyMs: 0,
      p99LatencyMs: 0,
      activeSpansCount: 0,
      recordedTracesCount: 0,
      uptimeSeconds: Math.floor(process.uptime()),
    };

    const queueMetrics: any = this.queueService
      ? await this.queueService.getMetrics()
      : { mode: 'unavailable', summary: { queued: 0, running: 0, completed: 0, dead: 0, oldestPendingAgeSeconds: 0 } };

    let activeConnections = 0;
    let idleConnections = 0;
    let waitingLocksCount = 0;
    let slowQueriesCount = 0;
    const maxConnections = parseInt(process.env.DB_POOL_MAX || '50', 10);

    if (this.dataSource?.isInitialized) {
      try {
        const rows = await this.dataSource.query(
          `SELECT
             COUNT(*) FILTER (WHERE state = 'active')::int AS active,
             COUNT(*) FILTER (WHERE state = 'idle')::int AS idle,
             COUNT(*) FILTER (WHERE wait_event_type = 'Lock')::int AS locks,
             COUNT(*) FILTER (WHERE state = 'active' AND now() - query_start > interval '1 second')::int AS slow
           FROM pg_stat_activity WHERE datname = current_database()`,
        );
        if (rows?.[0]) {
          activeConnections = Number(rows[0].active || 0);
          idleConnections = Number(rows[0].idle || 0);
          waitingLocksCount = Number(rows[0].locks || 0);
          slowQueriesCount = Number(rows[0].slow || 0);
        }
      } catch {
        // Resilient fallback if stats view unavailable
      }
    }

    const breakers = this.circuitBreaker?.getAllBreakers() || {};
    const openCircuitBreakers = Object.entries(breakers)
      .filter(([, b]) => b.state === 'OPEN')
      .map(([name]) => name);

    const aiSummary = await this.aiObservability.getSummary(24);
    const clientErrors = await this.productAnalytics.getRecentClientErrors(20);

    const alerts = this.alertEvaluator.evaluate({
      totalRequests: telemetry.totalRequests,
      errorRatePercent: telemetry.errorRatePercent,
      p95LatencyMs: telemetry.p95LatencyMs,
      activeConnections,
      maxConnections,
      activeLocks: waitingLocksCount,
      slowQueriesCount,
      oldestPendingJobAgeSeconds: queueMetrics?.summary?.oldestPendingAgeSeconds || 0,
      deadJobsCount: queueMetrics?.summary?.dead || 0,
      openCircuitBreakers,
      aiCallsCount: aiSummary.totalCalls,
      aiFailureOrFallbackRatePct:
        aiSummary.outcomes.fallbackRatePct + aiSummary.outcomes.failureRatePct,
    });

    return {
      generatedAt: new Date().toISOString(),
      telemetry,
      database: {
        connected: Boolean(this.dataSource?.isInitialized),
        maxConnections,
        activeConnections,
        idleConnections,
        waitingLocksCount,
        slowQueriesCount,
      },
      queues: queueMetrics,
      circuitBreakers: breakers,
      clientErrors,
      alerts,
    };
  }

  @Get('analytics/dashboards/ai')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.RD_DIRECTOR,
    UserRole.UNIVERSITY_LEADERSHIP,
    UserRole.COMPLIANCE_OFFICER,
  )
  @ApiOperation({
    summary: 'AI & RAG observability dashboard: live/fallback rates, estimated tokens/cost & versioned eval dataset scores',
  })
  async getAiDashboard(@Query('windowHours') windowHours?: string) {
    const hours = Math.min(168, Math.max(1, Number(windowHours) || 24));
    const runtime = await this.aiObservability.getSummary(hours);
    const offlineEvaluation = runDeterministicRagEvaluation();
    return {
      generatedAt: new Date().toISOString(),
      runtime,
      offlineEvaluation,
    };
  }

  @Get('analytics/dashboards/institution')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.RD_DIRECTOR,
    UserRole.UNIVERSITY_LEADERSHIP,
    UserRole.COMPLIANCE_OFFICER,
    UserRole.DEPARTMENT_HEAD,
  )
  @ApiOperation({
    summary: 'Institutional aggregate usage summary strictly isolated to caller organization with k>=3 anonymity threshold',
  })
  async getInstitutionalDashboard(
    @CurrentUser() user: AuthenticatedUser,
    @Query('organizationId') requestedOrgId?: string,
    @Query('windowDays') windowDays?: string,
  ) {
    const targetOrgId =
      user.role === UserRole.SUPER_ADMIN && requestedOrgId
        ? requestedOrgId
        : user.organizationId;

    if (!targetOrgId) {
      throw new ForbiddenException(
        'Institutional telemetry requires an organizational affiliation.',
      );
    }

    const parsedDays = Math.min(90, Math.max(1, Number(windowDays) || 30));
    return this.productAnalytics.getInstitutionalUsageSummary(targetOrgId, parsedDays);
  }

  @Post('analytics/client-events')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Ingest optional UI interaction events when analytics consent is granted; blocks backend-only events',
  })
  async ingestClientEvent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RecordClientEventDto,
    @Headers('x-cambium-analytics-consent') consentHeader?: string,
  ) {
    const consentGranted = (consentHeader || '').toLowerCase() === 'granted';
    return this.productAnalytics.recordClientInteractionEvent(
      { id: user.id, email: user.email, organizationId: user.organizationId },
      dto,
      consentGranted,
    );
  }

  @Post('observability/client-errors')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Sanitized frontend error boundary telemetry collector (zero PII or tokens persisted)',
  })
  async ingestClientError(@Body() dto: RecordClientErrorDto) {
    const recorded = await this.productAnalytics.recordClientError(dto);
    return {
      accepted: true,
      id: recorded?.id || null,
    };
  }
}
