# Sprint 04: Reliability Engineering (SRE) & Resilience

## Executive Summary & Architecture Blueprint
**Sprint ID**: `SPRINT-04-RELIABILITY-ENGINEERING`  
**Status**: `COMPLETED`  
**Budget**: `₹0 (Zero Paid Services, In-Memory Circuit Breakers + Kubernetes Health Probes + SRE Error Classification)`  
**Authors**: Cambium Research Platform Core Engineering  

Sprint 04 establishes enterprise Site Reliability Engineering (SRE) practices across the Cambium platform: automated fault isolation, circuit breaking on external upstream dependencies, multi-stage Kubernetes health probes, and structured error categorization.

---

## 1. Reliability & SRE Architecture

```
                       [ Incoming Client / Agent Requests ]
                                        |
                                        v
                 +---------------------------------------------+
                 |       GracefulDegradationInterceptor        |
                 |  - Catches downstream failures              |
                 |  - SreErrorClassifier (6 incident classes)  |
                 |  - Injects X-Cambium-Incident-Code          |
                 +----------------------+----------------------+
                                        |
                                        v
                 +---------------------------------------------+
                 |            CircuitBreakerService            |
                 |  - CLOSED: Normal operation                 |
                 |  - OPEN: Tripped (> 5 failures),            |
                 |    immediate fallback bypass                |
                 |  - HALF_OPEN: Canary verification (2 probe) |
                 |  - Cooldown: 30s auto-healing timer         |
                 +----------------------+----------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
     [ Internal PostgreSQL / Redis ]               [ External Upstream APIs ]
     - Readiness Probe: SELECT 1                   - OpenAlex, CrossRef, ORCID
     - PgBouncer Pool Telemetry                    - Gemini LLM & Stripe Gateway
```

---

## 2. Circuit Breaker Specification & State Machine

```
                   +-------------------------+
                   |         CLOSED          |<---------------+
                   | (Healthy, all traffic)  |                |
                   +------------+------------+                |
                                |                             |
                       failureCount >= 5                      | 2 consecutive
                                |                             | successes
                                v                             |
                   +-------------------------+                |
                   |          OPEN           |                |
                   | (Short-circuit fallback)|                |
                   +------------+------------+                |
                                |                             |
                        cooldown >= 30s                       |
                                |                             |
                                v                             |
                   +-------------------------+                |
                   |        HALF_OPEN        |----------------+
                   |  (Canary probe trial)   |
                   +-------------------------+
```

### 2.1 Cooldown & Threshold Calibration
| Parameter | Value | Rationale |
| :--- | :--- | :--- |
| `failureThreshold` | `5 consecutive` | Absorbs momentary network jitter without prematurely tripping. |
| `cooldownMs` | `30,000 ms` | Provides upstream scholarly services sufficient time to recover under DDoS/outage. |
| `halfOpenSuccessThreshold` | `2 consecutive` | Verifies stability before restoring full production traffic. |

---

## 3. SRE Health Probes & Telemetry Endpoints

1. **`GET /health/liveness`**:
   - Lightweight Kubernetes/container orchestrator probe returning `HTTP 200` with uptime.
2. **`GET /health/readiness`**:
   - Deep readiness check verifying database connectivity, Redis connection, and circuit breaker health.
3. **`GET /api/v1/health/circuit-breakers`**:
   - Telemetry endpoint exposing active circuit breaker states, failure counts, and cooldown timers for SRE dashboards.

---

## 4. Structured Error Classification Matrix

| Incident Code | Error Category | Retriable | Recommended SRE Action |
| :--- | :--- | :--- | :--- |
| `SRE-CB-001` | `CIRCUIT_TRIPPED` | Yes | Await 30s cooldown before canary probe execution. |
| `SRE-NET-002` | `TRANSIENT_NETWORK` | Yes | Retry with jittered exponential backoff. |
| `SRE-AUTH-003` | `AUTHENTICATION_EXPIRED` | No | Rotate refresh token or prompt re-authentication. |
| `SRE-SEC-004` | `SECURITY_VIOLATION` | No | Verify institutional RBAC permission ledger. |
| `SRE-LOCK-005` | `RESOURCE_CONFLICT` | Yes | Refresh entity version snapshot and reapply diff. |
| `SRE-SYS-006` | `INTERNAL_INVARIANT` | No | Inspect application stack trace and server logs. |

---

## 5. Verification & Quality Gates
- **Zero Paid Dependencies**: In-memory state machine and native RxJS interceptors.
- **Unit Test Coverage**: Full pass rate across `circuit-breaker.service.spec.ts`, `sre-error-classifier.spec.ts`, and `graceful-degradation.interceptor.spec.ts`.
