# Cambium Research — System Overview, Context & Runtime Architecture

**Status Legend:** `VERIFIED` (inspected & compiled/tested in repo) · `PARTIALLY VERIFIED` (runtime fallback active locally; cloud credentials optional) · `PLANNED` (deferred to subsequent release/design programs)

---

## 1. Product Purpose & Boundaries

Cambium Research is an **Enterprise Research Operating System** helping scholars, labs, and institutional research offices discover opportunities, organize collaborative workspaces, manage scholarly artifacts, and synthesize cross-disciplinary evidence.

### Capabilities & Verification Matrix

| Area | Capabilities on `main` | Status |
| :--- | :--- | :--- |
| **Opportunity Discovery** | Filterable catalog (`Grant`, `CFP`, `Journal`, `Paper`), deadlines, tags, GIN full-text + `pgvector` HNSW hybrid RRF search, bookmarks | `VERIFIED` |
| **Scholar Identity & RBAC** | Email/password auth with JWT + HttpOnly refresh cookies, 10-role RBAC enum (`SUPER_ADMIN` to `EXTERNAL_REVIEWER`), Google OAuth, InCommon/SAML 2.0 SSO stub/metadata flow | `PARTIALLY VERIFIED` (SAML defaults to test IdPs when `SAML_CERT` is unset) |
| **Collaborative Workspaces** | `GroupProject` creation, `ProjectMember` CRediT roles, activity logs, comments, Socket.IO real-time updates, transactional outbox relay | `VERIFIED` |
| **Document Upload & OCR** | 50MB artifact cap, SHA-256 hashing, magic-byte validation, worker-thread / sandboxed fallback PDF text/table extraction | `VERIFIED` |
| **AI & RAG Assistant** | `AssistantService` (`gemini-2.0-flash` + deterministic offline fallback), `gemini-embedding-001` (`768`-dim), prompt injection delimiting (`<untrusted_source_data>`) | `PARTIALLY VERIFIED` (Deterministic fallback runs when `GEMINI_API_KEY` is absent) |
| **Institutional Research OS** | `Organization`, `Department`, `Proposal`, `FundingAccount`, `BudgetLineItem`, `ExpenseRequest`, `ComplianceProtocol`, cross-tenant isolation guards | `VERIFIED` |
| **Analytics, Observability & UI Accessibility Polish** | Performance/QA/Privacy/Analytics programs developed on stacked feature branches; Accessibility + Design System unification deferred to Program 14 | `PLANNED` (awaiting consolidated release integration) |

---

## 2. System Context & Container Architecture

```mermaid
flowchart LR
  Scholar["Researchers, PIs & Reviewers"] -->|"HTTPS"| Web["Next.js 16 + React 19 UI (Vercel)"]
  Admin["Institution & RD Directors"] -->|"HTTPS"| Web
  Web -->|"REST API v1 / WebSockets / SSE"| API["NestJS 12 Modular Monolith (Render)"]
  API -->|"TypeORM Pool max=20"| DB["PostgreSQL 16 + pgvector (768-dim HNSW + GIN FTS)"]
  API -->|"L1 LRU + Optional L2 Redis"| Cache["MultiTierCacheService & QueueService"]
  API -->|"HTTPS + AbortSignal.timeout"| ExtAI["Google Gemini (Chat & Embeddings)"]
  API -->|"OAuth / SMTP"| ExtAuth["Google OAuth2 & Resend Email API"]
```

---

## 3. Core Runtime Lifecycles

### Authentication & Authorization Flow
```mermaid
sequenceDiagram
  participant U as Scholar Browser
  participant W as Next.js Client
  participant A as NestJS AuthController
  participant R as Redis / Memory Lockout
  participant P as PostgreSQL (users)

  U->>W: Submit credentials (/sign-in)
  W->>A: POST /api/v1/auth/login
  A->>R: Check 5-attempt / 15m lockout window
  A->>P: Query user & verify bcrypt passwordHash
  A-->>W: Set HttpOnly refresh cookie + return JWT accessToken
  W->>A: Protected call (Authorization Bearer + X-Request-Id)
  A-->>A: JwtAuthGuard -> RolesGuard -> Ownership Check
```

### AI / RAG Query Flow
```mermaid
flowchart TD
  Q["Scholar Query"] --> H["HybridSearchService (768-dim pgvector + idx_opps_fts GIN)"]
  H --> RRF["Reciprocal Rank Fusion (k=60)"]
  RRF --> Wrap["Prompt Delimiter (<untrusted_source_data> <= 3500 chars)"]
  Wrap -->|GEMINI_API_KEY present| Live["Gemini 2.0 / 1.5 Flash (10s timeout)"]
  Wrap -->|Key absent or error| Fallback["Deterministic Local Citation Fallback"]
  Live --> Resp["Structured Response + Evidence Citations"]
  Fallback --> Resp
```
