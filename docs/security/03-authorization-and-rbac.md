# Cambium Research — Authorization Model & RBAC Matrix
**Document ID**: `CAMBIUM-SEC-03-RBAC`

## 1. Authoritative Platform Roles (`UserRole` in `user.entity.ts`)
Cambium enforces 10 institutional and scholarly roles assigned exclusively by backend administrators or trusted SSO (`SamlService`) provisioning — **never** accepted from registration bodies, query strings, or `UpdateUserDto`:
- `SuperAdmin` — Platform-level operator (cross-institution audit, ingestion, cache, system administration).
- `UniversityLeadership` — Institutional executive visibility scoped strictly to `organizationId`.
- `R&DDirector` — Institutional R&D governance scoped strictly to `organizationId`.
- `FinanceOfficer` — Grant fund/expense review & disbursement scoped to `organizationId`.
- `DepartmentHead` — Department-level oversight scoped to `organizationId` + `departmentId`.
- `PI` — Principal Investigator leading labs, grant proposals, and research projects.
- `Researcher` — Default scholar role; owns private drafts, artifacts, notifications, and bookmarks.
- `Fellow` — Affiliated funded scholar with project membership access.
- `ComplianceOfficer` — IRB, audit trail verification, and COPE redaction compliance within institution.
- `ExternalReviewer` — Restricted double-blind peer-review access scoped to assigned dossiers.

## 2. Enforced Permission Matrix

| Resource / Operation | Anonymous | Researcher / Fellow | PI / Member (Owner vs Non-Member) | Institutional Leadership / Finance / Compliance (`same orgId`) | `SuperAdmin` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Public Opportunities (`GET /research-opportunities`) | Allowed | Allowed | Allowed | Allowed | Allowed |
| Auth Register / Login / Refresh (`POST /api/auth/*`) | Allowed (Rate-limited) | Allowed | Allowed | Allowed | Allowed |
| List All Users / Create User (`GET/POST /api/users`) | **Denied (401)** | **Denied (403)** | **Denied (403)** | ComplianceOfficer: `GET` Allowed | Allowed |
| Read/Update/Delete User Profile (`GET/PUT/DELETE /api/users/:id`) | **Denied (401)** | Self Only (`id === caller.id`) | Self Only | Self Only | Allowed |
| Upload / List / Download / OCR / Delete Artifact (`/api/upload*`) | **Denied (401)** | Owner Only (`uploaderId === caller.id`) | Owner Only | Owner Only | Allowed |
| Collaborative Project Workspace (`/api/projects/:id*`) | **Denied (401)** | Active Member Only | Owner / Lead PI / Member | Org-scoped read where permitted | Allowed |
| Institutional R&D Proposals / Funding (`/api/v1/institution*`, `/funding*`) | **Denied (401)** | Scoped to own submissions & org | Scoped to own org (`organizationId`) | Allowed within same `organizationId` (Cross-tenant: **403**) | Allowed |
| Email Digest Run / Crawler Ingestion / Cache Purge | **Denied (401)** | **Denied (403)** | **Denied (403)** | **Denied (403)** | Allowed (or valid Cron Secret) |
| Cryptographic Audit Logs (`/api/v1/audit`) | **Denied (401)** | **Denied (403)** | **Denied (403)** | `ComplianceOfficer` / `UniversityLeadership` | Allowed |
