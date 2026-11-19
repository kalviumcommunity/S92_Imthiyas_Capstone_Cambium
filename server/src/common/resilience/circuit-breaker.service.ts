import { Injectable, Logger } from '@nestjs/common';

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number; // Failures before tripping (default: 5)
  cooldownMs?: number; // Time in OPEN state before canary trial (default: 30000ms)
  halfOpenSuccessThreshold?: number; // Successes in HALF_OPEN before returning to CLOSED (default: 2)
}

export interface BreakerMetrics {
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  lastFailureTime: number | null;
  lastStateChange: number;
  consecutiveSuccesses: number;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly breakers = new Map<string, BreakerMetrics>();

  private readonly defaultOptions: Required<CircuitBreakerOptions> = {
    failureThreshold: 5,
    cooldownMs: 30000,
    halfOpenSuccessThreshold: 2,
  };

  private getOrCreate(serviceName: string): BreakerMetrics {
    let metrics = this.breakers.get(serviceName);
    if (!metrics) {
      metrics = {
        state: 'CLOSED',
        failureCount: 0,
        successCount: 0,
        lastFailureTime: null,
        lastStateChange: Date.now(),
        consecutiveSuccesses: 0,
      };
      this.breakers.set(serviceName, metrics);
    }
    return metrics;
  }

  async execute<T>(
    serviceName: string,
    action: () => Promise<T>,
    fallback?: () => Promise<T>,
    options?: CircuitBreakerOptions,
  ): Promise<T> {
    const opts = { ...this.defaultOptions, ...options };
    const metrics = this.getOrCreate(serviceName);
    const now = Date.now();

    // Check if OPEN cooldown has expired -> transition to HALF_OPEN canary mode
    if (metrics.state === 'OPEN') {
      if (now - (metrics.lastFailureTime || 0) >= opts.cooldownMs) {
        this.transition(serviceName, 'HALF_OPEN');
      } else {
        this.logger.warn(
          `Circuit Breaker [${serviceName}] is OPEN. Short-circuiting call to prevent cascading failure.`,
        );
        if (fallback) {
          return fallback();
        }
        throw new Error(
          `Upstream service [${serviceName}] circuit breaker is OPEN. Cooldown remaining: ${Math.ceil(
            (opts.cooldownMs - (now - (metrics.lastFailureTime || 0))) / 1000,
          )}s`,
        );
      }
    }

    try {
      const result = await action();
      this.recordSuccess(serviceName, opts);
      return result;
    } catch (error) {
      this.recordFailure(serviceName, opts);
      if (fallback) {
        this.logger.warn(
          `Action failed for [${serviceName}]. Returning graceful degraded fallback payload.`,
        );
        return fallback();
      }
      throw error;
    }
  }

  private recordSuccess(serviceName: string, opts: Required<CircuitBreakerOptions>) {
    const metrics = this.getOrCreate(serviceName);
    metrics.successCount++;

    if (metrics.state === 'HALF_OPEN') {
      metrics.consecutiveSuccesses++;
      if (metrics.consecutiveSuccesses >= opts.halfOpenSuccessThreshold) {
        this.logger.log(
          `Circuit Breaker canary verified for [${serviceName}]. Healing back to CLOSED state.`,
        );
        this.transition(serviceName, 'CLOSED');
        metrics.failureCount = 0;
        metrics.consecutiveSuccesses = 0;
      }
    } else if (metrics.state === 'CLOSED') {
      // Periodic decay of previous failure count on clean operation
      if (metrics.failureCount > 0) {
        metrics.failureCount = Math.max(0, metrics.failureCount - 1);
      }
    }
  }

  private recordFailure(serviceName: string, opts: Required<CircuitBreakerOptions>) {
    const metrics = this.getOrCreate(serviceName);
    metrics.failureCount++;
    metrics.lastFailureTime = Date.now();
    metrics.consecutiveSuccesses = 0;

    if (metrics.state === 'HALF_OPEN' || metrics.failureCount >= opts.failureThreshold) {
      this.logger.error(
        `Circuit Breaker tripped to OPEN for [${serviceName}] (Failures: ${metrics.failureCount}/${opts.failureThreshold})`,
      );
      this.transition(serviceName, 'OPEN');
    }
  }

  private transition(serviceName: string, nextState: CircuitBreakerState) {
    const metrics = this.getOrCreate(serviceName);
    metrics.state = nextState;
    metrics.lastStateChange = Date.now();
  }

  getState(serviceName: string): CircuitBreakerState {
    const metrics = this.breakers.get(serviceName);
    if (!metrics) return 'CLOSED';

    // Auto-check cooldown expiry
    if (
      metrics.state === 'OPEN' &&
      Date.now() - (metrics.lastFailureTime || 0) >= this.defaultOptions.cooldownMs
    ) {
      this.transition(serviceName, 'HALF_OPEN');
      return 'HALF_OPEN';
    }
    return metrics.state;
  }

  getAllBreakers(): Record<string, BreakerMetrics> {
    const result: Record<string, BreakerMetrics> = {};
    for (const [key, value] of this.breakers.entries()) {
      result[key] = { ...value };
    }
    return result;
  }

  reset(serviceName?: string): void {
    if (serviceName) {
      this.breakers.delete(serviceName);
    } else {
      this.breakers.clear();
    }
  }
}
