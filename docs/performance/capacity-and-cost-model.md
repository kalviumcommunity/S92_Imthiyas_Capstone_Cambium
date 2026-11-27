# Capacity Model & Infrastructure Cost Analysis

**Principle:** Never equate registered accounts with simultaneous active users, and never fabricate cloud pricing. Every scenario below states explicit workload assumptions.

---

## 1. Workload Assumptions Per Active Concurrent Researcher

| Parameter | Baseline Assumption |
| :--- | :--- |
| Active API request rate | `6–10 req/min` during active discovery/reading bursts (~`0.15 req/s` sustained avg) |
| Heavy workflows | `1–2` hybrid searches/min, `0.2` AI chat prompts/min, `0.1` PDF uploads/min |
| PostgreSQL pool footprint | Single NestJS API process `DB_POOL_MAX = 20` (`3` max background workers + up to `17` concurrent HTTP DB checkouts) |

---

## 2. Capacity Planning Scenarios (Single Render Starter Monolith + Single PG 16)

| Scenario | Simultaneous Active Researchers | Peak API Throughput Est. | First Likely Bottleneck | Required Engineering / Infra Action |
| :--- | :--- | :--- | :--- | :--- |
| **10 Active (Mentor Eval)** | `10` (`~1.5–5 req/s`) | Easily absorbed | Cold external Gemini / OpenAlex latency without timeouts | `AbortSignal.timeout(8–12s)` + `RequestTimeoutInterceptor` (implemented in Sprint 1) |
| **50 Active** | `50` (`~8–15 req/s`) | Within single Node process if reads hit indexes & L1 cache | Render Starter `512 MB` RAM under concurrent file OCR/PDF buffers | Bound upload concurrency & keep L1 cache payload cap `<= 256 KB` |
| **100 Active** | `100` (`~15–30 req/s`) | Approaching single-core CPU saturation during multi-join writes | PostgreSQL `max_connections` & Node event-loop lag on JSON serialization | Enable PgBouncer transaction pooling (`POSTGRES_PGBOUNCER_PORT`) + upgrade API to `>= 1–2 GB RAM` instance |
| **500 Active** | `500` (`~75–150 req/s`) | Requires horizontal API scaling (`2–3` replicas) + Managed Redis | Shared L1 in-memory rate limits & single PG primary write/CPU pressure | Managed Redis L2 (`REDIS_URL` for cache/Socket.IO/rate-limit) + separate worker process (`QueueService`) |
| **1,000 Active** | `1,000` (`~150–300 req/s`) | Multi-replica API + dedicated worker + read replica | Heavy vector/aggregate analytics reads competing with OLTP writes | Configure `POSTGRES_REPLICA_HOST` (already supported in `database.config.ts`) for dashboard/reporting reads |

---

## 3. Infrastructure & AI Cost Drivers Tracked (No Fabricated Vendor Quotes)

Cost must be computed directly from monthly vendor invoices divided by [`ProductAnalyticsService`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/analytics/product-analytics.service.ts) and [`AiObservabilityService`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/analytics/ai-observability.service.ts) telemetry:
- **Cost per Active Researcher** = `(Vercel + Render Web + Render PG/Supabase + Storage + AI Spend) / MAU (HUMAN)`
- **Cost per Successful AI Workflow** = `AiObservabilityService.tokensAndCost.costPerSuccessfulWorkflowUsd` (deterministic offline fallbacks cost `$0.00`).
- **Waste Reduction Lever:** Request timeouts + bounded pagination + `maxPayloadBytes=256KB` + GIN FTS indexing reduce failed/retried spend and slow DB compute hours.
