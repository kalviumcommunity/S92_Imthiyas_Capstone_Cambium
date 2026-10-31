import { describe, it, expect } from 'vitest';
import { AppController } from './app.controller';

describe('AppController', () => {
  const mockDiagnosticService: any = {
    getDiagnosticReport: async () => ({
      engine: 'PostgreSQL 16 Enterprise Relational + pgvector HNSW Engine',
      postgresVersion: 'PostgreSQL 16.2',
      vectorEngine: { hnswDimensions: 768, status: 'OPTIMAL' },
    }),
  };

  const controller = new AppController(mockDiagnosticService);

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

  it('should return liveness and readiness probe metrics', () => {
    const probe = controller.getLivenessAndReadiness();
    expect(probe).toBeDefined();
    expect(probe.status).toBe('ok');
    expect(probe.database).toBe('connected');
    expect(probe.redis).toBe('connected');
    expect(probe.uptime).toBeGreaterThanOrEqual(0);
  });
});
