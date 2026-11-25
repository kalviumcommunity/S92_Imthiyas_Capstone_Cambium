# Frontend Current-State Assessment (`00`)

**Program**: Cambium Research Principal Frontend Engineering Program  
**Stack Inspected**: Next.js `16.4.6` App Router, React `19.0.0`, TypeScript `5.7.3`, Tailwind CSS `3.4.17`, `@tanstack/react-query`, `zustand`, `react-hook-form` + `zod`, Radix UI primitives.

---

## 1. App Router & Architecture Inventory
- **Layouts & Error Boundaries**: Root `app/layout.tsx` wires `Manrope`, `Plus_Jakarta_Sans`, `Newsreader`, `JetBrains_Mono`, `QueryProvider`, `GoogleOAuthProvider`, `ThemeProvider`, `LanguageProvider`. Root `error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx`, and `(protected)/error.tsx` / `loading.tsx` exist.
- **Route Groups**:
  - Public (`/` landing page, `/about`, `/pricing`, `/careers`, `/contact`, `/discover`, `/privacy`, `/terms`, `/disclaimer`, `/status`, `/welcome`, `/institution-sso`, `/403`, `/404`, `/429`, `/error-500`, `/maintenance`)
  - Auth (`(auth)/sign-in`, `(auth)/sign-up`, `(auth)/forgot-password`, `(auth)/reset-password`)
  - Protected (`(protected)/*`: `/dashboard`, `/opportunities`, `/grants`, `/discover`, `/publications`, `/workspace`, `/workspace/upload`, `/graph`, `/intelligence`, `/community`, `/messages`, `/notifications`, `/portfolio`, `/profile`, `/settings`, `/billing`, `/compliance`, `/audit`, `/peer-review`, `/data-management`, `/lab`, `/agent-reader`, `/os`, `/help`, `/changelog`)
- **Edge Middleware (`client/middleware.ts`)**: Validates presence, 3-segment JWT shape, `type === 'access'`, and unexpired `exp` before permitting access to protected prefixes, with open-redirect sanitization (`sanitizeInternalRedirect`).

---

## 2. Prioritized Findings (Observed Defects Only)

| Priority | Category | Verified Defect | Location |
| :--- | :--- | :--- | :--- |
| **P0** | API Client Consistency | Multiple functions in `client/lib/api.ts` (`getOpportunities`, `hybridSearchOpportunities`, `chatWithAssistant`, `createOpportunity`, `deleteOpportunity`, `getMyBookmarks`, `toggleBookmark`, `removeBookmark`, `loginUser`, `registerUser`, and the `api.{get,post,put,delete}` helper) bypass `apiFetch` (`http-client.ts`), skipping automatic `401` refresh-token rotation, `X-Request-Id` correlation headers, timeouts, and safe `5xx` retries. | `client/lib/api.ts` |
| **P0** | Cross-Account Leakage | Logging out (`useAuthStore.logout()`) or switching users (`useAuthStore.setAuth()`) did not clear the in-memory `@tanstack/react-query` cache (`staleTime: 5m, gcTime: 30m`) or reset scoped `useSubscriptionStore` / workspace draft storage keys. | `client/lib/store/useAuthStore.ts`, `query-provider.tsx`, `useSubscriptionStore.ts` |
| **P0** | Optimistic Billing Bypass | `PaymentCheckoutModal.tsx` called `upgradePlan(...)` and displayed `isCompleted = true` without waiting for `/api/billing/subscribe` confirmation or rolling back/surfacing HTTP errors, and constructed raw `${NEXT_PUBLIC_API_URL}/api/billing/subscribe` URLs. | `client/components/billing/PaymentCheckoutModal.tsx` |
| **P1** | Navigation & Hook Bugs | ESLint flagged `window.location.href` hard reload instead of Next.js `router.push` in `opportunities/page.tsx:688`, missing `handleSyncLiveOpenAlex` dependency in `graph/page.tsx:197`, and missing `drafts` dependency in `ProposalDraftsDesk.tsx:208`. | `opportunities/page.tsx`, `graph/page.tsx`, `ProposalDraftsDesk.tsx` |
| **P1** | AuthGuard Flash & Cookie Sync | `AuthGuard.tsx` checks raw token presence without JWT `exp` shape validation, duplicated expiry cleanup logic already in `useAuthStore`, and lacks an explicit storage helper. | `client/components/auth/AuthGuard.tsx` |
| **P2** | Accessibility / Dialog Escape | `PaymentCheckoutModal.tsx` used raw overlay divs without `role="dialog"`, `aria-modal="true"`, or `Escape` key handler (unlike Radix `DialogContent` in `dialog.tsx`). | `PaymentCheckoutModal.tsx` |

---

## 3. Prioritized Stage Plan (Preserving Existing Design System)
1. **Stage A (API & Transport Consolidation)**: Route `client/lib/api.ts` core helpers & `api.*` adapter through `apiFetch` (`http-client.ts`) cleanly while keeping explicit error surfacing on failures.
2. **Stage B (Cross-Account Isolation & State Reset)**: Expose browser `getQueryClient()` in `query-provider.tsx`, add `reset()` in `useSubscriptionStore.ts`, and invoke unified session-clear on `logout()` and cross-user `setAuth()`.
3. **Stage C (Billing Reliability & Dialog A11y)**: Fix `PaymentCheckoutModal.tsx` to use `apiFetch`, await/validate backend response (`billingSyncError` alert on failure instead of false backend claim, `role="dialog"`, `aria-modal`, `Escape` close).
4. **Stage D (ESLint 0-Warning Cleanups)**: Fix `opportunities/page.tsx` SPA routing (`useRouter().push`), `graph/page.tsx` `useCallback` hook dependency, and `ProposalDraftsDesk.tsx` functional state update so ESLint reports **0 errors, 0 warnings**.
5. **Stage E (Tests & Docs)**: Add dedicated frontend Jest contract/unit test suite (`tests/unit/11-frontend-architecture.spec.ts`) covering token expiry cleanup, `apiFetch` `401` refresh flow, `sanitizeInternalRedirect`, account-switch isolation, and response error normalization.
