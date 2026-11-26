# AI Security, Indirect Prompt Injection Defense & Tool Governance

## Defense Layers Implemented
1. **Authenticated Execution Boundary**: `/api/v1/assistant/*` requires `JwtAuthGuard` + `SubscriptionGuard('pro')`, and user identity is resolved exclusively from `@CurrentUser()` (`req.user`), never from client-supplied user IDs.
2. **DTO Schema Validation**: `AssistantChatDto` constrains array length (`<= 30`), message size (`<= 8,000` chars), snippet size (`<= 10,000` chars), role enums, and UUID formats (`ParseUUIDPipe` on conversation params).
3. **Authorization-First Retrieval**: `DocumentRetrievalService` evaluates `PUBLIC | owner | workspace_member | org` SQL filters *before* vector/text similarity ranking so unauthorized chunks never reach the LLM context window.
4. **Prompt Injection Isolation**: Retrieved chunks and attached documents are enclosed inside `<untrusted_source_data>` tags with explicit system instructions treating enclosed text strictly as passive data.
5. **Tool Governance**: `AiToolRegistry` rejects non-allowlisted tools (`DENIED`) and prevents unbounded agent recursion via `ToolExecutionBudget`.
6. **Post-Generation Output Guard**: `CitationVerifierService` removes any `[src:...]` or DOI hallucinated outside retrieved records.
