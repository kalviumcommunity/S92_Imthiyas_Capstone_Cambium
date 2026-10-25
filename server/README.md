<div align="center">

<img src="../client/public_logo/cambium-logo-light.svg" width="56" height="56" alt="Cambium Server Logo" />

# @cambium/server
### Enterprise Backend API & Vector Engine · NestJS 10 & TypeORM
**PostgreSQL 16 + pgvector HNSW · Redis 7 Cluster · InCommon SAML 2.0 · OpenTelemetry**

[![NestJS](https://img.shields.io/badge/NestJS-10.4-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20+%20pgvector-336791?style=flat-square&logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![Redis](https://img.shields.io/badge/Redis-7.2%20Alpine-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%20Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0%20Passing-FCC72B?style=flat-square&logo=vitest&logoColor=black)](https://vitest.dev/)
[![OpenTelemetry](https://img.shields.io/badge/OpenTelemetry-Tracing%20Active-000000?style=flat-square&logo=opentelemetry&logoColor=white)](https://opentelemetry.io/)

</div>

---

## 📌 Package Overview

`@cambium/server` is the computational engine and system of record for the **Cambium Enterprise Research Operating System**. Engineered with **NestJS 10**, it provides high-throughput relational persistence, sub-50ms high-dimensional vector similarity search via `pgvector`, distributed caching with Redis 7, InCommon / SAML 2.0 federated authentication, sandboxed PDF OCR workers, and real-time collaboration gateways.

---

## 📂 Architecture & Directory Structure

```
server/
├── src/
│   ├── common/                         # Enterprise decorators, guards, interceptors & infrastructure
│   │   ├── adapters/                   # Redis-backed Socket.io cluster adapter
│   │   ├── decorators/                 # @CurrentUser, @EdgeCache, @Idempotent
│   │   ├── interceptors/               # Audit logging, edge caching, idempotency
│   │   ├── outbox/                     # Transactional outbox event relay engine
│   │   ├── queues/                     # BullMQ task queues & crawler workers
│   │   ├── redis/                      # Redis client, Redlock distributed locking
│   │   ├── services/                   # Cloudflare cache purge & edge sync
│   │   ├── telemetry/                  # OpenTelemetry distributed tracing & Sentry
│   │   └── transformers/               # pgvector binary & array serialization
│   ├── config/                         # Strongly-typed environment validation
│   ├── database/                       # TypeORM migrations, schemas & disaster recovery
│   │   ├── entities/                   # Relational & audit log entities
│   │   ├── seeds/                      # Deterministic development seed fixtures
│   │   └── schema.sql                  # Canonical PostgreSQL + pgvector DDL
│   ├── modules/                        # Domain-driven NestJS modules
│   │   ├── ai/                         # Gemini text-embedding-004 vector pipeline
│   │   ├── assistant/                  # Multi-agent scholarly co-pilot service
│   │   ├── auth/                       # JWT rotating tokens & InCommon SAML 2.0 SSO
│   │   ├── bookmarks/                  # Saved grants, collections & tags
│   │   ├── chat/                       # WebSocket real-time collaboration gateway
│   │   ├── email/                      # Deadline digest & notification dispatchers
│   │   ├── events/                     # Server-Sent Events (SSE) notification streams
│   │   ├── ingestion/                  # Grants.gov & OpenAlex background scrapers
│   │   ├── notifications/              # In-app notifications & scholar alert inbox
│   │   ├── opportunities/              # Hybrid search (pgvector HNSW + GIN FTS)
│   │   ├── reader/                     # PDF extraction & grounded citation parser
│   │   ├── relationships/              # 2D graph citation edge calculations
│   │   ├── upload/                     # Sandboxed worker-thread PDF OCR engine
│   │   └── users/                      # Scholar profiles, ORCID & lab affiliations
│   ├── app.controller.ts               # Core system health & ping endpoints
│   ├── app.module.ts                   # Root application container & dependency wiring
│   └── main.ts                         # Application bootstrap, Swagger & CORS config
├── uploads/                            # Research artifact uploads & storage (.gitkeep)
├── package.json                        # Backend dependencies & script definitions
├── tsconfig.json                       # Strict TypeScript 5.7 configuration
└── vitest.config.mjs                   # Vitest unit & integration test configuration
```

---

## ⚡ Available NPM Scripts

Run all commands from the `server/` directory or use root npm scripts with `--prefix server`:

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `npm run start:dev` | Starts NestJS with hot-reload watch on `http://localhost:5000` |
| `build` | `npm run build` | Compiles production TypeScript bundle via `tsc` |
| `start` | `npm run start:prod` | Runs compiled production server (`dist/main.js`) |
| `test` | `npm run test` | Runs the Vitest test suite (18 suites, 73 tests) |
| `test:cov` | `npm run test:cov` | Executes tests with code coverage analysis |
| `lint` | `npm run lint` | Runs ESLint with zero-warning threshold |

---

## 🛡️ Enterprise Core Capabilities

### 1. Vector Hybrid Search (`pgvector` HNSW + GIN FTS)
Combines dense 768-dimensional embeddings generated by Google Gemini (`text-embedding-004`) with PostgreSQL full-text search (`tsvector`), blended using Reciprocal Rank Fusion (RRF) for sub-50ms opportunity matches.

### 2. Distributed Redis 7 Infrastructure
- **`@EdgeCache(ttl)`**: Interceptor caching idempotent responses in Redis with automatic cache invalidation.
- **`@Idempotent(ttl)`**: Guarantees exactly-once processing for grant applications and financial mutations.
- **`RedlockService`**: Distributed Redis locks preventing race conditions during concurrent crawler ingestion.

### 3. Federated Scholar Identity (InCommon & SAML 2.0)
Full enterprise Single Sign-On allowing university scholars to authenticate via Harvard, Oxford, MIT, and InCommon identity providers (`/api/v1/auth/saml/login`).

### 4. Sandboxed Worker-Thread PDF OCR Engine
Extracts full-text research papers using isolated Node.js `worker_threads`, preventing CPU starvation of the main event loop while enforcing strict filename sanitization and SHA-256 deduplication.

### 5. Automated Disaster Recovery & Integrity Verification
Automated backup scripts ([`scripts/backup-db.sh`](../scripts/backup-db.sh), [`scripts/backup-db.ps1`](../scripts/backup-db.ps1)) execute daily `pg_dump` with `gzip -9`, calculate cryptographic SHA-256 hashes, maintain a 7-day local rolling window, and support point-in-time recovery (PITR) per [`docs/DISASTER_RECOVERY_PLAYBOOK.md`](../docs/DISASTER_RECOVERY_PLAYBOOK.md).

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure PostgreSQL 16 and Redis 7 are running (via Docker Compose: `docker-compose up -d postgres redis`).

---

<div align="center">
  <sub>Part of the Cambium Enterprise Research Monorepo · Lead Architect: Shaik Mohamed Imthiyas T</sub>
</div>
