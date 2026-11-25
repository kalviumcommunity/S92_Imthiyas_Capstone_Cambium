# Authentication & Session Security Architecture (`02`)

**Program**: Cambium Research Security Hardening Program  
**Baseline**: OWASP ASVS 5.0.0 V2/V3/V7, OWASP Top 10:2025 A07

---

## 1. Identity & Credential Controls
- **Password Policy (`server/src/modules/auth/dto/auth.dto.ts`)**: Enforced `@MinLength(8)` and `@MaxLength(128)` to guarantee meaningful entropy while preventing bcrypt DoS/truncation abuse. Username constrained to `/^[a-zA-Z0-9._-]+$/`.
- **Password Hashing (`server/src/modules/auth/auth.service.ts`)**: Upgraded bcrypt work factor to **12** across registration, login re-hashing, and `UsersService` admin provisioning (`bcrypt(randomBytes(32), 12)`).
- **Cryptographic Randomness**: Replaced `Math.random()` token generation with Node `crypto.randomBytes(32)`.
- **Registration Enumeration Defence**: Unified conflict messaging so an attacker cannot probe existing emails vs. usernames cleanly via distinct HTTP payloads.

## 2. OAuth2 / Google Sign-In Hardening
- **Eliminated P0 Auth Bypass**: Removed the unverified email-only Branch 3 Google login fallback and removed the unverified `jwt.decode` branch in `AuthService.googleLogin`.
- **Verification Path**: Requires either a verified Google `access_token` validated against Google `userinfo` (`email_verified !== false`) or a signed Google `idToken` verified via `OAuth2Client.verifyIdToken` with configured `GOOGLE_CLIENT_ID`.

## 3. JWT & Refresh Session Model
- **Algorithm Pinning**: Explicit `{ algorithms: ['HS256'] }` enforced in both `JwtAuthGuard` (`server/src/modules/auth/guards/jwt-auth.guard.ts`) and `AuthService.refreshSession`, blocking `alg: none` and asymmetric confusion attacks.
- **Refresh Token Cookie Isolation (`server/src/modules/auth/auth.controller.ts`)**: `sanitizeAuthResponse()` strips `refreshToken` from JSON response payloads so refresh tokens exist solely in `HttpOnly; SameSite=Lax/Strict` cookies.
- **Frontend Token Hygiene (`client/lib/http-client.ts`, `client/lib/store/useAuthStore.ts`)**: Eliminated `localStorage` storage/reading of `cambium_refresh_token` and actively purges legacy keys on refresh or sign-out.
- **Edge Route Guard (`client/middleware.ts`)**: Checks structural JWT shape (`3` segments, `type === 'access'`, unexpired `exp`), deletes stale/expired cookies on navigation, and enforces `sanitizeInternalRedirect()` blocking `//`, `/\`, and cross-origin redirect targets.
