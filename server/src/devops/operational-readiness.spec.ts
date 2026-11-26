import { describe, it, expect } from 'vitest';
import { ServiceUnavailableException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { assertValidProductionEnv } from '../config/env.validation';
import { AppController } from '../app.controller';

describe('Sprint 5 Operational Verification & Failure Scenarios', () => {
  it('blocks boot in production when JWT_SECRET or DB credentials are missing', () => {
    expect(() =>
      assertValidProductionEnv({ NODE_ENV: 'production', JWT_SECRET: 'weak' }),
    ).toThrow(/Startup environment validation failed/);
  });

  it('keeps liveness UP while failing readiness 503 when PostgreSQL disconnects', async () => {
    const controller = new AppController(
      { getDiagnosticReport: async () => ({}) } as any,
      {
        query: async () => {
          throw new Error('ECONNREFUSED');
        },
      } as any,
      { getHealthInfo: async () => ({ status: 'IN_MEMORY_FALLBACK' }) } as any,
    );

    const live = controller.getLiveness();
    expect(live.status).toBe('UP');

    await expect(controller.getReadiness()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('keeps readiness HTTP 200 (degraded) when Redis is unreachable but DB stays connected', async () => {
    const controller = new AppController(
      { getDiagnosticReport: async () => ({}) } as any,
      { query: async () => [{ '?column?': 1 }] } as any,
      { getHealthInfo: async () => ({ status: 'IN_MEMORY_FALLBACK' }) } as any,
    );

    const ready = await controller.getReadiness();
    expect(ready.status).toBe('ok');
    expect(ready.database).toBe('connected');
    expect(ready.redis).toBe('degraded');
  });

  it('confirms CI migration validation, strict render.yaml startup, and clean script secret hygiene', () => {
    const rootDir = path.resolve(__dirname, '../../..');
    const ciYaml = fs.readFileSync(path.join(rootDir, '.github/workflows/ci.yml'), 'utf8');
    const renderYaml = fs.readFileSync(path.join(rootDir, 'render.yaml'), 'utf8');
    const backupJs = fs.readFileSync(path.join(rootDir, 'scripts/backup-db.mjs'), 'utf8');

    expect(ciYaml).toContain('database-migration-check');
    expect(ciYaml).toContain('pgvector/pgvector:pg16');
    expect(renderYaml).toContain('/api/v1/health/liveness');
    expect(renderYaml).not.toContain('schema:apply || true');
    expect(backupJs).not.toContain('2Live&letLive');
  });
});
