# Cambium Quality Engineering Strategy (Phase 1)

## Core Mandate
Code compiles and `200 OK` responses do not establish behavioral correctness. Cambium's QA architecture verifies five non-negotiable properties:
1. **Business Rule Correctness**: Server enforces pagination, eligibility, deliverable extraction, and validation independently of client UI.
2. **Authorization & Isolation**: Cross-user, cross-workspace, and cross-institution BOLA/IDOR probes fail deterministically across HTTP endpoints, WebSockets, uploads, and RAG retrieval.
3. **Data Integrity & Atomicity**: Constraints, duplicate conflict classification (`23505`), transaction rollbacks, and RLS guardrails prevent split state.
4. **Failure Safety**: Database down (`503`), external API timeouts, corrupted uploads, and offline AI gracefully fail cleanly with zero false-success messages.
5. **No Flaky or Masked Tests**: Never swallow redirect failures in `try/catch`, never use production accounts, and explicitly label unavailable live targets `BLOCKED`.
