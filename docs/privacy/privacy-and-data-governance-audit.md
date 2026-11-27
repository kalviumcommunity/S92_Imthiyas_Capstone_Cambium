# Cambium Research — Baseline Privacy & Data Governance Audit (Phase 0)

> **Audit Scope**: Read-only code and schema inspection conducted on `main` (`f15662d`) prior to Privacy Program 09 remediation.
> **Legal Disclaimer**: Status evaluations below assess technical and organizational governance readiness only and do not constitute legal certification.

## 1. Status Legend

- `PASS`: Implemented in code/schema and verified.
- `PARTIAL`: Partially implemented or guarded in only one layer (e.g., frontend-only or incomplete cascade).
- `FAIL`: Missing control or misleading/decorative behavior discovered in production code.
- `BLOCKED`: Requires external legal review, vendor DPA inspection, or organizational incorporation details.
- `NOT APPLICABLE`: No relevant processing activity observed in repository.

## 2. Baseline Pre-Remediation Control Assessment

| Domain | Observed Repository Reality | Baseline Status | Planned Remediation Sprint |
| :--- | :--- | :--- | :--- |
| **Data Inventory & Classification** | 30+ TypeORM entities (`users`, `group_projects`, `proposals`, `audit_logs`, etc.) and local upload disk storage exist without explicit privacy classification tags (`PUBLIC`/`INTERNAL`/`CONFIDENTIAL`/`RESTRICTED`) on uploaded artifacts. | `PARTIAL` | Sprints 0, 2 |
| **Settings Privacy Toggles** (`client/app/(protected)/settings/page.tsx`) | `PrivacySection` switches (`profilePublic`, `showInstitution`, `showPublications`, `allowSearch`) trigger a toast (`"Privacy settings saved."`) without calling any backend API. | `FAIL` | Sprints 1, 3 |
| **Consent Banner & History** (`client/components/CookieConsent.tsx`) | Persists `{ level, timestamp }` exclusively in `localStorage` (`cambium-cookie-consent`) with no notice version, withdrawal path, or backend consent ledger. | `PARTIAL` | Sprints 1, 3 |
| **Privacy Notice Contacts** (`client/components/legal/PrivacyContent.tsx`) | Displays unverified corporate/DPO strings (`Cambium Research Intelligence Technologies Inc.`, `77 Massachusetts Avenue`, `dpo@cambium.mit.edu`). | `FAIL` | Sprint 3 |
| **Data Export** (`settings/page.tsx` + `scholar-export.ts`) | `handleExportArchive` uses client-side state/fallback values rather than an authorized, audit-logged server export scoped strictly to caller records. | `PARTIAL` | Sprint 3 |
| **Account & Derived Data Erasure** (`settings/page.tsx`, `UsersService.delete`) | UI `handleDecommissionAccount` only removes 3 `localStorage` keys and redirects; backend `UsersService.delete` removes `users` row without deleting `UploadService` disk artifacts or recording lifecycle states/exceptions. | `FAIL` | Sprints 1, 3 |
| **AI Provider Transmission & Retrieval Authorization** (`AssistantService`, `GeminiEmbeddingService`) | Sends `context.documentSnippet` and prompts directly to `generativelanguage.googleapis.com` without pre-flight user AI consent check or restricted-document / workspace authorization check. | `FAIL` | Sprint 2 |
| **Audit Logging Minimization** (`AuditInterceptor`) | Copies raw `req.body` (redacting only `password`, `refreshToken`, `token`) into immutable `audit_logs.payload` JSONB, risking storage of confidential research prompts/abstracts. | `FAIL` | Sprint 2 |
| **Third-Party Provider DPAs & Region Terms** | Code integrates Supabase, Vercel, Render, Google Gemini API, and scholarly APIs (OpenAlex/ORCID/CrossRef/arXiv/DOAJ); provider contractual DPAs and retention configs cannot be verified from source code alone. | `BLOCKED` | Sprint 4 (tracked in Legal & Vendor Registers) |
| **India DPDP Phased Commencement Readiness** | India DPDP Rules 2025 feature phased commencement (initial provisions on 13 November 2026; principal Rules 3, 5–16, 22, 23 scheduled for 13 May 2027 per Gazette schedule); technical controls map voluntarily ahead of commencement. | `PARTIAL` | Sprints 4, 5 |
