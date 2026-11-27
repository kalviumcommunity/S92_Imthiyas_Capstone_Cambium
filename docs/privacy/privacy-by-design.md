# Cambium Research — Privacy by Design & Data Minimization

## 1. Engineering Controls Implemented

1. **Purpose-Limited Account Collection (`server/src/modules/users/entities/user.entity.ts`, `auth.dto.ts`)**:
   - Collects only operational research identity fields (`username`, `email`, `fullName`, `institution`, optional `researchInterests`). Date of birth, phone numbers, residential addresses, and demographic attributes are **not** requested or stored.
2. **Safe Defaults (`server/src/modules/privacy/`)**:
   - External LLM dispatch (`aiProcessingConsent`) and optional product telemetry (`optionalAnalyticsConsent`) both default to **`false`** (explicit opt-in) rather than preselected opt-out.
   - Uploaded research artifacts default to `CONFIDENTIAL` classification and `aiProcessingAllowed = false` unless explicitly authorized (`RESTRICTED` blocks external AI unconditionally).
3. **Log & Redirect Exposure Prevention**:
   - `AuditInterceptor` (`server/src/common/interceptors/audit.interceptor.ts`) strips confidential payload values (`documentSnippet`, `messages`, `content`, `abstract`, `text`, `email`, secrets) before persisting `audit_logs.payload`, storing only sanitized field keys, count of redacted fields, and a SHA-256 hash.
   - `client/middleware.ts` `sanitizeInternalRedirect` strips `\r`/`\n`/`\0` and external origins (`//`, `https://`) so personal redirect targets never leak externally.
4. **Least-Privilege Diagnostic Access**:
   - System diagnostics (`/api/database/diagnostics`) and user directory listings (`/api/v1/users`) require `RolesGuard` (`SuperAdmin` / `ComplianceOfficer`), keeping operational telemetry separated from confidential manuscript files.
