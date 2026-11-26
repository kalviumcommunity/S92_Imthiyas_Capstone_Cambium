# Capacity Planning & Resource Ceiling Model (Phase 12)

## 1. Limiting Infrastructure Components

| Subsystem | Active Configured Limit | Bottleneck Risk | Upgrade / Scaling Trigger |
| :--- | :--- | :--- | :--- |
| **Render Node API (Single Process)** | Single instance; 30s HTTP request timeout; starter plan sleep (~17s wake) | CPU saturation under concurrent PDF parsing or blocking sync loops | Sustained p95 > 400ms or eliminate idle sleep -> upgrade to non-sleeping Render Starter/Standard |
| **PostgreSQL Pool (`database.config.ts`)** | `DB_POOL_MAX=20`, `statement_timeout=15000ms` | Connection exhaustion if worker + API concurrency exceeds managed tier cap | Pool wait spikes or total active connections > 70% of plan max -> route through Supabase PgBouncer transaction pool (`6543`) |
| **Background Queues (`QueueService`)** | `concurrency = 4` (BullMQ) / `maxConcurrentPgJobs = 3` (PG poller), 30s job timeout | PostgreSQL poller polling overhead if queued backlog exceeds thousands of jobs | Sustained backlog > 500 queued jobs or multi-instance API -> provision managed Redis (`REDIS_URL`) |
| **Gemini AI Embedding / Synthesis** | Batch concurrency clamped `1..6`; 8s embedding timeout; 12k chat input token cap | External RPM rate limits (`429`) & variable API spend | Frequent `PROVIDER_RATE_LIMIT` telemetry -> request tier quota increase |

## 2. Early-Phase User Profile Estimate (5–25 Concurrent Researchers)
- Paginated `opportunities.findAll` (`<= 100`, default `25`) keeps response JSON small and prevents OOM under normal institutional testing once the live Render DB health issue flagged in Program 06 is resolved.
- No microservices, Kafka, or dedicated Elasticsearch cluster are justified at this stage.
