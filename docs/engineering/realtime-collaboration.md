# Real-Time Collaboration & Ephemeral Presence Architecture
## Cambium Enterprise Research Operating System
**Document ID**: `ARCH-REALTIME-PRESENCE-2026-V1`  
**Author**: Principal Real-Time Collaboration Engineer & Full-Stack Architect  
**Date**: November 19, 2026  
**Status**: `ENFORCED SPECIFICATION`  
**Repository**: `S92_Imthiyas_Capstone_Cambium`

---

## 1. Real-Time Collaboration Foundation

Cambium’s collaboration engine provides an institutional research experience comparable to Figma and Google Docs, tailored to academic grant writing, literature synthesis, and peer review.

### Real-Time Capabilities
1. **Bi-Directional Messaging & Comments**: Threaded section critiques via Socket.IO `/chat` namespace.
2. **Ephemeral Presence Tracking**: Real-time awareness of active collaborators per workspace, rendered via `PresenceBar.tsx` with green status indicators.
3. **Collaborative Section Locks (`lock_section`)**: Prevents split-brain edits when a scholar is drafting a specific methodology paragraph or budget justification.
4. **Live Cursor Telemetry (`cursor_update`)**: Synchronizes collaborator viewport and mouse coordinates across the document desk.

---

## 2. Ephemeral Presence Registry

Presence state is **temporary and in-memory**, avoiding unneeded database writes for transient connections:

```typescript
// server/src/modules/chat/chat.gateway.ts
private readonly roomPresence = new Map<string, Map<string, PresenceMember>>();
```

### Lifecycle Flow:
1. **Connect & Join**: Scholar connects with client ID. When emitting `join_room`, user details (ID, name, avatar) are registered in the room presence map.
2. **Presence Broadcast**: Gateway immediately calculates the list of active members in the room and emits `presence_update`:
   ```json
   {
     "room": "workspace:proj-1",
     "count": 2,
     "members": [
       { "id": "u-1", "name": "Dr. Imthiyas", "joinedAt": "2026-11-19T09:30:00.000Z" },
       { "id": "u-2", "name": "Dr. Elena Vance", "joinedAt": "2026-11-19T09:32:15.000Z" }
     ],
     "timestamp": "2026-11-19T09:32:15.000Z"
   }
   ```
3. **Client Store Sync**: `client/lib/hooks/useSocket.ts` receives `presence_update` and updates Zustand's `usePresenceStore`, which instantly updates `PresenceBar.tsx`.
4. **Heartbeat & Disconnect Pruning**: Sockets that disconnect or leave the room are pruned immediately, and an updated `presence_update` is fanned out to remaining occupants.
