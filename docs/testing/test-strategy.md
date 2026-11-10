# Cambium Testing Strategy & Test Pyramid
## `docs/testing/`

This document details the multi-tiered automated testing architecture, execution commands, and quality gates enforcing zero regressions across Cambium.

### Unified Test Pyramid

```
                ▲
               / \
              /   \
             / E2E \         Playwright (6 specs: Auth, Discover, Graph, Axe WCAG)
            /-------\
           / Service \       Vitest (24 files / 117 tests: Auth, RBAC, Redis, SAML)
          /-----------\
         /  Unit/Utils \     Jest (9 files / 82 tests: Tokens, AST, RAG, Citations)
        /---------------\
```

### 1. Test Harness Breakdown

| Tier | Runner | Location | Scope | Passing Count |
| :--- | :--- | :--- | :--- | :--- |
| **Monorepo Unit** | Jest (`ts-jest`) | `tests/unit/` | Citation engine, Boolean query parser, WCAG token contrast, deadline math, offline sync queue, cryptographic audit ledger, BM25 inverted index, client RAG engine, CRediT contributions. | **82 / 82 Passed** (9 suites) |
| **Backend Unit** | Vitest (`--pool=threads`) | `server/src/**/*.spec.ts` | Auth guards, SAML SSO, Redis caching, Redlock concurrency, artifact upload, OCR sandboxing, opportunities service, outbox relay. | **117 / 117 Passed** (24 suites) |
| **Browser E2E** | Playwright | `tests/e2e/` | Auth flows, discovery filtering, Gemini reader, citation graph rendering, Axe-Core WCAG 2.2 AA accessibility audit, smoke probes. | **6 Specifications** |

### 2. Execution Commands

```bash
# Run root unit tests (82 Jest tests)
npm run test:jest

# Run backend unit tests (117 Vitest tests)
npm --prefix server run test

# Run Playwright E2E smoke harness
npm run test:e2e
```

### 3. Detailed Guides
- [Automated Testing Guide](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/AUTOMATED_TESTING_GUIDE.md)
- [Master Testing Specification](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/testing.md)

