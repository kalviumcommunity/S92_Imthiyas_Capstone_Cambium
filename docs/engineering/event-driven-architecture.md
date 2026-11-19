# Event-Driven Architecture & Transactional Outbox
## Cambium Enterprise Research Operating System
**Document ID**: `ARCH-EVENTS-OUTBOX-2026-V1`  
**Author**: Principal Distributed Systems Architect & Staff Backend Engineer  
**Date**: November 19, 2026  
**Status**: `ENFORCED SPECIFICATION`  
**Repository**: `S92_Imthiyas_Capstone_Cambium`

---

## 1. Event-Driven Application Overview

Cambium employs an **in-process, PostgreSQL-backed event-driven architecture** that models critical business milestones across research discovery, grant preparation, and institutional peer review.

### Why Not Kafka or RabbitMQ?
For a student-budget, ₹0 operational cost platform, deploying Kafka clusters or RabbitMQ brokers adds unnecessary infrastructure overhead, RAM consumption, and failure modes. Instead, Cambium uses:
- **Transactional Outbox (`outbox_events` table in PostgreSQL)** for guaranteed durability.
- **RxJS `Subject` Event Bus (`EventsService`)** for in-process reactive dispatch.
- **Server-Sent Events (SSE) & WebSockets** for live delivery to client browsers.

---

## 2. Domain Event Catalog

| Event Name | Aggregate Type | Trigger Condition | Downstream Consumers |
| :--- | :---: | :--- | :--- |
| `WORKSPACE_CREATED` | `group_projects` | Lead PI initializes collaborative research workspace. | SSE alert, Activity Log, Telemetry. |
| `WORKSPACE_UPDATED` | `group_projects` | Metadata, grant target, or visibility modified. | WebSocket room broadcast (`workspace_updated`), Activity Log. |
| `MEMBER_INVITED` | `project_members` | Collaborator invited with CRediT authorship role. | Persistent Notification created, SSE alert dispatched, WebSocket roster update. |
| `MEMBER_ROLE_CHANGED`| `project_members` | Author promoted (e.g. Co-Author to Co-PI). | Notification, SHA-256 Audit Log. |
| `COMMENT_CREATED` | `workspace_comments` | Researcher adds section critique or review note. | WebSocket room broadcast (`new_workspace_comment`), Notification to owner/parent. |
| `COMMENT_RESOLVED` | `workspace_comments` | Discussion thread marked as resolved by collaborator. | WebSocket room broadcast (`comment_resolved`), Activity Log. |
| `PUBLICATION_ADDED` | `group_projects` | OpenAlex / PubMed DOI linked to literature vault. | Research contribution ledger, Activity Log. |
| `OPPORTUNITY_SAVED` | `bookmarks` | Scholar bookmarks grant RFP. | Recommendation engine, weekly digest queue. |

---

## 3. Transactional Outbox Pattern

The Transactional Outbox Pattern guarantees **at-least-once delivery** without dual-write inconsistency:

```sql
BEGIN TRANSACTION;
  -- 1. Mutate primary domain entity
  INSERT INTO group_projects (id, title, owner_id, version, ...)
  VALUES ('proj-1', 'NIH R01 Proposal', 'u-1', 1, ...);

  -- 2. Stage domain event in the exact same transaction
  INSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload, status)
  VALUES ('evt-1', 'group_projects', 'proj-1', 'WORKSPACE_CREATED', '{"ownerId":"u-1"}', 'PENDING');
COMMIT;
```

If the server crashes immediately after commit, the event remains securely recorded in `outbox_events`. The background `OutboxRelayService` polls for `PENDING` events with exponential backoff, dispatches them to SSE/WebSocket subscribers, and marks them `PUBLISHED`.
