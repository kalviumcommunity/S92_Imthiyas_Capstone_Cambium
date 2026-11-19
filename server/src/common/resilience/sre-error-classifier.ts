export type SreErrorCategory =
  | 'TRANSIENT_NETWORK'
  | 'CIRCUIT_TRIPPED'
  | 'AUTHENTICATION_EXPIRED'
  | 'SECURITY_VIOLATION'
  | 'RESOURCE_CONFLICT'
  | 'UPSTREAM_DEPENDENCY'
  | 'INTERNAL_INVARIANT';

export interface SreClassifiedError {
  category: SreErrorCategory;
  isRetriable: boolean;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  recommendedAction: string;
  incidentCode: string;
}

export class SreErrorClassifier {
  static classify(error: unknown): SreClassifiedError {
    const message = error instanceof Error ? error.message : String(error);
    const lower = message.toLowerCase();

    // 1. Circuit breaker tripped
    if (lower.includes('circuit breaker is open') || lower.includes('short-circuiting call')) {
      return {
        category: 'CIRCUIT_TRIPPED',
        isRetriable: true,
        severity: 'WARN',
        recommendedAction: 'Wait for cooldown period before attempting canary recovery probe.',
        incidentCode: 'SRE-CB-001',
      };
    }

    // 2. Transient network errors
    if (
      lower.includes('econnreset') ||
      lower.includes('etimedout') ||
      lower.includes('connection refused') ||
      lower.includes('socket hang up') ||
      lower.includes('network request failed')
    ) {
      return {
        category: 'TRANSIENT_NETWORK',
        isRetriable: true,
        severity: 'WARN',
        recommendedAction: 'Retry request with jittered exponential backoff.',
        incidentCode: 'SRE-NET-002',
      };
    }

    // 3. Authentication & Sessions
    if (lower.includes('jwt expired') || lower.includes('unauthorized') || lower.includes('token expired')) {
      return {
        category: 'AUTHENTICATION_EXPIRED',
        isRetriable: false,
        severity: 'INFO',
        recommendedAction: 'Perform rotating refresh token exchange or re-authenticate.',
        incidentCode: 'SRE-AUTH-003',
      };
    }

    // 4. Security & RBAC violations
    if (lower.includes('forbidden') || lower.includes('permission denied') || lower.includes('rbac guard')) {
      return {
        category: 'SECURITY_VIOLATION',
        isRetriable: false,
        severity: 'ERROR',
        recommendedAction: 'Verify institutional permissions and role authorizations.',
        incidentCode: 'SRE-SEC-004',
      };
    }

    // 5. Optimistic concurrency & Lock conflicts
    if (lower.includes('conflict') || lower.includes('version column') || lower.includes('redlock')) {
      return {
        category: 'RESOURCE_CONFLICT',
        isRetriable: true,
        severity: 'WARN',
        recommendedAction: 'Reload fresh entity snapshot and re-apply localized diff.',
        incidentCode: 'SRE-LOCK-005',
      };
    }

    // Default internal fallback
    return {
      category: 'INTERNAL_INVARIANT',
      isRetriable: false,
      severity: 'ERROR',
      recommendedAction: 'Inspect server telemetry logs and application error trace.',
      incidentCode: 'SRE-SYS-006',
    };
  }
}
