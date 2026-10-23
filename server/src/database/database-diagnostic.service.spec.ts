import { describe, it, expect } from 'vitest';
import { DatabaseDiagnosticService } from './database-diagnostic.service';

describe('DatabaseDiagnosticService (Advanced DBMS Diagnostics & Pooling)', () => {
  const mockDataSource: any = {
    isInitialized: true,
    query: async (sql: string) => {
      if (sql.includes('version()')) {
        return [{ version: 'PostgreSQL 16.2 on x86_64-pc-linux-gnu' }];
      }
      if (sql.includes('pg_stat_activity')) {
        return [
          { state: 'active', count: '4' },
          { state: 'idle', count: '12' },
        ];
      }
      if (sql.includes('pg_relation_size')) {
        return [{ size: '2097152' }];
      }
      return [];
    },
  };

  const service = new DatabaseDiagnosticService(mockDataSource);

  it('should return complete structured diagnostic report with connection pooling metrics', async () => {
    const report = await service.getDiagnosticReport();

    expect(report).toBeDefined();
    expect(report.engine).toContain('PostgreSQL 16');
    expect(report.postgresVersion).toContain('PostgreSQL 16.2');
    expect(report.connectionPool.activeConnections).toBe(4);
    expect(report.connectionPool.idleConnections).toBe(12);
  });

  it('should verify 768-dim pgvector HNSW index and GIN FTS status', async () => {
    const report = await service.getDiagnosticReport();

    expect(report.vectorEngine.hnswDimensions).toBe(768);
    expect(report.vectorEngine.distanceOperator).toContain('Cosine Distance');
    expect(report.vectorEngine.status).toBe('OPTIMAL');
    expect(report.lexicalSearch.indexType).toBe('GIN');
    expect(report.lexicalSearch.status).toBe('ACTIVE');
  });

  it('should report table cardinalities across critical research entities', async () => {
    const report = await service.getDiagnosticReport();

    expect(report.tableCardinality.users).toBeGreaterThan(0);
    expect(report.tableCardinality.opportunities).toBeGreaterThan(0);
    expect(report.tableCardinality.auditLogs).toBeGreaterThan(0);
  });
});
