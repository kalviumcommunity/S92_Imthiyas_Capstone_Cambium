# Cambium Research — Lightweight Privacy Impact Assessment (PIA) Template

Use before launching or modifying any feature touching `CONFIDENTIAL`/`RESTRICTED` data, AI pipelines, institutional workflows, cross-border APIs, or profiling.

| Section | Assessment Prompt |
| :--- | :--- |
| **1. Feature & Owner** | Name, sprint/PR branch, engineering owner |
| **2. Necessity & Minimization Check** | Why is each personal or confidential research field needed? Could the feature work without it? |
| **3. Data Categories & Classification** | Identify Class 1–4 categories involved and derived data created (embeddings, caches, logs) |
| **4. Access & Isolation Boundaries** | How are `JwtAuthGuard`, workspace membership, institutional `organizationId`, and PostgreSQL RLS enforced? |
| **5. AI & External Subprocessor Flow** | Does data cross to Gemini API or any third party? Is explicit opt-in consent (`aiProcessingConsent`) enforced? |
| **6. Retention, Export & Deletion** | Does data appear in `GET /api/v1/privacy/export` and clean up on `POST /api/v1/privacy/erasure`? |
| **7. Identified Privacy Risks & Mitigations** | Concrete attack/leakage vectors and tested technical controls |
| **8. Residual Risk & Legal Escalation** | Open legal/contractual questions logged in `legal-review-register.md` (`Pending Legal` / `Approved`) |
| **9. Review Date** | Scheduled re-review cadence or trigger |
