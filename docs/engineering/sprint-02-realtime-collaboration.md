# Sprint 02: Real-Time Collaboration Engineering & Living Workspaces

## Executive Summary & Architecture Blueprint
**Sprint ID**: `SPRINT-02-REALTIME-COLLABORATION`  
**Status**: `COMPLETED`  
**Budget**: `₹0 (Zero Paid Services, Pure In-Memory + WebSocket Gateway + Modular Monolith)`  
**Authors**: Cambium Research Platform Core Engineering  

Sprint 02 delivers the real-time collaboration engine transforming Cambium from a static drafting dashboard into an interactive, multi-scholar collaborative research operating system.

---

## 1. Real-Time Collaboration Architecture

```
                  +-----------------------------------------+
                  |         Client (React 19 / Next.js 15)  |
                  |  - CursorLayer (50ms Throttled Tracking)|
                  |  - LockOverlay (Section Soft-Locks)     |
                  |  - PresenceBar (Ephemeral Avatars)      |
                  |  - Peer Critiques & Comments Drawer     |
                  +--------------------+--------------------+
                                       |
                   WebSocket (/chat)   |   REST (/api/projects)
                                       v
                  +--------------------+--------------------+
                  |           NestJS 10 API Gateway         |
                  |  - ChatGateway (Socket.io)              |
                  |    * roomPresence (Map<room, members>)  |
                  |    * lock_section / unlock_section      |
                  |    * cursor_update -> cursor_moved      |
                  |    * new_workspace_comment broadcast    |
                  |    * comment_resolved broadcast         |
                  |  - ProjectsController                   |
                  |    * GET /projects/:id/comments         |
                  |    * POST /projects/:id/comments        |
                  |    * PUT /projects/:id/comments/:id/res |
                  +--------------------+--------------------+
                                       |
                                       v
                  +--------------------+--------------------+
                  |       PostgreSQL 16 Persistence         |
                  |  - workspace_comments table             |
                  |  - group_projects (@VersionColumn)      |
                  +-----------------------------------------+
```

---

## 2. Event Contracts & Socket Payloads

### 2.1 Presence Protocol
- **Client -> Server (`join_room`)**:
  ```json
  {
    "room": "draft:draft-satc-2026",
    "user": {
      "id": "usr-uuid",
      "name": "Dr. Elena Vance",
      "avatar": "/avatars/elena.jpg"
    }
  }
  ```
- **Server -> Room (`presence_update`)**:
  ```json
  {
    "room": "draft:draft-satc-2026",
    "members": [
      {
        "id": "usr-uuid",
        "name": "Dr. Elena Vance",
        "avatar": "/avatars/elena.jpg",
        "joinedAt": "2026-11-19T04:20:00.000Z"
      }
    ],
    "count": 1
  }
  ```

### 2.2 Section Soft-Lock Protocol
- **Client -> Server (`lock_section`)**:
  ```json
  {
    "room": "draft:draft-satc-2026",
    "sectionId": "methodology",
    "userId": "usr-uuid",
    "userName": "Imthiyas"
  }
  ```
- **Server -> Room (`section_locked`)**:
  Broadcasts lock to all connected clients in the room. Other clients render `<LockOverlay>` preventing destructive concurrent overwrites.
- **Client -> Server (`unlock_section`)**:
  Auto-released on blur, section tab switch, or disconnect.

### 2.3 Remote Cursor Tracking
- **Throttle**: 50ms interval on `mousemove` inside container bounds.
- **Payload (`cursor_update` -> `cursor_moved`)**:
  ```json
  {
    "room": "draft:draft-satc-2026",
    "userId": "usr-uuid",
    "userName": "Imthiyas",
    "x": 342,
    "y": 185,
    "color": "#3E6248"
  }
  ```

### 2.4 Threaded Peer Review Comments
- **Persistence**: Stored in PostgreSQL `workspace_comments` table with `is_resolved` status, `section_id` anchor, and `parent_id` for hierarchical discussions.
- **Broadcast**:
  - `new_workspace_comment` emitted across `workspace:${projectId}` on creation.
  - `comment_resolved` emitted across `workspace:${projectId}` on resolution.

---

## 3. UI Component Inventory
1. **`ProposalDraftsDesk.tsx`**:
   - Live ephemeral `<PresenceBar>` in metadata strip.
   - Throttled mouse position broadcast via `<CursorLayer>`.
   - Active section auto-lock on focus via `<LockOverlay>`.
   - Collapsible Peer Review & Collaborative Critiques panel with section filtering and instant resolution.
2. **`CollaborativeProjectsDesk.tsx`**:
   - Live `<PresenceBar>` alongside project visibility badges.
   - Collaborative Threaded Critiques section connected directly to backend REST endpoints (`/api/projects/:id/comments`).
   - Section anchoring (Aims, Methodology, Budget, Compliance, General).
   - Real-time resolution toggle synced over WebSockets.

---

## 4. Verification & Quality Gates
- **Zero Paid Dependencies**: ₹0 cost tier maintained.
- **Type Safety**: 100% strict TypeScript compliance across frontend and backend.
- **Design Tokens**: Conforms strictly to W3C DTCG Living Materials tokens (`#3E6248` Canopy, `#FAF7F0` Parchment, `#202920` Forest Ink, `#4ADE80` Emerald Glow).
