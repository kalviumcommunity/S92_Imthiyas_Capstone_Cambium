# Engineering Implementation Log: Sprints 01–04
## Cambium Enterprise Research Operating System
**Engineering Scope**: Distributed Systems Security · Real-Time Collaboration · Network & SRE Hardening · Institutional Proof-of-Value OS  
**Date**: November 25, 2026  
**Budget**: `₹0 (Modular Monolith: Next.js 15 / React 19 / NestJS 10 / PostgreSQL 16 + pgvector / Optional Redis)`

---

## 1. Sprint 01 — Distributed Systems Foundation & Security Hardening (`sprint/01-distributed-systems-security`)
- Unified JWT secret/token resolution via `server/src/modules/auth/jwt.config.ts` (supports Bearer header and cookies).
- Extended `UserRole` with institutional roles (`SuperAdmin`, `UniversityLeadership`, `R&DDirector`, `FinanceOfficer`, `DepartmentHead`) and tenant scoping columns (`organization_id`, `department_id`).
- Enforced `@UseGuards(JwtAuthGuard)` across `ProjectsController`, `CommunityController` mutations, `ConnectionsController`, `BookmarksController`, `ContributionsController` mutations, `AuditController` (`RolesGuard`), `EventsController`, and `OutboxController` (`RolesGuard`), eliminating unauthenticated `x-user-id` spoofing.
- Upgraded `ChatGateway` (`server/src/modules/chat/chat.gateway.ts`) with JWT handshake authentication, workspace membership validation (`authorizeRoomAccess`), server-verified sender identities, authoritative section soft-locks, disconnect lock cleanup, and live diagnostics counts.
- Fixed SSE user-event filter leak in `EventsService.getStream` when subscriber identity is absent.
- Wrapped workspace mutations (`inviteMember`, `respondToInvitation`, `updateMemberRole`, `linkDoi`, `updateProject`, `addComment`, `resolveComment`, `removeMember`) in single PostgreSQL transactions (`DataSource.transaction`) with `OutboxService.emitWithinTransaction`.
- Upgraded `OutboxRelayService` to claim batches with PostgreSQL `FOR UPDATE SKIP LOCKED` and route workspace/user events with deduplicable `eventId`s.

## 2. Sprint 02 — Real-Time Collaborative Workspaces, Persistent Notifications & Durable Jobs (`sprint/02-realtime-collab-notifications-jobs`)
- Extended `Notification` with `type`, `title`, `projectId`, `link`, `readAt`, and unique partial `dedupKey` index.
- Enforced ownership validation in `NotificationsController` & `NotificationsService` (`ForbiddenException` on cross-user access), added pagination + `GET /api/v1/notifications/count`.
- Created PostgreSQL-backed `BackgroundJob` (`background_jobs` table) and `SKIP LOCKED` poller in `QueueService` with exponential backoff and `DEAD` status transitions for crash-safe ₹0 background processing without Redis.
- Updated `useSocket.ts` to auto-rejoin rooms on reconnect and expose `reconnectCount` + `eventId` deduplication; updated `useRealtimeEvents.ts`, `notifications/page.tsx`, `GlobalSidebar.tsx`, and `CollaborativeProjectsDesk.tsx` to hydrate live DB data and resync on reconnect.

## 3. Sprint 03 — Network Engineering, Communication Reliability & SRE (`sprint/03-network-sre-resilience`)
- Removed wildcard CORS fallback in `server/src/main.ts`, enabled `forbidNonWhitelisted: true`, enforced 2MB JSON/urlencoded body limits, HSTS in production, and HTTP keep-alive/request timeouts.
- Hardened `NetworkRateLimiterGuard` to ignore spoofable `x-user-id` headers and bound it globally via `APP_GUARD`.
- Wired `NetworkDiagnosticsService` to live `ChatGateway.getDiagnosticsSummary()`, added `X-Request-Id` propagation in `TelemetryInterceptor`, and protected `TelemetryController` with `RolesGuard`.
- Configured `DB_POOL_MAX` (default 20) and `statement_timeout` (default 15,000ms) in `database.config.ts`.
- Created unified `client/lib/http-client.ts` (`apiFetch`) with `X-Request-Id`, `AbortController` timeouts, single-flight 401 token refresh, and exponential jittered retry strictly restricted to safe/idempotent requests (`GET`/`HEAD` or explicit `Idempotency-Key`).

## 4. Sprint 04 — Institutional Enterprise Research OS (`sprint/04-institutional-research-os`)
- Added `InstitutionModule` (`server/src/modules/institution/`) backed by 11 normalized PostgreSQL tables (`organizations`, `departments`, `proposals`, `proposal_revisions`, `proposal_reviews`, `funding_accounts`, `budget_line_items`, `expense_requests`, `project_milestones`, `project_risks`, `compliance_protocols`).
- Implemented strict cross-department/cross-organization access control (`assertTenantRecordAccess`), optimistic locking on proposals, auditable funding governance (`REQUESTED` / `APPROVED` / `SANCTIONED` / `RECEIVED` / `COMMITTED` / `SPENT` / `AVAILABLE`), compliance review authority gates, and Executive Command Centre KPI aggregations (`/api/v1/institution/overview`).
- Connected `/grants`, `/lab`, `/compliance`, and `ProposalDraftsDesk` to live backend APIs and configured `render.yaml` `startCommand` to execute idempotent `schema.sql` synchronization cleanly on deployment.
