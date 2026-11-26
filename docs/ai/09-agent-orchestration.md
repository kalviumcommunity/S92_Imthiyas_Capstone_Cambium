# Agent Orchestration & Bounded Tool Execution

## Synchronous Tool Registry (`AiToolRegistry`)
Cambium executes domain-bounded workflows via explicit typed TypeScript services inside NestJS (`AssistantService` + `AiToolRegistry`), avoiding opaque third-party framework wrappers.

### Allowlisted Tools
Only four tools are registered in `ALLOWED_ASSISTANT_TOOLS`:
1. `search_opportunities` (`HybridSearchService.search` RRF semantic + lexical fusion)
2. `search_workspace_chunks` (`DocumentRetrievalService.retrieveAuthorizedChunks` with caller ACL enforcement)
3. `verify_eligibility` (rule-based solicitation matcher)
4. `extract_deliverables` (clause extraction against solicitation or snippet text)

### Loop & Failure Bounds
- `ToolExecutionBudget` caps each assistant turn at `maxToolCallsPerTurn = 4`.
- Unrecognized tool names return status `'DENIED'` immediately.
- Individual tool exceptions are caught cleanly into trace status `'ERROR'` so downstream synthesis either uses remaining evidence or abstains safely.
