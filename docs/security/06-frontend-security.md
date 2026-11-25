# Frontend Security & Content Security Policy (`06`)

**Program**: Cambium Research Security Hardening Program  
**Baseline**: OWASP ASVS V3/V5/V14

---

## 1. Content Security Policy (`client/next.config.ts`)
- **Environment Split (`isProd = process.env.NODE_ENV === "production"`)**:
  - **Production `script-src`**: Removes `'unsafe-eval'`, restricting scripts to `'self' 'unsafe-inline' blob: https://accounts.google.com https://apis.google.com`.
  - **Production `connect-src`**: Removes `http://localhost:*`, `ws://localhost:*`, and wildcard `https:`. Explicitly pinned to `'self'`, configured `NEXT_PUBLIC_API_URL` origin, Render/Supabase endpoints, Google OAuth, and public scholarly APIs (OpenAlex, Crossref, arXiv, NCBI PubMed).
  - **Hardened Directives**: Added `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, and `frame-ancestors 'none'`.

## 2. Middleware & Open Redirect Protection (`client/middleware.ts`)
- Protected route checks inspect JWT structure (`3` dot-separated parts, `type === 'access'`, unexpired `exp` claim) and automatically clear expired/malformed session cookies before redirecting to `/sign-in`.
- `sanitizeInternalRedirect(target)` rejects protocol-relative (`//`), backslash-prefixed (`/\`), and absolute external URLs in post-login `redirect` query parameters.

## 3. Token Storage Hygiene
- `client/lib/http-client.ts` and `client/lib/store/useAuthStore.ts` rely strictly on `credentials: "include"` `HttpOnly` refresh cookies and do not write refresh tokens to `localStorage`.
