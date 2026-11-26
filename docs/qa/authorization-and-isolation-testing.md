# Cambium Research — Authorization & Tenant Isolation Testing

## 1. Multi-Actor Access Control Matrix

| Capability | Workspace Owner / Lead PI | Accepted Collaborator | Invited (Pending) | Outsider Researcher | SuperAdmin |
| :--- | :--- | :--- | :--- | :--- | :--- |
| View `PRIVATE` Workspace | `200 Allow` | `200 Allow` | `403 Deny` | `403 Deny` | Admin Override |
| Invite Collaborators | `201 Allow` | `201 Allow` | `403 Deny` | `403 Deny` | Admin Override |
| Promote Collaborator to `LEAD_PI` | `200 Allow` | `403 Deny` | `403 Deny` | `403 Deny` | Admin Override |
| Remove Collaborator | `200 Allow` | Self-leave only (`403` others) | `403 Deny` | `403 Deny` | Admin Override |
| Download / Delete Private Artifact | `200 Allow` (owner) | `403 Deny` (owner-scoped) | `403 Deny` | `403 Deny` | `200 Allow` |

## 2. Verified Security Guarantees

- State-transition isolation is enforced end-to-end (`inviteMember` -> `respondToInvitation` -> `removeMember`) in `server/src/qa/authz-upload-resilience.spec.ts`.
- Revoking a collaborator immediately revokes access (`403 Forbidden`), with no stale read leakage.
- Cross-tenant institutional isolation checks also remain verified in `server/src/modules/institution/cross-tenant-isolation.spec.ts`.
