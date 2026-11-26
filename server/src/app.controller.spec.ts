import { describe, it, expect } from 'vitest';
import { ServiceUnavailableException } from '@nestjs/common';
import { AppController } from './app.controller';

describe('AppController', () => {
  const mockDiagnosticService: any = {
    getDiagnosticReport: async () => ({
      engine: 'PostgreSQL 16 Enterprise Relational + pgvector HNSW Engine',
      postgresVersion: 'PostgreSQL 16.2',
      vectorEngine: { hnswDimensions: 768, status: 'OPTIMAL' },
    }),
  };

  const mockDataSource: any = {
    query: async () => [{ result: 1 }],
  };
  const mockRedisService: any = {
    getHealthInfo: async () => ({ status: 'CONNECTED' }),
  };
  const controller = new AppController(mockDiagnosticService, mockDataSource, mockRedisService);

  it('should return active platform status with PostgreSQL metadata', () => {
    const result = controller.getHealth();
    expect(result).toBeDefined();
    expect(result.status).toBe('Active');
    expect(result.service).toContain('Cambium');
    expect(result.database).toContain('PostgreSQL');
    expect(result.targetDb).toBe('cambium');
    expect(result.documentation).toBe('/api/docs');
    expect(result.endpoints).toBeDefined();
    expect(result.endpoints.opportunities.base).toBe('GET /api/research-opportunities');
  });

  it('should return database diagnostic report', async () => {
    const report = await controller.getDatabaseDiagnostics();
    expect(report).toBeDefined();
    expect(report.engine).toContain('PostgreSQL 16');
  });

  it('should return liveness and readiness probe metrics', async () => {
    const probe = await controller.getLivenessAndReadiness();
    expect(probe).toBeDefined();
    expect(probe.status).toBe('ok');
    expect(probe.database).toBe('connected');
    expect(probe.redis).toBe('connected');
    expect(['configured', 'degraded_offline']).toContain(probe.aiProvider);
    expect(probe.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should redact internal database target metadata in production root health output', () => {
    const prevEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const prodHealth = controller.getHealth() as Record<string, any>;
      expect(prodHealth.targetDb).toBeUndefined();
      expect(prodHealth.schema).toBeUndefined();
      expect(prodHealth.documentation).toBeUndefined();
    } finally {
      process.env.NODE_ENV = prevEnv;
    }
  });

  it('should report Redis fallback as degraded', async () => {
    mockRedisService.getHealthInfo = async () => ({ status: 'IN_MEMORY_FALLBACK' });
    const probe = await controller.getLivenessAndReadiness();
    expect(probe.redis).toBe('degraded');
    mockRedisService.getHealthInfo = async () => ({ status: 'CONNECTED' });
  });

  it('should fail readiness when PostgreSQL is unavailable', async () => {
    mockDataSource.query = async () => {
      throw new Error('connection refused');
    };
    await expect(controller.getLivenessAndReadiness()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    mockDataSource.query = async () => [{ result: 1 }];
  });
});
