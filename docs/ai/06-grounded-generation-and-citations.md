# Grounded Generation & Post-Generation Citation Verification

## Evidence-First Prompting
All chat synthesis prompts pass through `AiPromptRegistry.buildGroundedRagPrompt`, which isolates retrieved records inside `<untrusted_source_data>` delimiters and enforces four citation rules:
1. Cite only authorized retrieved source IDs via `[src:<sourceId>]`.
2. Distinguish direct retrieved source facts from analytical inference.
3. Explicitly note contradictions or missing solicitation data.
4. State `"Insufficient evidence in authorized Cambium sources"` when retrieved context cannot support a claim.

## CitationVerifierService (`citation-verifier.service.ts`)
After generation, `CitationVerifierService.verifyCitations` performs deterministic verification against the exact `AuthorizedEvidenceSource[]` slice assembled during the request:
- Any `[src:<id>]` marker absent from the authorized source allowlist is stripped (`[unverified citation removed]`).
- Any DOI matching `10.\d{4,9}/...` not present verbatim in the retrieved source corpus is stripped (`[unverified DOI removed]`).
- Only `verified: true` citations backed by retrieved opportunities, authorized PGVector document chunks, or caller-supplied snippets are returned in `evidenceCitations`.

## Explicit Abstention Gate
If zero public opportunities, zero ACL-authorized workspace chunks, and zero attached document snippets match a query without structured rule outputs, `AssistantService.chat` aborts generation and returns `abstained: true` instead of speculating.
