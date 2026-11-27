# Cambium Research — Product Analytics & Observability Program Overview

> **Baseline Audit Date**: November 2026 (against `main` `f15662d`)  
> **Architecture Stack**: Next.js 15 App Router + React 19, NestJS 10, PostgreSQL 16 + pgvector, Redis fallback cache/queues. Zero paid third-party SaaS analytics vendors (`PostHog`, `Segment`, `Mixpanel`, `Datadog`, `Sentry`) are installed or required.

## 1. Two Distinct Questions

1. **Product Analytics**: Are researchers reaching meaningful value (discovering and saving relevant opportunities, creating workspaces, ingesting papers, collaborating, and completing grounded AI workflows)?
2. **Technical & AI Observability**: Can engineers detect, diagnose, and fix latency spikes, failed database/queue operations, frontend crashes, and AI cost/retrieval degradation without logging confidential research data?

## 2. Phase 0 Reconnaissance Findings

| Area | Existing Codebase Assets | Baseline Status |
| :--- | :--- | :--- |
| **HTTP Traces & Percentiles** | `TelemetryService`, `TelemetryInterceptor`, `TelemetryController` (`/api/telemetry/metrics`, `/traces`, `/otlp/v1/traces`) | `PASS` (HTTP layer) |
| **DB & Queue Diagnostics** | `DatabaseDiagnosticService` (`/api/database/diagnostics`), `QueueService.getMetrics()` | `PARTIAL` (lacks oldest job age, lock count, alert rules) |
| **Structured JSON Logging** | Uses default `NestJS Logger` string messages | `NOT IMPLEMENTED` |
| **Canonical Business Events & Funnels** | No canonical `analytics_events` repository or activation cohort calculations | `NOT IMPLEMENTED` |
| **AI Cost, Tokens & Eval Telemetry** | `AssistantService`, `GeminiEmbeddingService`, `LlmAutocompleteService` without token/cost/eval metrics | `NOT IMPLEMENTED` |
| **Frontend Error Beacon** | `client/app/(protected)/error.tsx` only logs to `console.error` | `FAIL` |
| **Dedicated Intelligence Dashboards** | Only security audit table (`/audit`) exists; no product/engineering/AI/institutional dashboards | `NOT IMPLEMENTED` |

## 3. Implementation Design (Three Separated Layers)

- **Layer A — Product Analytics**: Authoritative backend-emitted domain events + deduplicated cohort/funnel reporting (`analytics_events`), strictly excluding test/guest/health noise.
- **Layer B — Technical Observability**: Scrubbed structured JSON logs, latency percentiles, queue oldest-job age, DB locks/slow queries, frontend sanitized error beacons, and threshold-based alert evaluation.
- **Layer C — AI Observability & Cost Intelligence**: Token estimates, USD cost estimates, latency, citation count, fallback rate, cost per successful workflow, and versioned synthetic RAG Recall@K evaluation.
