# Cambium Test Architecture & Pyramid (Phase 1)

```mermaid
flowchart TB
    E2E["Browser E2E & Accessibility (Playwright + Axe WCAG 2.2 AA)"]
    INT["HTTP Contract, Guard & DB Constraint Integration (NestFactory Ephemeral Local HTTP + Vitest)"]
    SEC["Multi-Actor Security, Upload Abuse & AI Grounding Suites"]
    UNIT["Pure Logic & Frontend Contract Unit Tests (Jest + Vitest)"]
    UNIT --> SEC --> INT --> E2E
```

| Layer | Runner & Location | What It Proves |
| :--- | :--- | :--- |
| **Frontend / Pure Unit** | `npm run test:jest` (`tests/unit/*.spec.ts`) | Zod validation schemas, Next.js middleware redirect sanitization, citation formatters, boolean AST, offline sync, client RAG grounding |
| **Backend Unit & Security** | `cd server; npm test` (`server/src/**/*.spec.ts`) | Service domain rules, multi-actor RBAC/IDOR, SSRF, SQL RLS static/AST checks, cache singleflight, queue deduplication |
| **Real HTTP Pipeline Integration** | `server/src/qa/*.spec.ts` (booting real Nest `ValidationPipe` + Express on `127.0.0.1:0`) | Actual HTTP wire status codes (`400`, `401`, `403`, `404`, `503`), `forbidNonWhitelisted`, `ParseUUIDPipe`, JSON contract shapes |
| **Browser E2E & A11y** | `npm run test:e2e` (`tests/e2e/*.spec.ts`) | Edge middleware redirects, authenticated journeys, Axe WCAG AA critical checks, mobile/desktop viewports |
