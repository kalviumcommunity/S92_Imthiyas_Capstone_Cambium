# Cambium Research — Canonical Event Taxonomy

## 1. Naming & Origin Principles

- Format: `<domain>.<object>.<past_tense_verb>` (`schemaVersion: '1.0.0'`).
- **Authoritative Origin**: All business-critical outcomes originate from verified **backend** services (`source = 'backend'`). Optional frontend interaction events (`source = 'client'`) are secondary, rejected if claiming business completion, and gated on explicit user consent where required.
- **No Sensitive Research Payloads**: Event `properties` contain structural IDs, enums, durations, and numeric counts — **never** manuscript text, prompts, emails, passwords, tokens, or connection strings.

## 2. Canonical Domain Events Mapped to Implemented Services

| Event Name | Source Service | Trigger Condition | Idempotency Key Pattern |
| :--- | :--- | :--- | :--- |
| `user.signup.completed` | `AuthService.register` | User row persisted in PostgreSQL | `signup:{userId}` |
| `user.login.completed` | `AuthService.login` | Password/SSO verified & JWT issued | Optional session bucket (`login:{userId}:{minute}`) |
| `user.login.failed` | `AuthService.login` | Invalid credentials or locked account (actor anonymized hash) | Non-deduplicated failure sample |
| `opportunity.search.completed` | `OpportunitiesService` / `HybridSearchService` | Search executed (`resultCount`, `mode`: `'hybrid'` or `'sql'`, **no raw confidential text stored blindly**) | Ephemeral search request ID |
| `opportunity.saved` | `BookmarksService.create` | Bookmark created for `opportunityId` | `bookmark:save:{userId}:{opportunityId}` |
| `opportunity.removed` | `BookmarksService.remove` | Bookmark removed | `bookmark:remove:{userId}:{opportunityId}:{reqId}` |
| `workspace.created` | `ProjectsService.createProject` | `GroupProject` committed in transaction | `workspace:create:{projectId}` |
| `workspace.member.invited` | `ProjectsService.inviteMember` | Collaboration invitation created | `invite:{projectId}:{inviteeId}:{reqId}` |
| `collaboration.invitation.accepted` | `ProjectsService.respondToInvitation` | Invitee transitions status -> `'ACCEPTED'` | `invite:accept:{projectId}:{userId}` |
| `collaboration.invitation.declined` | `ProjectsService.respondToInvitation` | Invitee transitions status -> `'DECLINED'` | `invite:decline:{projectId}:{userId}:{reqId}` |
| `document.upload.completed` | `UploadService.saveArtifact` | Magic bytes validated & artifact stored | `upload:ok:{artifactId}` |
| `document.upload.failed` | `UploadService` / `UploadController` | Size/MIME/magic-byte validation error (`reason` enum) | Request ID scoped |
| `document.ocr.completed` | `UploadController.extractTablesFromArtifact` | Worker/fallback extraction completed | `ocr:{artifactId}:{reqId}` |
| `ai.request.completed` | `AssistantService.chat` | Response produced (`aiPrivacyMode`, `model`, `citationCount`, latency) | `ai:req:{requestId}` |
| `ai.request.failed` | `AssistantService.chat` | Workspace authorization denied or provider error | `ai:fail:{requestId}` |
