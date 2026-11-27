# Cambium Research — Research Data Ownership & Institutional Governance

## 1. Stakeholder Role Separation

Cambium explicitly separates technical platform actions from intellectual property ownership and institutional authority:

| Role | Scope of Authority | Boundaries Enforced in Code |
| :--- | :--- | :--- |
| **Account Holder / Uploader** | Owns personal profile, private bookmarks, and individually uploaded artifacts | Can view, export (`GET /api/v1/privacy/export`), or delete owned artifacts (`UploadService`); uploading to a shared project does not grant unilateral deletion rights over co-authors' records. |
| **Workspace Owner / Lead PI** | Creates `GroupProject`, configures `visibility` (`PUBLIC`/`LAB_ONLY`/`PRIVATE`), invites/removes members | Only owner or accepted Lead PI can change CRediT roles (`ProjectsService.updateMemberRole`); owner revoking a member immediately removes workspace access (`403 Forbidden`). |
| **Collaborator (Accepted Member)** | Reads/comments/links DOIs inside invited workspace (`status = ACCEPTED`) | Invited-pending or removed users are denied (`403`); collaborators cannot delete the entire project (`ownerId` check in `deleteProject`). |
| **Institutional Administrator / Officer** | Governs `organizations`, `departments`, `proposals`, `funding_accounts`, `compliance_protocols` | Tenant-isolated via `organizationId` and PostgreSQL RLS `cambium_actor_org_uuid()`; cannot unilaterally access private personal user drafts outside institutional scope. |

## 2. Departing Researcher / Workspace Exit Rules

- Leaving or being removed from a workspace via `ProjectsService.removeMember` revokes access immediately without silently deleting shared collaborative activity history or co-authored proposals.
- IP ownership disputes and institutional hold determinations are escalated out-of-band to `[INSTITUTIONAL_SPONSORED_RESEARCH_OFFICE]` / legal counsel (`docs/privacy/legal-review-register.md`).
