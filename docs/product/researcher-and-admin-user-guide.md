# Cambium Research — Researcher & Institutional Administrator Guide

**Status:** `VERIFIED` against active UI routes (`client/app/`) and NestJS modules (`server/src/modules/`).

---

## Part A: Researcher Workflow Guide

1. **Account Registration & Onboarding (`/sign-up`, `/welcome`):**
   - Register via institutional email/password (`>= 8` chars) or configured Google OAuth.
   - Select primary research disciplines in `/welcome` to personalize `/dashboard` and recommendations.
2. **Opportunity Discovery (`/opportunities`, `/discover`):**
   - Filter across `Grant`, `CFP`, `Journal`, and `Paper` categories using full-text + semantic RRF search (`GET /api/v1/research-opportunities/hybrid`).
   - Click bookmark icons to save calls to your persistent `/bookmarks` vault.
3. **Collaborative Research Workspaces (`/workspace`):**
   - Initialize shared `GroupProject` workspaces, invite co-investigators with explicit CRediT roles, track live WebSocket activity logs, and exchange threaded workspace comments.
4. **Document Ingestion & OCR Extraction (`/workspace/upload`):**
   - Upload PDF, DOCX, CSV, XLSX, BibTeX, LaTeX, or JSON files up to `50 MB`. Files undergo magic-byte validation and SHA-256 hashing; owned PDFs support multi-column table/text OCR extraction (`/api/v1/upload/:id/ocr`).
5. **AI Assistant & Constellation Graph (`/agent-reader`, `/graph`):**
   - Query `/api/v1/assistant/chat` for grant matching and eligibility reasoning with evidence citations (`gemini-2.0-flash`, or automatic deterministic citation fallback when offline).
   - Inspect research topics, citations, and collaborators interactively on `/graph`.
6. **Scholar Portfolio (`/portfolio`):**
   - Review contribution cadence and distinct scholarly output pillars anchored to verifiable DOI/artifact evidence.

---

## Part B: Institutional Administrator Guide & Capability Boundaries

| Governance Function | Current Capability on `main` | Implementation Status |
| :--- | :--- | :--- |
| **Role-Based Access Control** | Enforced 10-role enum (`SUPER_ADMIN`, `UNIVERSITY_LEADERSHIP`, `RD_DIRECTOR`, `FINANCE_OFFICER`, `DEPARTMENT_HEAD`, `PI`, `RESEARCHER`, `FELLOW`, `COMPLIANCE_OFFICER`, `EXTERNAL_REVIEWER`) via `RolesGuard` | `VERIFIED` |
| **Organization, Department & Proposal Ledger** | Create & query organizations, departments, proposals, funding accounts, budget items, expense requests, milestones, and IRB protocols under `/api/v1/institution`, `/proposals`, `/funding` | `VERIFIED` |
| **Tamper-Evident Audit Verification** | Inspect `/audit` ledger and verify SHA-256 hash chain (`POST /api/v1/audit/verify`) | `VERIFIED` |
| **Federated SAML 2.0 Identity Provider Onboarding** | `SamlService` includes test IdP flows (Harvard/Oxford/MIT mocks); production institution SAML metadata requires server config (`config/saml/idp-metadata.xml` + `SAML_ENTRY_POINT`/`SAML_CERT`) | `PARTIALLY VERIFIED` (no self-serve SAML XML upload UI yet) |
| **Self-Serve Institutional Billing & Tenant Suspension** | Schema/module scaffolding exists under `billing`; full Stripe/invoice self-serve portal & automated suspension workflows are manual today | `PLANNED` |
