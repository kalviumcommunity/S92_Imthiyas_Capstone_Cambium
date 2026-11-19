import { describe, it, expect } from 'vitest';
import { SreErrorClassifier } from './sre-error-classifier';

describe('SreErrorClassifier', () => {
  it('should classify circuit breaker open errors as CIRCUIT_TRIPPED', () => {
    const error = new Error('Upstream service [gemini_ai] circuit breaker is OPEN. Cooldown remaining: 15s');
    const result = SreErrorClassifier.classify(error);

    expect(result.category).toBe('CIRCUIT_TRIPPED');
    expect(result.isRetriable).toBe(true);
    expect(result.incidentCode).toBe('SRE-CB-001');
  });

  it('should classify transient network timeouts as TRANSIENT_NETWORK with retriable flag', () => {
    const error = new Error('connect ETIMEDOUT 140.82.112.4:443');
    const result = SreErrorClassifier.classify(error);

    expect(result.category).toBe('TRANSIENT_NETWORK');
    expect(result.isRetriable).toBe(true);
    expect(result.incidentCode).toBe('SRE-NET-002');
  });

  it('should classify token expiration as AUTHENTICATION_EXPIRED non-retriable', () => {
    const error = new Error('jwt expired: token not valid after timestamp');
    const result = SreErrorClassifier.classify(error);

    expect(result.category).toBe('AUTHENTICATION_EXPIRED');
    expect(result.isRetriable).toBe(false);
    expect(result.incidentCode).toBe('SRE-AUTH-003');
  });

  it('should classify redlock or optimistic locking conflicts as RESOURCE_CONFLICT', () => {
    const error = new Error('Resource conflict: Redlock failed to acquire lock on draft-101');
    const result = SreErrorClassifier.classify(error);

    expect(result.category).toBe('RESOURCE_CONFLICT');
    expect(result.isRetriable).toBe(true);
    expect(result.incidentCode).toBe('SRE-LOCK-005');
  });
});
