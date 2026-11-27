# ADR 0007: L1/Optional-Redis Caching & Durable PostgreSQL Job Queues

- **Status:** `ACCEPTED` (`VERIFIED` in codebase)
- **Date:** 2026-11-28 (Formalized from Sprint 02–05 & Program 10 implementations)
- **Scope:** `server/src/modules/performance/multi-tier-cache.service.ts`, `server/src/common/queues/queue.service.ts`

## Context
Single-node and starter-tier cloud deployments (Render Starter) must handle repeated catalog reads, notifications, and asynchronous embeddings/email/ingestion work without requiring an external Redis server for local development or single-instance availability.

## Decision
1. **MultiTierCacheService:** Store bounded hot public slices (`<= 256 KB`, max `1,000` L1 map entries) in-memory with optional L2 Redis write-through and explicit key scoping (`public:*`, `user:{id}:*`, `org:{id}:*`).
2. **QueueService:** Use BullMQ queues when `REDIS_URL` / `REDIS_HOST` is reachable, and automatically fall back to PostgreSQL `background_jobs` rows (`SKIP LOCKED` pessimistic write lock, `maxConcurrentPgJobs = 3`, exponential backoff, dead-letter transitions, and stale `RUNNING` recovery).

## Alternatives Considered
- Mandatory external Redis + dedicated Celery/RabbitMQ cluster from day one (rejected: increases local onboarding friction and baseline monthly infrastructure spend).

## Consequences
- Zero-dependency local startup (`npm run dev`) without Redis installed.
- If horizontal scaling reaches `>= 2` API instances, provisioning managed Redis via `REDIS_URL` becomes mandatory so L1 caches and rate-limit buckets remain consistent across nodes.
