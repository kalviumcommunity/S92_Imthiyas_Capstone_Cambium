# Frontend Architecture & Boundaries (`01`)

**Program**: Cambium Research Principal Frontend Engineering Program

---

## 1. Layer Separation & Technology Matrix (Verified Installed Packages)
- **Framework**: Next.js `16.4.6` App Router + React `19.0.0` (`strict: true` in `tsconfig.json`).
- **Styling**: Tailwind CSS `3.4.17` + CSS custom properties in `client/app/globals.css` + Living Materials tokens (`tokens/cambium.tokens.json`).
- **Server State**: `@tanstack/react-query` `^5.67.2` (`QueryProvider` with `staleTime: 5m`, `gcTime: 30m`, retry=2).
- **Client UI & Session State**: `zustand` `^5.0.3` (`useAuthStore`, `useSubscriptionStore`, `usePresenceStore`).
- **Forms & Validation**: `react-hook-form` `^7.54.2`, `@hookform/resolvers`, `zod` `^4.6.7`.
- **UI Primitives**: Radix UI (`@radix-ui/react-dialog`, `tabs`, `select`, `dropdown-menu`, `tooltip`, etc.) styled via CVA + `tailwind-merge` under `client/components/ui/`.
- **Virtualization**: `@tanstack/react-virtual` (`VirtualizedAuditLedger.tsx`) for large ledger rendering.

## 2. Architectural Boundary Rules
1. **Network Boundary (`client/lib/http-client.ts` -> `client/lib/api.ts`)**: All authenticated browser API calls belong in `apiFetch`, which attaches `X-Request-Id`, `Authorization: Bearer <access>`, `credentials: "include"` (`HttpOnly` refresh cookie), `12000ms` abort timeout, single-flight `401` refresh rotation, and idempotent retries on `502`/`503`/`504`.
2. **State Isolation Boundary (`useAuthStore`, `QueryProvider`, `useSubscriptionStore`)**: Logging out or authenticating a different user ID invalidates React Query caches and resets user-scoped client storage so Scholar B never inherits Scholar A's cached dashboards or billing state.
3. **Authoritative Validation Boundary**: Frontend schemas (`client/lib/schemas/`) mirror NestJS DTOs for immediate UX feedback, while NestJS `ValidationPipe` and `RolesGuard` remain authoritative.
