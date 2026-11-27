# Caching Safety & Asynchronous Job Architecture

## 1. Multi-Tier Cache Policy Matrix (`MultiTierCacheService`)

| Cache Key Namespace | Data Scope | Ownership / Isolation | TTL | Payload Cap | Invalidation Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `opp:stats:global` | Public catalog counts | Public non-tenant | `120s` | `<= 256 KB` | Invalidated on opportunity `create`, `bulkCreate`, `update`, `remove` |
| `public:opp:list:{type}:limit={n}` | Unfiltered public page 1 | Public non-tenant | `60s` | `<= 256 KB` | `invalidateByPrefix('public:opp:')` on opportunity mutations |
| `user:{userId}:{suffix}` | User-scoped non-sensitive summaries | Single `userId` via `wrapScoped` | `<= 60s` | `<= 256 KB` | Explicit invalidation on write; **never** shared across users |
| `org:{orgId}:{suffix}` | Organization aggregates | Single `organizationId` | `<= 120s` | `<= 256 KB` | Role & tenant check runs **before** reading cache |

> **Security Rule:** Authorization decisions, RBAC checks, document contents, and private researcher notes are **never** placed in shared public keys. Oversized payloads `> 256 KB` bypass L1 map caching automatically to prevent LRU eviction storms.

## 2. Background Jobs & Concurrency Controls (`QueueService`)

- **Dual Mode:** Uses BullMQ when `REDIS_URL`/`REDIS_HOST` is healthy; falls back cleanly to durable PostgreSQL `background_jobs` polling (`SKIP LOCKED`) when Redis is absent.
- **Bounded Concurrency:** `maxConcurrentPgJobs = 3` prevents queue workers from saturating the `DB_POOL_MAX = 20` PostgreSQL connection pool.
- **Idempotency & Retries:** Embedding jobs carry `idempotencyKey = embed:{opportunityId}` (`maxAttempts = 2`); failed jobs back off exponentially (`min(60000, 2000 * 2^(attempts-1))`) before transitioning to `DEAD`.
- **Stale Lock Recovery:** `recoverStaleRunningJobs(300_000)` automatically re-queues `RUNNING` jobs orphaned `> 5 minutes` after worker crash or restart.
