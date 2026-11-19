# Distributed Systems & Collaborative Workspace Architecture Audit
## Cambium Enterprise Research Operating System
**Document ID**: `AUDIT-DISTRIBUTED-SYSTEMS-2026-V1`  
**Author**: Principal Distributed Systems Architect & Staff Backend Engineer  
**Date**: November 19, 2026  
**Status**: `APPROVED / BASELINE SPECIFICATION`  
**Repository**: `S92_Imthiyas_Capstone_Cambium`

---

## 1. Executive Summary & Architectural Scope

Cambium is evolving from an intelligent research repository into a **living, collaborative, multi-user research operating system**. Modern academic scholarship requires cross-institutional laboratory groups, principal investigators (PIs), postdoctoral fellows, and institutional compliance boards to edit grant proposals, critique methodologies, track revisions, and synchronize references simultaneously.

This audit evaluates the system against the core disciplines of **Distributed Systems Engineering**:
1. **Multi-User Data Isolation & Tenant Boundaries**: Preventing unauthorized cross-workspace or cross-institution information leakage.
2. **Transactional Consistency & Concurrency**: Atomic operations across entities, optimistic locking (`@VersionColumn`), and idempotency.
3. **Event-Driven Architecture & Transactional Outbox**: Atomic event persistence within database transactions to guarantee zero dual-write anomalies.
4. **Real-Time Collaboration & Presence**: Authenticated WebSockets, room-level authorization, ephemeral presence states, cursor tracking, and collaborative locks.
5. **Persistent Notification & Activity Architecture**: Deduplicated, database-backed notifications with live WebSocket/SSE streaming.

---

## 2. Capability Inventory Matrix

| Domain & Capability | Classification | Current State in Repository | Architectural Action for Sprint 01 |
| :--- | :---: | :--- | :--- |
| **Workspace & Multi-Tenancy** | `PARTIAL` | `group_projects` and `project_members` exist with CRediT roles (Lead PI, Co-PI, Co-Author). However, cross-workspace room subscriptions lack server-side gatekeeping in WebSocket gateway. | Enforce strict server-side workspace authorization on both REST endpoints and WebSocket room join subscriptions. |
| **Optimistic Concurrency Control** | `MISSING` | `GroupProject` has `updated_at` but lacks `@VersionColumn()`. Concurrent edits from multiple collaborators can silently overwrite draft sections without conflict detection. | Add `@VersionColumn()` to `GroupProject` and proposal draft entities with optimistic concurrency checks (`409 Conflict`). |
| **Transactional Outbox Pattern** | `PARTIAL` | `outbox_events` table and `OutboxService.emitWithinTransaction` exist, but domain events for workspace membership, role changes, and comments are not yet wired into the outbox. | Wire all critical workspace events (`WORKSPACE_CREATED`, `MEMBER_INVITED`, `COMMENT_CREATED`, etc.) through `OutboxService.emitWithinTransaction`. |
| **Domain Event Dispatcher** | `PARTIAL` | `EventsService` streams SSE (`/events/stream`) and `ChatGateway` handles Socket.IO, but there is no unified domain event publisher orchestrating DB transactions, outbox, and real-time broadcast. | Create unified `DomainEventDispatcher` implementing typed domain event contracts with transactional outbox logging and real-time fan-out. |
| **Real-Time Collaboration & Presence** | `PARTIAL` | `ChatGateway` handles `/chat` namespace (`join_room`, `typing`, `cursor_update`, `lock_section`). However, socket connections are unauthenticated (accept any handshake payload), and presence is client-side only without active server heartbeats. | Implement JWT/cookie token validation on WebSocket handshake, server-side room membership checks, and active presence registry with automatic disconnect pruning. |
| **Workspace Comments & Threads** | `MISSING` | Discussion desks rely on chat messages or client state. Structured research comments attached to draft sections with replies and resolution status (`OPEN` / `RESOLVED`) do not exist as a backend entity. | Create `WorkspaceComment` entity with threaded replies, author attribution, section anchors, and real-time broadcast. |
| **Persistent Notification System** | `EXISTS` | `Notification` entity exists with `is_read`, `markAsRead`, `markAllAsRead`, and SSE streaming via `EventsService`. | Wire notification creation to workspace invitations, mentions, and comment alerts with zero dual-write lag. |
| **Security Audit & Activity Logs** | `EXISTS` | `audit_logs` has recursive SHA-256 hash chaining and Merkle tree verification; `project_activity_logs` records workspace milestones. | Integrate outbox relay to automatically record administrative events in the SHA-256 cryptographic audit ledger. |
| **Background Processing & Queues** | `EXISTS` | BullMQ `QueueService` exists with in-memory fallback for ingestion, embeddings, email, and weekly digests when Redis is unavailable. | Maintain ₹0 resilience by ensuring background tasks complete gracefully with in-process queues. |
| **Idempotency & Request Protection** | `EXISTS` | `IdempotencyInterceptor` with `x-idempotency-key` prevents duplicate POST requests across `/api/grants` and project mutations. | Keep active and enforce on all workspace mutation endpoints. |

---

## 3. Architectural Weaknesses & Threat Analysis

### 3.1 Unauthenticated WebSocket Room Subscriptions (CWE-306)
- **Vulnerability**: In `server/src/modules/chat/chat.gateway.ts`, `handleJoinRoom` joined any client socket to arbitrary rooms (`client.join(room)`) without verifying whether `req.user` or the socket client possessed membership in the target workspace.
- **Risk**: An unauthorized scholar could connect to `room:private-darpa-workspace` and eavesdrop on real-time drafting messages, section locks, and cursor positions.
- **Remediation**: Inject `ProjectsService` into `ChatGateway` or a dedicated `WorkspaceGateway`. Verify that `socket.data.user.id` is an `ACCEPTED` member of `room` before allowing room subscription.

### 3.2 Dual-Write Discrepancy Risk
- **Vulnerability**: Directly broadcasting WebSocket events or creating notifications without wrapping them in the primary database transaction creates race conditions where a database write fails, but an SSE or WebSocket alert has already reached other scholars.
- **Remediation**: Apply the Transactional Outbox Pattern: all workspace mutations write to `group_projects` and `outbox_events` in the same PostgreSQL transaction (`QueryRunner` / `EntityManager`). The `OutboxRelayService` then fans out events reliably.

### 3.3 Silent Overwrite on Concurrent Section Editing
- **Vulnerability**: When two scholars simultaneously revise a proposal title or abstract, the second write silently overwrites the first without conflict notification.
- **Remediation**: Implement TypeORM `@VersionColumn({ name: 'lock_version', default: 1 })`. If the client submits a stale version, return HTTP `409 Conflict` with the latest server state so the client can merge cleanly.

---

## 4. Sprint 01 Implementation Architecture

```text
                               +-------------------------------------+
                               |         Next.js 15 Client           |
                               |  (CollaborativeProjectsDesk / Hooks)|
                               +-------------------+-----------------+
                                                   |
                             HTTP REST (JWT / Cookies) | WebSocket (/chat)
                                                   v
                               +-------------------+-----------------+
                               |         NestJS 10 Gateway           |
                               |  - SubscriptionGuard (Team Tier)    |
                               |  - WsAuthGuard / Room Authorizer    |
                               |  - IdempotencyInterceptor           |
                               +-------------------+-----------------+
                                                   |
                     +-----------------------------+-----------------------------+
                     |                                                           |
                     v                                                           v
+--------------------+---------------------+               +---------------------+---------------------+
|        Projects & Workspace Service      |               |     Real-Time Collaboration Gateway       |
|  - Multi-user RBAC & CRediT Matrix       |               |  - Authenticated Handshake (Token / Sub)  |
|  - Workspace Comments & Threads          |               |  - Workspace Room Authorization           |
|  - Optimistic Concurrency (lock_version) |               |  - Ephemeral Presence (Heartbeat / TTL)   |
+--------------------+---------------------+               +---------------------+---------------------+
                     |                                                           ^
         TypeORM Transaction (Atomic)                                            |
                     |                                                           | Real-time Fan-out
                     +-----------------------------+                             |
                     |                             |                             |
                     v                             v                             |
        +------------+-----------+    +------------+------------+                |
        |   Domain Entities      |    | Transactional Outbox    |                |
        | - group_projects       |    |   (outbox_events table) |                |
        | - project_members      |    +------------+------------+                |
        | - workspace_comments   |                 |                             |
        | - notifications        |                 v                             |
        +------------+-----------+    +------------+------------+                |
                     |                |   Outbox Relay Worker   +----------------+
                     v                | - SSE / EventsService   |
            PostgreSQL 16 DB          | - WebSocket Emitter     |
               (₹0 Budget)            | - Audit Ledger Chaining |
                                      +-------------------------+
```

---

## 5. Implementation Roadmap & Acceptance Gate

1. **Step 1**: Add `@VersionColumn()` to `GroupProject` entity to enable optimistic concurrency conflict detection.
2. **Step 2**: Create `WorkspaceComment` entity and repository supporting threaded discussions, line-anchors, and resolution status.
3. **Step 3**: Enhance `ProjectsService` to enforce atomic transactional updates, outbox event generation, and comment management.
4. **Step 4**: Upgrade `ChatGateway` to enforce room authorization and server-side ephemeral presence tracking.
5. **Step 5**: Wire persistent notification dispatch for collaborator invitations and comments.
6. **Step 6**: Run automated unit and integration suites to verify 100% test pass rate with zero regressions.
