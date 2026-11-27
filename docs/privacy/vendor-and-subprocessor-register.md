# Cambium Research — Third-Party Vendor & Subprocessor Register

> **Cross-Border & Residency Note**: Selecting an Indian region on one service (e.g., database host) does **not** ensure every subprocessor operates within India. All items requiring vendor contract verification are explicitly flagged `BLOCKED`.

| Provider | Role / Infrastructure Service | Data Potentially Transmitted | Location / Region Status | Verification & DPA Status |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase / PostgreSQL** | Managed PostgreSQL 16 + pgvector + RLS | User identities, workspaces, consent/privacy tables, vector catalog | Configured at project provisioning (`[VERIFY_PROJECT_REGION]`) | `BLOCKED` — Host DPA, backup retention duration, and pgBouncer TLS pinning require deployment audit |
| **Vercel** | Next.js 15 Frontend hosting & Edge runtime | HTTP request metadata, cookies (`cambium_token`), SSR HTML | Global CDN edge unless enterprise pinned | `BLOCKED` — Verify Vercel DPA & log retention tier |
| **Render** | NestJS 10 Backend API container host | API request payloads, stdout logs (`AuditInterceptor` scrubbed), ephemeral disk uploads | Configured service region (`[VERIFY_RENDER_REGION]`) | `BLOCKED` — Verify Render DPA & persistent disk encryption posture |
| **Google Gemini API** | External LLM & 768-dim embedding provider | Only when `GEMINI_API_KEY` set AND user `aiProcessingConsent === true` for non-restricted data | US / multi-region Google Cloud inference endpoints | `BLOCKED` — Must confirm Paid API tier vs zero-training DPA guarantees before institutional onboarding |
| **External Scholarly APIs** (`OpenAlex`, `arXiv`, `DOAJ`, `CrossRef`, `ORCID`) | Public academic opportunity, paper, and ORCID profile retrieval | Search keywords, DOIs, or user-supplied ORCID IDs | Public federated academic endpoints | `PARTIAL` — Confidential manuscript payloads never transmitted to catalog crawlers |
