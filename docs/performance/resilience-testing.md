# Resilience & Graceful Degradation Testing (Phase 11)

## Verified Failure-Mode Protections
1. **Redis Unreachable**: `QueueService` disconnects cleanly cleanly without unhandled `error` events and seamlessly shifts to PostgreSQL `background_jobs`; `MultiTierCacheService` operates on process-local LRU L1.
2. **Embedding Provider Stall / Timeout**: `GeminiEmbeddingService` aborts stalled outbound calls at `8,000 ms` cleanly into deterministic mathematical fallback vectors.
3. **Cache Stampede Under Cold Spike**: `MultiTierCacheService.wrap()` coalesces duplicate concurrent misses into a single `factory()` call (`inflightFactories` map).
4. **PostgreSQL Unavailability**: `AppController.getReadiness()` fails loudly with `HTTP 503` while `getLiveness()` keeps container probes diagnostic rather than returning silent fake-success data.
5. **Client Retry Safety**: `http-client.ts` (`apiFetch`) retries strictly idempotent `GET`/`HEAD` requests (or `Idempotency-Key` mutations) with bounded jittered exponential backoff, preventing retry storms during partial outages.
