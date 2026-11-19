import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CircuitBreakerService } from './circuit-breaker.service';

describe('CircuitBreakerService', () => {
  let breaker: CircuitBreakerService;

  beforeEach(() => {
    breaker = new CircuitBreakerService();
    breaker.reset();
  });

  it('should initialize with CLOSED state and successfully execute healthy actions', async () => {
    const action = vi.fn().mockResolvedValue('scholarly_data');
    const result = await breaker.execute('openalex_api', action);

    expect(result).toBe('scholarly_data');
    expect(breaker.getState('openalex_api')).toBe('CLOSED');
  });

  it('should trip to OPEN when failure threshold is reached', async () => {
    const failingAction = vi.fn().mockRejectedValue(new Error('503 Service Unavailable'));
    const fallback = vi.fn().mockResolvedValue('cached_fallback_data');

    // 5 failures threshold
    for (let i = 0; i < 5; i++) {
      await breaker.execute('orcid_api', failingAction, fallback, { failureThreshold: 5 });
    }

    expect(breaker.getState('orcid_api')).toBe('OPEN');

    // 6th call should immediately short-circuit to fallback without calling failingAction
    failingAction.mockClear();
    const result = await breaker.execute('orcid_api', failingAction, fallback);
    expect(result).toBe('cached_fallback_data');
    expect(failingAction).not.toHaveBeenCalled();
  });

  it('should transition to HALF_OPEN after cooldown and heal back to CLOSED on consecutive successes', async () => {
    const failingAction = vi.fn().mockRejectedValue(new Error('Timeout'));
    const fallback = vi.fn().mockResolvedValue('fallback');

    // Trip circuit with 100ms cooldown
    for (let i = 0; i < 3; i++) {
      await breaker.execute('crossref_api', failingAction, fallback, {
        failureThreshold: 3,
        cooldownMs: 100,
        halfOpenSuccessThreshold: 2,
      });
    }
    expect(breaker.getState('crossref_api')).toBe('OPEN');

    // Wait for cooldown
    await new Promise((resolve) => setTimeout(resolve, 120));

    // Next call should transition to HALF_OPEN
    const healthyAction = vi.fn().mockResolvedValue('fresh_doi_data');
    await breaker.execute('crossref_api', healthyAction, undefined, {
      cooldownMs: 100,
      halfOpenSuccessThreshold: 2,
    });
    // First success in HALF_OPEN
    expect(breaker.getState('crossref_api')).toBe('HALF_OPEN');

    // Second success in HALF_OPEN should heal back to CLOSED
    await breaker.execute('crossref_api', healthyAction, undefined, {
      cooldownMs: 100,
      halfOpenSuccessThreshold: 2,
    });
    expect(breaker.getState('crossref_api')).toBe('CLOSED');
  });
});
