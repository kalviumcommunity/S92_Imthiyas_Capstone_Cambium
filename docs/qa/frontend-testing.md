# Cambium Research — Frontend QA & Client Contract Verification

## 1. Scope of Frontend Testing

Cambium separates frontend quality checks across two complementary layers so every test runs reliably without duplicating heavy browser tooling:

1. **Deterministic Client Contract Suite (`tests/unit/11-frontend-qa-contracts.spec.ts`)**:
   - **Form Schemas**: Validates `loginSchema` and `registerSchema` (`client/lib/schemas/auth.ts`) boundary inputs (short passwords, invalid characters in usernames, malformed email rejection, optional academic metadata).
   - **Edge Auth Middleware**: Exercises `client/middleware.ts` (`sanitizeInternalRedirect`, open-redirect blocking, unauthenticated redirects to `/sign-in?redirect=...&notice=auth_required`, expired/malformed JWT cookie clearing, and valid session pass-through).
   - **HTTP Transport Client**: Exercises `apiFetch` (`client/lib/http-client.ts`) for `X-Request-Id` generation, bounded retries on idempotent `GET` (`503`), non-retry on unkeyed `POST` mutations, `Idempotency-Key` header propagation, and single-flight `401` token refresh + replay.
   - **Zustand Auth Store**: Verifies `useAuthStore` (`client/lib/store/useAuthStore.ts`) hydration, profile name normalization, and total cleanup (`localStorage` + cookie expiration) on `logout()`.

2. **Real Browser Journey & Accessibility Suite (`tests/e2e/`)** *(Sprint 4)*:
   - Executes real Chromium flows via Playwright against `client` including protected route guards, workspace creation, upload UI, mobile/desktop responsive layouts, and `@axe-core/playwright` WCAG 2.2 AA scans.

## 2. Running Frontend Contract Tests

```bash
npm run test:jest
npm --prefix client run lint
npm --prefix client run build
```
