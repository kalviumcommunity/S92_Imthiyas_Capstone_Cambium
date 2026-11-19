# Engineering Implementation Log: Sprint 01
## Cambium Enterprise Research Operating System
**Sprint**: `SPRINT-01-DISTRIBUTED-SYSTEMS`  
**Engineer**: Shaik Mohamed Imthiyas T (Lead Architect) & AI Staff Systems Engineer  
**Date**: November 19, 2026  
**Status**: `COMPLETED / RELEASE-READY`  
**Branch**: `feature/sprint-01-distributed-systems`

---

## 1. Summary of Changes

This engineering sprint upgraded Cambium from a single-user CRUD research prototype into a **resilient, event-driven, collaborative distributed research operating system**.

### Key Deliverables:
1. **Multi-User Data Isolation & Concurrency Control**:
   - Added TypeORM `@VersionColumn({ name: 'version', default: 1 })` to `GroupProject` entity to enforce Optimistic Concurrency Control (OCC).
   - Added optimistic concurrency validation in `ProjectsService.updateProject`: stale writes with version mismatch throw `HTTP 409 Conflict`.
2. **Collaborative Workspace Comments & Discussion Threads**:
   - Created `WorkspaceComment` entity with relational links to `GroupProject` and `User`.
   - Supports line-anchors (`sectionId`), threaded replies (`parentId`), and resolution status (`isResolved`, `resolvedById`, `resolvedAt`).
   - Added REST endpoints: `GET /api/projects/:id/comments`, `POST /api/projects/:id/comments`, `PUT /api/projects/:id/comments/:commentId/resolve`.
3. **Domain Event Architecture & Transactional Outbox Integration**:
   - Wired domain events (`WORKSPACE_CREATED`, `MEMBER_INVITED`, `WORKSPACE_UPDATED`, `COMMENT_CREATED`, `COMMENT_RESOLVED`, `PUBLICATION_ADDED`) to `OutboxService`.
   - Atomic staging in `outbox_events` table ensures zero dual-write discrepancy.
4. **Real-Time Ephemeral Presence & Workspace Broadcasting**:
   - Upgraded `ChatGateway` to maintain an in-memory `roomPresence` map per room.
   - Broadcasts `presence_update` roster to active scholars on join, leave, or disconnect.
   - Connected `client/lib/hooks/useSocket.ts` to sync live presence directly into Zustand (`usePresenceStore`), powering `PresenceBar.tsx`.
   - Added real-time broadcast methods for comments (`new_workspace_comment`), resolutions (`comment_resolved`), and invitations (`member_invited`).
5. **Persistent Notification Integration**:
   - Automated creation of persistent `Notification` records and real-time SSE dispatch for collaboration invitations and workspace comments.

---

## 2. Test Verification Ledger

- **NestJS Unit Tests (Vitest)**: `124/124 passed` across 25 test files (`45.8s`)
  - Added new unit test suite in `projects.service.spec.ts` covering optimistic locking (`409 Conflict`), comments, outbox events, and notifications.
- **Monorepo Unit Tests (Jest)**: `82/82 passed` across 9 test suites (`1.0s`)
- **Total Test Pass Rate**: `100% (206/206 passing)`
- **Next.js Production Build**: `54/54 static and dynamic routes compiled successfully` (0 errors)
- **NestJS TypeScript Build (`tsc`)**: `Exit code 0 (0 errors)`
