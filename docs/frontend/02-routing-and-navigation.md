# Routing, Navigation & Session Flow Audit (`02`)

**Program**: Cambium Research Principal Frontend Engineering Program

---

## 1. Verified Route Groups (`client/app/`)
- **Public & Marketing**: `/`, `/about`, `/pricing`, `/careers`, `/contact`, `/discover`, `/privacy`, `/terms`, `/disclaimer`, `/status`, `/welcome`, `/institution-sso`, HTTP error views (`/403`, `/404`, `/429`, `/error-500`, `/maintenance`).
- **Auth Flow (`(auth)/`)**: `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`.
- **Authenticated Workspace Shell (`(protected)/`)**: Protected at the Edge by [`middleware.ts`](../../client/middleware.ts) and wrapped in [`ProtectedLayout`](../../client/app/(protected)/layout.tsx) (`AuthGuard`, `GlobalSidebar`, `MobileNavigation`, `OfflineBanner`, `CommandPalette`, `ShortcutsModal`, `GlobalRagAssistant`, `error.tsx`, `loading.tsx`).

## 2. Improvements Applied
- **SPA Navigation Parity**: Replaced `window.location.href` hard reload in [`opportunities/page.tsx`](../../client/app/(protected)/opportunities/page.tsx) with Next.js App Router `router.push(...)` so workspace transitions preserve cached queries and shell state without full document reloads.
- **Session Expiry Sync**: Unified [`AuthGuard.tsx`](../../client/components/auth/AuthGuard.tsx) and [`middleware.ts`](../../client/middleware.ts) on JWT `exp` claim inspection, clearing expired credentials cleanly before redirecting with sanitized `?redirect=...` targets (`sanitizeInternalRedirect`).
