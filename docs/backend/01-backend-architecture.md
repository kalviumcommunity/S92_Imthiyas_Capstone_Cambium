# Backend Architecture & Domain Boundaries (`01`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. System Context & Runtime Topology
- **Client**: Next.js 16 App Router (`client/`) communicating over REST (`JSON`), Server-Sent Events (`/api/v1/events/stream`), and WebSockets (`/chat`).
- **API Monolith**: NestJS 10 Modular Architecture (`server/src/app.module.ts`) backed by PostgreSQL 16 (`typeorm` + `pg` + `pgvector`), with optional Redis (`ioredis`) for rate limiting, refresh-token revocation, Socket.IO adapter, and BullMQ queues (falling back gracefully to in-memory / PostgreSQL `background_jobs` when Redis is absent).

## 2. Domain & Module Ownership
| Domain | Modules | Authoritative Ownership |
| :--- | :--- | :--- |
| **Identity & Access** | `auth`, `users`, `saml` | User credentials (`users`), roles (`UserRole` 10-tier enum), JWT signing/revocation, institutional SAML federation. |
| **Discovery & Search** | `opportunities`, `ingestion`, `ai` | Canonical catalog (`research_opportunities`), taxonomy tags, Gemini `768`-dim embeddings, HNSW + GIN RRF hybrid search, 5 external crawlers. |
| **Scholar Workflows** | `bookmarks`, `notifications`, `connections`, `community`, `contributions`, `relationships` | Saved opportunities, unread notification ledger, 2-way academic connections & 1-way follows, academic posts/comments/reactions, CRediT attribution events. |
| **Workspaces & Files** | `projects`, `chat`, `upload` | Collaborative workspaces, CRediT membership, activity timeline, threaded comments, private artifact storage + OCR extraction. |
| **Institutional OS** | `institution`, `billing`, `audit` | Organizations, departments, versioned proposals + revisions/reviews, funding accounts, budget line items, expense commitments, IRB/IACUC compliance protocols, SaaS subscriptions/invoices, SHA-256 hash-chained `audit_logs`. |

## 3. Request Lifecycle
1. Express middleware parses bounded `2mb` JSON/urlencoded bodies, parses cookies, applies CORS allowlist & security headers (`main.ts`).
2. `NetworkRateLimiterGuard` enforces per-user (`req.user.id`) or verified `req.ip` sliding-window limits.
3. `TelemetryInterceptor` attaches `X-Request-Id` / W3C `traceparent` headers and records route latency histograms (`p50`/`p95`/`p99`).
4. Route guards (`JwtAuthGuard`, `RolesGuard`, `SubscriptionGuard`) validate credentials and roles.
5. `ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true })` validates and transforms DTOs.
6. Controller delegates domain logic to Injectable Services + TypeORM Repositories / Transactions (`DataSource.transaction`).
7. `AuditInterceptor` + `OutboxService` persist tamper-evident audit records and asynchronous domain events; `GracefulDegradationInterceptor` + `AllExceptionsFilter` standardize error responses without leaking internal SQL traces.
