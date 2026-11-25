# Backend & PostgreSQL Current-State Assessment (`00`)

**Program**: Cambium Research Principal Backend & Database Engineering Program  
**Baseline Codebase**: NestJS 10 (`@nestjs/*` ^12 in workspace deps), TypeORM, PostgreSQL 16 + `pgvector` (`768`-dim HNSW), optional Redis (`ioredis`) + BullMQ with PostgreSQL fallback queues.

---

## 1. Observed Architecture & Implemented Capabilities
- **Modular Monolith (`server/src/app.module.ts`)**: Organized into domain modules (`auth`, `users`, `opportunities`, `bookmarks`, `notifications`, `projects`, `community`, `connections`, `institution`, `ingestion`, `upload`, `assistant`, `ai`, `billing`, `chat`, `events`, `audit`, `contributions`, `relationships`, `network`, `performance`).
- **Global Pipeline & Middleware (`server/src/main.ts`, `app.module.ts`)**:
  - `ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true })`
  - `NetworkRateLimiterGuard` (global `APP_GUARD`)
  - Interceptors (`TelemetryInterceptor`, `IdempotencyInterceptor`, `AuditInterceptor`, `EtagInterceptor`, `GracefulDegradationInterceptor`)
  - Transactional Outbox (`OutboxService` + `OutboxRelayService` using `FOR UPDATE SKIP LOCKED` when `DataSource` is initialized)
- **Persistence Layer (`server/src/config/database.config.ts`)**:
  - Master/Replica TypeORM configuration, SSL negotiation, `DB_POOL_MAX`, `statement_timeout`, `synchronize` gated off in production (`!isProd && DB_SYNCHRONIZE === 'true'`).
  - `schema.sql` (`33+` tables across core identity, catalog, collaborative workspaces, notifications/jobs, community, and institutional research OS).

---

## 2. Priority Defects & Engineering Debt Identified in Audit

| Priority | Category | Verified Defect / Technical Debt | Location |
| :--- | :--- | :--- | :--- |
| **P0** | Credential Serialization | `User.passwordHash` lacked `{ select: false }`; relational joins (`createdBy`, `author`, `commentAuthor`) could serialize password hashes unless stripped per service. | `server/src/modules/users/entities/user.entity.ts` |
| **P0** | Financial Concurrency | `FundingService.createExpenseRequest` and `settleExpense` read balances outside `DataSource.transaction`, risking lost updates / double-spending under concurrent requests. | `server/src/modules/institution/funding.service.ts` |
| **P0** | Authorization / BOLA | `BookmarksController.deleteBookmark` (`DELETE :id`) lacked ownership enforcement; `OpportunitiesController` `PUT/DELETE :id` lacked creator/`SuperAdmin` ownership verification. | `bookmarks.controller.ts`, `opportunities.controller.ts` |
| **P1** | Schema / Entity Drift | `Subscription` & `Invoice` entities used by `BillingModule` were missing from `database.config.ts` entity registration and `schema.sql`; `/api/billing/*` route prefix mismatched frontend caller (`BillingController` used `billing` instead of `api/billing`). | `database.config.ts`, `billing.controller.ts`, `schema.sql` |
| **P1** | Unbounded & N+1 Queries | `OpportunitiesService.findAll()` & `getUpcomingDeadlines()` lacked pagination/limits; `FundingService.listAccounts()` executed per-account `lineItemRepo.find` N+1 queries; `OpportunitiesService.bulkCreate()` called `tagRepo` outside the active transaction `QueryRunner`. | `opportunities.service.ts`, `funding.service.ts` |
| **P1** | State Machines | `ProposalsService.submitForReview` and `recordReviewDecision` allowed arbitrary status jumps (e.g., resetting finalized `APPROVED`/`REJECTED` proposals). | `proposals.service.ts` |
| **P1** | DTO & Param Validation | `CommunityController.updatePost` accepted unvalidated `Partial<CreatePostDto>`; `BillingController` accepted unvalidated inline body types; multiple `:id` params lacked `ParseUUIDPipe`; missing centralized exception mapper for Postgres `23505`/`22P02` & malformed JSON. | `community.controller.ts`, `billing.controller.ts`, controllers |
| **P1** | Ingestion Fault Tolerance | `IngestionService.crawlAndIngest` iterated crawlers sequentially without per-provider isolation (`Promise.allSettled`). | `ingestion.service.ts` |

---

## 3. Prioritized Execution Plan (In-Place Refactors Only)
1. **Tier 1 (Data Integrity & Auth Boundaries)**: Add `{ select: false }` on `User.passwordHash` + explicit `.addSelect('u.passwordHash')` in `AuthService.login`; add pessimistic write locks (`pessimistic_write`) inside `FundingService` transactions; fix bookmark/opportunity ownership checks; fix N+1 `BudgetLineItem` query and atomic `bulkCreate` tag resolution.
2. **Tier 2 (Contracts, Validation & State Machines)**: Enforce bounded pagination (`FilterOpportunityDto`, `HybridSearchService`), proposal state machine transitions, `UpdatePostDto` + `SubscribeDto`, `ParseUUIDPipe`, global `AllExceptionsFilter`, shutdown hooks (`enableShutdownHooks()`), and `validateServerEnv()`.
3. **Tier 3 (PostgreSQL Schema Parity & Indexes)**: Author additive migration `002_backend_integrity_and_indexes.sql` bringing `subscriptions` + `invoices` tables, financial `CHECK` constraints, and high-traffic composite indexes under version control.
4. **Tier 4 (Verification & Tests)**: Build dedicated backend/database unit + concurrency + contract test suite verifying every fix cleanly.
