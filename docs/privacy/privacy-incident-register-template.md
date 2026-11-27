# Cambium Research — Privacy Incident Register Template

| Field | Value / Recording Rule |
| :--- | :--- |
| **Incident ID** | `INC-PRIV-YYYY-NNN` |
| **Detected At (UTC / IST)** | ISO-8601 timestamp |
| **Reporter / Detection Channel** | Automated check / Security scan / User grievance (`PrivacyRequest` ID) / Subprocessor notice |
| **Severity & Classification** | `P0 Critical` / `P1 High` / `P2 Medium` (Confidentiality / Integrity / Availability / Unlawful Processing) |
| **Affected Data Categories** | e.g., Account identity, `CONFIDENTIAL` uploads, workspace comments, AI snippets |
| **Estimated Affected Actors / Institutions** | Count and anonymized institutional tenants (no raw PII stored inside register) |
| **External Providers Involved** | Supabase / Render / Vercel / Google Gemini API / None |
| **Immediate Containment Actions** | Token revocation, secret rotation, feature disablement, RLS patch |
| **Audit Chain Verification Proof** | `AuditService.verifyLedgerChainIntegrity()` Merkle root & block range |
| **Legal & Institutional Notification Determination** | `[LEGAL_REVIEW_REQUIRED]` — Record counsel decision & commencement applicability |
| **Corrective Engineering PR / Test Added** | Link to regression test preventing recurrence |
| **Closed At & Reviewer Sign-Off** | Timestamp and accountable engineering owner |
