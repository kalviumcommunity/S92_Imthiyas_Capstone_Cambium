import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DatabaseDiagnosticService } from './database/database-diagnostic.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly diagnosticService: DatabaseDiagnosticService) {}

  @Get('api/database/diagnostics')
  @ApiOperation({ summary: 'Inspect PostgreSQL 16 pgvector HNSW health, PgBouncer pool stats, and table metrics' })
  @ApiResponse({ status: 200, description: 'Structured database diagnostic telemetry' })
  async getDatabaseDiagnostics() {
    return this.diagnosticService.getDiagnosticReport();
  }

  @Get()
  @ApiOperation({ summary: 'Cambium API Health and System Info' })
  @ApiResponse({ status: 200, description: 'API health check and directory of endpoints' })
  getHealth() {
    return {
      status: 'Active',
      service: 'Cambium Core Platform API',
      version: '2.0.0',
      database: 'PostgreSQL (Normalized 3NF + pgvector)',
      schema: 'public',
      targetDb: process.env.POSTGRES_DB || 'cambium',
      documentation: '/api/docs',
      timestamp: new Date().toISOString(),
      endpoints: {
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
