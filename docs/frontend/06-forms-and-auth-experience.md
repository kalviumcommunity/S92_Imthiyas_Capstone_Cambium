# Forms, Validation & Authentication Experience (`06-07`)

**Program**: Cambium Research Principal Frontend Engineering Program

---

## 1. Validation & Auth Integration
- **Schema Parity**: Auth & opportunity form schemas under `client/lib/schemas/auth.ts` and `opportunity.ts` align with NestJS DTO bounds (`MinLength`, email format, required fields).
- **Session Lifecycle (`useAuthStore`, `AuthGuard`, `middleware.ts`, `http-client.ts`)**:
  - Refresh tokens are never written to `localStorage` and are actively cleared (`localStorage.removeItem("cambium_refresh_token")`) during refresh and logout.
  - Access JWT `exp` claims are checked both on the Edge (`middleware.ts`) and inside client `AuthGuard.tsx`, automatically triggering `logout()` on expiration before redirecting to `/sign-in?redirect=...&notice=auth_required`.
  - All redirect URLs pass `sanitizeInternalRedirect()`, neutralizing `//`, `/\`, and cross-origin open redirects.
