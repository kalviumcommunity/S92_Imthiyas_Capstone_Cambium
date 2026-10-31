# Cambium Research Platform
## Transparent Engineering Disclosure & Known System Limitations

---

### Audit Information
- **Document ID**: `CAMBIUM-LIMITATIONS-2026-V1`
- **Scope**: Production Boundary Conditions, Sandboxed Fallbacks & Operational Edge Cases
- **Auditor**: Principal Architecture Review Board

---

## 1. Local Resilient Simulation Fallbacks

To ensure that Cambium installs, compiles, and runs out-of-the-box across development, CI/CD, and diverse staging environments without hard dependencies on paid SaaS subscriptions, several external integrations feature robust in-process fallback handlers. In production, these must be configured with enterprise provider credentials:

### 1.1 Outbox Email Dispatch (`server/src/modules/email/email.service.ts`)
- **Current Default**: In the absence of an active `RESEND_API_KEY`, the `EmailService` redirects transactional alerts (weekly digests, grant match notifications) to a structured in-memory simulated outbox.
- **Production Action**: Set `RESEND_API_KEY=re_live_...` in environment secrets to dispatch real RFC 822 emails via Resend's edge infrastructure.

### 1.2 InCommon / Shibboleth SAML 2.0 (`server/src/modules/auth/saml/saml.service.ts`)
- **Current Default**: Provides built-in mock Identity Provider (IdP) endpoints for Harvard, Oxford, and MIT with simulated cryptographic assertions for local testing.
- **Production Action**: In production university deployments, upload the institutional IdP XML metadata certificate to `config/saml/idp-metadata.xml` and configure `SAML_ENTRY_POINT` and `SAML_ISSUER`.

### 1.3 Distributed Caching & Redlock (`server/src/common/redis/redis.service.ts`)
- **Current Default**: If a physical Redis instance is not reachable, the service logs an operational warning and automatically switches to an in-memory Map cache with millisecond TTL expiration.
- **Production Action**: Supply a clustered or managed Redis instance (e.g. AWS ElastiCache, Upstash) via `REDIS_HOST` and `REDIS_PORT` for multi-node deployments.

### 1.4 PDF OCR & Ingestion (`server/src/modules/upload/ocr/pdf-ocr.service.ts`)
- **Current Default**: Extracts text layers using native PDF parser. For scanned non-searchable PDFs, if native worker threads are unavailable, it uses sandboxed synchronous text extraction.
- **Production Action**: In heavy production workloads processing thousands of scanned scanned archival papers daily, provision an external Celery/BullMQ worker cluster with dedicated OCR engines.

---

## 2. Scalability Boundaries & Guidance

- **Database Concurrency**: The default PostgreSQL pool handles up to 100 concurrent connection leases. For institutional deployments exceeding 10,000 active researchers, deploy PgBouncer connection pooling and configure read replicas for `GET /opportunities` and `GET /publications`.
- **Vector Embedding Latency**: High-volume batch ingestion of >10,000 papers should be scheduled during off-peak hours using the background job processor to avoid rate-limiting on Gemini embedding endpoints.

