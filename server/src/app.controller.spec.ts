import { describe, it, expect } from 'vitest';
import { AppController } from './app.controller';

describe('AppController', () => {
  const controller = new AppController();

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
});
