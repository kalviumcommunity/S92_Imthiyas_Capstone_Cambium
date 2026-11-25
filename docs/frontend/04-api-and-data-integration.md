# API Integration & Data Fetching Architecture (`04`)

**Program**: Cambium Research Principal Frontend Engineering Program

---

## 1. Centralized Transport (`client/lib/http-client.ts`)
- `resolveApiBase()` / `resolveApiV1Base()`: Resolves environment-specific base URLs without hardcoding privileged credentials.
- `apiFetch(input, options)`:
  - Attaches `X-Request-Id` (`crypto.randomUUID()` fallback-safe) for cross-tier trace correlation.
  - Attaches `Authorization: Bearer <access>` from `cambium_token` / `cambium_access_token` and sends `credentials: "include"` for `HttpOnly` refresh cookies.
  - Enforces a `12000ms` `AbortController` timeout.
  - Performs single-flight `401` token rotation (`performTokenRefresh()`) via `/api/v1/auth/refresh` (with `inflightRefreshPromise` deduplication).
  - Restricts automatic retries (`502`, `503`, `504`) strictly to idempotent methods (`GET`/`HEAD`/`OPTIONS`) or mutations supplying `Idempotency-Key`.

## 2. Consolidation Applied (`client/lib/api.ts`, `PaymentCheckoutModal.tsx`)
- Routed `chatWithAssistant`, `getOpportunityStats`, `createOpportunity`, `deleteOpportunity`, `getMyBookmarks`, `toggleBookmark`, `removeBookmark`, `loginUser`, `registerUser`, and the `api.{get,post,put,delete}` client adapter through `apiFetch`.
- Updated [`PaymentCheckoutModal.tsx`](../../client/components/billing/PaymentCheckoutModal.tsx) to await confirmed backend activation before updating local subscription tier state and to display actionable inline error alerts on failure.
