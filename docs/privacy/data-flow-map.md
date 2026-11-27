# Cambium Research — System Data Flow Map

## 1. End-to-End Flow Architecture

```mermaid
flowchart TD
    Browser["Next.js 15 / React 19 Client (Vercel / Local)"]
    Edge["Next.js Middleware (cambium_token JWT shape check)"]
    API["NestJS 10 REST + Socket.IO API (Render / Local)"]
    DB[("PostgreSQL 16 + pgvector (Supabase / Postgres)")]
    Redis[("Redis Session Blacklist / Cache / Redlock")]
    Disk["Artifact Storage (uploads/artifacts/)"]
    Gemini["Google Gemini API (generativelanguage.googleapis.com)"]
    ScholarAPIs["External Scholarly Feeds (OpenAlex / ORCID / arXiv / DOAJ / CrossRef)"]

    Browser -->|"HTTPS + Bearer JWT / HttpOnly Cookie"| Edge
    Edge -->|"Allow if valid shape"| Browser
    Browser -->|"REST / SSE + X-Request-Id"| API
    API -->|"TypeORM Parameterized SQL + RLS GUC"| DB
    API -->|"Session Revocation, Locks, Cache"| Redis
    API -->|"Magic-byte Validated Artifact Write"| Disk
    API -->|"Pre-flight Consent & Access Gate (Program 09)"| Gemini
    API -->|"Public Discovery Queries Only (No User Private Docs)"| ScholarAPIs
```

## 2. Boundary & Transmission Summary

1. **Client -> Next.js Middleware**: Evaluates `cambium_token` JWT shape/expiration only; no secret PII is placed into redirect URLs (`sanitizeInternalRedirect`).
2. **Client -> NestJS Backend**: Credentials travel over TLS/HTTPS; refresh tokens use `HttpOnly` cookies (`cambium_refresh_token`, path `/api`); local demo tokens are restricted strictly to offline fallback UX when configured.
3. **NestJS -> PostgreSQL / Supabase**: Relational persistence with `001_supabase_rls_lockdown.sql` enforcing RLS across 33 application tables, expanded in Program 09 via `002_privacy_governance_tables.sql`.
4. **NestJS -> Google Gemini API**: Outbound network crossing outside self-hosted/database boundary whenever `GEMINI_API_KEY` is configured and called (`AssistantService`, `GeminiEmbeddingService`, `LlmAutocompleteService`). **Invariant**: Private research artifacts MUST pass workspace/owner authorization and explicit AI-processing consent before crossing this boundary.
5. **NestJS -> Scholarly APIs**: Outbound queries search public works/grants by keywords, DOIs, or user-initiated ORCID lookup (`orcid-api.ts`); confidential draft manuscripts are never transmitted to public catalog crawlers.
