# Alerting Policy & Thresholds

**Evaluator:** `AlertEvaluatorService` (`server/src/modules/analytics/alert-evaluator.service.ts`)  
**Surface:** `GET /api/v1/analytics/dashboards/engineering` (`alerts[]`)

| Alert ID | Condition | Severity | Actionable Runbook |
| :--- | :--- | :--- | :--- |
| `ERROR_RATE_HIGH` | `totalRequests >= 20 && errorRatePercent > 10` | `CRITICAL` | `RB-OBS-01` |
| `ERROR_RATE_HIGH` | `totalRequests >= 10 && errorRatePercent > 3` | `WARNING` | `RB-OBS-01` |
| `LATENCY_P95_ELEVATED` | `p95LatencyMs > 2000` | `CRITICAL` | `RB-OBS-02` |
| `LATENCY_P95_ELEVATED` | `p95LatencyMs > 750` | `WARNING` | `RB-OBS-02` |
| `DB_SATURATION_OR_LOCKS` | `activeConnections / maxConnections >= 0.85` OR `activeLocks >= 5` | `CRITICAL` | `RB-OBS-03` |
| `DB_SATURATION_OR_LOCKS` | `slowQueriesCount >= 3` | `WARNING` | `RB-OBS-03` |
| `QUEUE_BACKLOG_STALE` | `oldestPendingJobAgeSeconds > 1800` OR `deadJobsCount >= 5` | `CRITICAL` | `RB-OBS-04` |
| `QUEUE_BACKLOG_STALE` | `oldestPendingJobAgeSeconds > 300` OR `deadJobsCount >= 1` | `WARNING` | `RB-OBS-04` |
| `CIRCUIT_BREAKER_OPEN` | Any upstream breaker in `OPEN` state | `WARNING` | `RB-OBS-05` |
| `AI_FAILURE_SPIKE` | `aiCallsCount >= 5 && aiFailureOrFallbackRatePct > 25` | `WARNING` | `RB-OBS-06` |

Alerts are evaluated with minimum sample guards (`>= 10` / `>= 20` requests, `>= 5` AI calls) to eliminate noisy false positives during low-traffic startup periods.
