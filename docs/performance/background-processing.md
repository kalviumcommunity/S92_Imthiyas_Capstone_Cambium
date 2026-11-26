# Background Processing & Concurrency Engineering (Phase 7)

## Durable Queue Architecture (`QueueService`)
- **Primary / Fallback Parity**: Uses BullMQ over Redis when `REDIS_URL` is healthy, transparently falling back to transactional PostgreSQL `background_jobs` (`SELECT ... FOR UPDATE SKIP LOCKED`) with zero duplicate external infra required on starter plans.
- **Concurrency & Timeout Bounds**:
  - BullMQ Workers cap per-instance concurrency at `4`.
  - PostgreSQL job polling caps batch claim size (`maxConcurrentPgJobs = 3`) and enforces a `30,000 ms` timeout race per job handler so stalled handlers never freeze worker loops.
- **Idempotency & Exponential Backoff**:
  - `addEmbeddingJob()` sets `idempotencyKey: embed:<opportunityId>`; `addIngestionJob()` deduplicates repeated crawls within 15-minute buckets.
  - Failed retries back off exponentially (`min(60000, 2000 * 2^(attempts-1))`), terminating permanently in `DEAD` status once `maxAttempts` (`2–3`) is exhausted.
