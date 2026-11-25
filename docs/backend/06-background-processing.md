# Background Processing & Event Delivery (`06`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. Existing Queue & Outbox Infrastructure
Cambium preserves a two-tier asynchronous architecture without adding external orchestration bloat:
1. **Redis BullMQ + PostgreSQL Durable Queue Fallback (`server/src/common/queues/queue.service.ts`)**:
   - Registers 4 domain queues (`ingestion`, `embedding`, `email`, `deadline-digest`).
   - Automatically degrades cleanly to the PostgreSQL `background_jobs` table (`idempotency_key` unique index, `attempts`, `max_attempts`, exponential/scheduled `run_at`) when Redis is unavailable.
2. **Transactional Outbox Relay (`server/src/common/outbox/outbox-relay.service.ts`)**:
   - Polls pending `outbox_events` on an interval using PostgreSQL `FOR UPDATE SKIP LOCKED` when initialized, broadcasting real-time events via SSE (`EventsService`) and Socket.IO (`ChatGateway`) and clearing safely on module teardown (`OnModuleDestroy`).
3. **Resilient PDF OCR Fallback (`server/src/modules/upload/ocr/pdf-ocr.service.ts`)**:
   - Attempts worker-thread parsing and gracefully falls back in-process when worker build artifacts are unavailable in test/dev runtimes.
