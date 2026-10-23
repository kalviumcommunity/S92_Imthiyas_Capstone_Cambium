# 🎓 Backend Technical Defense & Interview Playbook
## Evaluator Q&A, Design Trade-Offs & Scripted Architectural Defenses
**Author & Lead Architect**: Shaik Mohamed Imthiyas T  
**Document ID**: `AUDIT-BE-DEFENSE-2026-V1`

---

## 1. Core Technical Defense Scenarios

### Q1: "How does your backend architecture prevent Node.js event-loop blocking when handling CPU-intensive research document parsing?"
> **Senior Staff Response**:
> *"Node.js uses a single-threaded event loop for JavaScript execution, which makes it vulnerable to head-of-line blocking when executing CPU-bound algorithms such as multi-column OCR parsing or PDF tokenization.
> 
> Rather than letting heavy parsing block incoming HTTP connections, we designed `PdfOcrService` to delegate document processing to isolated Node.js `worker_threads` (`pdf-ocr.worker.ts`). The worker executes on a dedicated OS thread outside the main event loop.
> 
> We wrap the thread in a 15-second watchdog timer. When processing completes, the worker posts a structured JSON payload containing extracted budget tables, solicitation metadata, and multi-column paragraphs back to the parent thread. The main event loop never stalls, maintaining sub-10ms response times for all concurrent API callers."*

---

### Q2: "How do you handle distributed race conditions and prevent double-spending in grant submissions?"
> **Senior Staff Response**:
> *"We implement a dual-layer defense:
> 1. At the application layer, `RedlockService` implements the Redlock distributed locking algorithm across Redis instances with a resource lease TTL (e.g. `withLock('grant:sub:' + grantId, 5000)`). Any concurrent request for the same grant lock fails immediately with an HTTP 409 ConflictException.
> 2. At the persistence layer, PostgreSQL runs a serializable transaction with row-level locks (`SELECT FOR UPDATE`), guaranteeing that funding caps are verified and decremented atomically before the commit is acknowledged.
> 3. Furthermore, the `IdempotencyInterceptor` caches successful mutations by client-generated `Idempotency-Key` headers, replaying identical results on network timeouts without executing redundant database writes."*

---

### Q3: "Explain your SAML 2.0 institutional authentication integration."
> **Senior Staff Response**:
> *"Cambium serves higher education and national research laboratories where single sign-on via InCommon and eduGAIN federations is mandatory.
> 
> We built a native OASIS SAML 2.0 Service Provider (`SamlService`):
> - It publishes standard SP XML metadata at `/api/auth/saml/metadata`.
> - It initiates AuthnRequest redirects to university Shibboleth/Okta IdPs.
> - Its Assertion Consumer Service (`/api/auth/saml/acs`) validates XML signatures, checks `NotBefore` and `NotOnOrAfter` validity windows to prevent replay attacks, and extracts higher-ed standard attributes (`eduPersonPrincipalName`, `mail`, `displayName`, `eduPersonScopedAffiliation`).
> - It seamlessly provisions or updates scholar profiles and issues Cambium JWT access tokens paired with rotating HttpOnly refresh cookies.
> - For CI and offline testing, we also built an embedded Mock IdP endpoint (`/api/auth/saml/mock-idp`) that simulates valid university assertions at zero infrastructure cost."*

---

<div align="center">
  <sub>Backend Technical Defense · Document ID: AUDIT-BE-DEFENSE-2026-V1 · Verified for Academic Year 2026</sub>
</div>
