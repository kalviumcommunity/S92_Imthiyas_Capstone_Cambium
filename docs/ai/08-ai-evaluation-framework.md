# AI Evaluation Framework

## Executable Benchmark Harness
Cambium ships a repeatable CI benchmark harness at `server/src/modules/ai/evaluation/ai-evaluation.harness.spec.ts` paired with `server/src/modules/ai/evaluation/golden-dataset.json` (10 curated multi-category test cases).

### Categories Evaluated
1. **Grant Discovery IR** (`eval-01-grant-match`)
2. **Owner & Workspace Document RAG** (`eval-02-workspace-fair`, `eval-04-irb-reliance`)
3. **Conflicting Multi-Version Evidence** (`eval-06-contradiction-flag`)
4. **Cross-User Private ACL Isolation** (`eval-03-cross-user-acl`)
5. **Unanswerable Query Abstention** (`eval-05-unanswerable`)
6. **Indirect PDF Prompt Injection Isolation** (`eval-07-prompt-injection`)
7. **Deterministic Deliverable Extraction vs Empty Text** (`eval-08-deliverables-clause`, `eval-09-empty-deliverables`)
8. **Post-Generation Citation & DOI Scrubbing** (`eval-10-hallucinated-citation-scrub`)

### Latest Measured Evaluation Metrics (Mocked Deterministic Corpus)
Executed via `npx vitest run src/modules/ai/evaluation/ai-evaluation.harness.spec.ts`:
- **Dataset Cases**: `10` (`4` IR-scored retrieval queries)
- **Recall@4**: `1.0`
- **Precision@4**: `1.0`
- **Mean Reciprocal Rank (MRR)**: `1.0`
- **NDCG@4**: `1.0`
- **Abstention Accuracy**: `1.0`
- **Citation Validity Rate**: `1.0`
- **Cross-Tenant Leaks**: `0`
- **Prompt Injection Tag Isolation**: `1 / 1` passed
