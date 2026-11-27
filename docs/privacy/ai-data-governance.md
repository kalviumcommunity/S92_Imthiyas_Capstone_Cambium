# Cambium Research — AI Privacy & Model Provider Governance

## 1. AI Pipeline Entry Points Mapped

1. **Agentic Research Assistant (`server/src/modules/assistant/assistant.service.ts`)**:
   - Processes `messages` and optional `context` (`userProfile`, `workspaceId`, `artifactId`, `documentSnippet`) -> outbound HTTPS request to `generativelanguage.googleapis.com/v1beta/models/{gemini-2.0-flash | gemini-1.5-flash}:generateContent`.
2. **Embedding Service (`server/src/modules/ai/gemini-embedding.service.ts`)**:
   - Embeds opportunity catalog text or query strings via `gemini-embedding-001` (768 dimensions), with SHA-256 deterministic local fallback when offline.
3. **Academic Autocomplete (`server/src/modules/ai/llm-autocomplete.service.ts`)**:
   - Prefix completion backed by `SCHOLARLY_CORPUS` offline or Gemini API when configured.

## 2. Program 09 Controls Enforced in Code

- **Pre-Flight Workspace & Artifact Authorization (`validateAccessAndExternalConsent`)**:
  - When `workspaceId` is supplied, caller membership is verified via `ProjectsService.canUserAccessWorkspace`.
  - When `artifactId` is supplied, `UploadService.getArtifactMetadata` verifies ownership; any `RESTRICTED` classification or `aiProcessingAllowed === false` blocks external Gemini dispatch.
- **Default Opt-In AI Consent**: `user_privacy_preferences.ai_processing_consent` defaults `false`. Without active opt-in consent, `AssistantService` runs locally (`aiPrivacyMode: 'local_only_no_external_dispatch'`) and sends zero data externally.
- **Outbound PII Scrubbing (`redactPiiForExternalLlm`)**: Redacts email addresses, Bearer tokens, and `AIza*` keys prior to Gemini prompt construction, wrapped in `<untrusted_source_data>` delimiters.
- **Cross-User Isolation**: Conversations are stateless per request (`no shared multi-user prompt memory store`).

## 3. Provider Governance Status (`BLOCKED` Legal/Contract Verification)

| Provider | Service | Data Transmitted When Authorized | Contractual Retention / Training Terms |
| :--- | :--- | :--- | :--- |
| **Google Gemini API** (`generativelanguage.googleapis.com`) | Generative text & embeddings | Opted-in bounded queries/snippets (`<= 3500` chars) & search text | `[REQUIRES_PROVIDER_CONTRACT_VERIFICATION]` — Consumer vs Paid API billing tiers carry distinct Google data-retention/human-review terms; deployment team must verify paid API tier / Cloud DPA before enabling `GEMINI_API_KEY` for institutional data. |
