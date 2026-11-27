# Cambium Research — Personal Data Export & Portability Architecture

## 1. Endpoint & Authorization (`GET /api/v1/privacy/export`)

Implemented in `PrivacyService.exportPersonalData` and wired into `client/app/(protected)/settings/page.tsx`:

- **Caller Scoping**: Uses authenticated `@CurrentUser().id` exclusively. Cross-user export parameters are rejected (there is no `:userId` override on `/privacy/export`).
- **Included Categories**:
  - Account profile (`id`, `username`, `email`, `fullName`, `role`, `institution`, timestamps).
  - Active privacy visibility & opt-in preferences.
  - Append-only consent history (`consent_records`).
  - Caller bookmarks, caller-owned project metadata (`ownerId === userId` only), and caller-owned uploaded artifact metadata (`filePath` stripped).
- **Explicit Exclusions**:
  - Never includes `passwordHash`, JWT tokens, refresh secrets, internal disk paths, other collaborators' emails/comments, or unowned institutional budgets.
- **Auditability**: Persists a completed `PrivacyRequestType.EXPORT` record on each server export generation.
- **Remaining Scale Enhancement (`P2`)**: Implement background queued ZIP/stream exports with short-lived signed URLs if individual researcher corpora exceed synchronous JSON response sizes.
