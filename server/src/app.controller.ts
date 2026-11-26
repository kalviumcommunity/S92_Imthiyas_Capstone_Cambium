import { Controller, Get, Logger, ServiceUnavailableException, Optional, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { DatabaseDiagnosticService } from './database/database-diagnostic.service';
import { RedisService } from './common/redis/redis.service';
import { CircuitBreakerService, BreakerMetrics } from './common/resilience/circuit-breaker.service';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { Roles } from './modules/auth/decorators/roles.decorator';
import { UserRole } from './modules/users/entities/user.entity';

@ApiTags('System')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly diagnosticService: DatabaseDiagnosticService,
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
    @Optional()
    private readonly circuitBreakerService?: CircuitBreakerService,
  ) {}

  @Get('api/database/diagnostics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPLIANCE_OFFICER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inspect PostgreSQL 16 pgvector HNSW health, PgBouncer pool stats, and table metrics' })
  @ApiResponse({ status: 200, description: 'Structured database diagnostic telemetry' })
  async getDatabaseDiagnostics() {
    return this.diagnosticService.getDiagnosticReport();
  }

  @Get(['health', 'api/health', 'api/v1/health', 'status', 'api/status'])
  @ApiOperation({ summary: 'Enterprise Health Check & System Status Probe' })
  @ApiResponse({ status: 200, description: 'Liveness, readiness, and subsystem status metrics' })
  async getLivenessAndReadiness() {
    try {
      await this.dataSource.query('SELECT 1');
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error('Readiness check failed: PostgreSQL is unavailable', stack);
      throw new ServiceUnavailableException('Database unavailable');
    }

    const redis = await this.redisService.getHealthInfo();
    const circuitBreakers = this.circuitBreakerService?.getAllBreakers() || {};
    const rawGeminiKey = process.env.GEMINI_API_KEY?.trim() || '';
    const aiConfigured =
      rawGeminiKey.length > 10 && !rawGeminiKey.includes('your_');

    return {
      status: 'ok',
      service: 'Cambium Core Platform API',
      version: '2.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'connected',
      redis: redis.status === 'CONNECTED' ? 'connected' : 'degraded',
      aiProvider: aiConfigured ? 'configured' : 'degraded_offline',
      circuitBreakers,
      environment: process.env.NODE_ENV || 'production',
    };
  }

  @Get(['health/liveness', 'api/v1/health/liveness'])
  @ApiOperation({ summary: 'Kubernetes & Docker liveness probe verifying HTTP runtime responsiveness' })
  @ApiResponse({ status: 200, description: 'Liveness status: ALIVE' })
  getLiveness() {
    return {
      status: 'UP',
      service: 'Cambium Core Platform API',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  @Get(['health/readiness', 'api/v1/health/readiness'])
  @ApiOperation({ summary: 'Kubernetes readiness probe verifying DB connectivity and circuit breaker health' })
  @ApiResponse({ status: 200, description: 'Readiness status: READY' })
  async getReadiness() {
    return this.getLivenessAndReadiness();
  }

  @Get('api/v1/health/circuit-breakers')
  @ApiOperation({ summary: 'Inspect circuit breaker states, failure thresholds, and recovery metrics' })
  @ApiResponse({ status: 200, description: 'Active circuit breaker registry telemetry' })
  getCircuitBreakers() {
    return {
      timestamp: new Date().toISOString(),
      breakers: this.circuitBreakerService?.getAllBreakers() || {},
    };
  }

  @Get()
  @ApiOperation({ summary: 'Cambium API Health and System Info' })
  @ApiResponse({ status: 200, description: 'API health check and directory of endpoints' })
  getHealth() {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      status: 'Active',
      service: 'Cambium Core Platform API',
      version: '2.0.0',
      database: 'PostgreSQL (Normalized 3NF + pgvector)',
      ...(isProd
        ? {}
        : {
            schema: 'public',
            targetDb: process.env.POSTGRES_DB || 'cambium',
            documentation: '/api/docs',
          }),
      timestamp: new Date().toISOString(),
      endpoints: isProd
        ? {
            liveness: 'GET /api/v1/health/liveness',
            readiness: 'GET /api/v1/health/readiness',
          }
        : {
            auth: {
              register: 'POST /api/auth/register',
              login: 'POST /api/auth/login',
              me: 'GET /api/auth/me',
            },
            opportunities: {
              base: 'GET /api/research-opportunities',
              stats: 'GET /api/research-opportunities/stats',
              upcoming: 'GET /api/research-opportunities/upcoming-deadlines',
              recommendations: 'POST /api/research-opportunities/recommendations',
            },
            users: {
              base: 'GET /api/users',
              profile: 'GET /api/users/profile',
              interests: 'PUT /api/users/interests',
            },
            bookmarks: {
              base: 'GET /api/bookmarks',
              create: 'POST /api/bookmarks',
            },
            notifications: {
              base: 'GET /api/notifications',
            },
            relationships: {
              overview: 'GET /api/relationships/overview',
              graph: 'GET /api/relationships/graph',
            },
          },
    };
  }
}
