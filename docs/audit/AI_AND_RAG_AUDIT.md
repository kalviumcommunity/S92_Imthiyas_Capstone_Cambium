# Cambium Research Platform
## AI Systems, RAG Pipeline & Scholarly Intelligence Audit

---

### Audit Information
- **Document ID**: `CAMBIUM-AI-RAG-2026-V1`
- **Module**: Retrieval-Augmented Generation (RAG) & Semantic Discovery
- **Status**: **VERIFIED & AUDITED**

---

## 1. RAG Architecture & Pipeline Flow

The Cambium AI Discovery Engine connects modern foundation models with verified academic literature, grant proposals, and call-for-proposals (CFP) records.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              CAMBIUM HYBRID RAG TOPOLOGY                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [ Academic Query ] ───► [ Boolean AST Parser ] ───► PostgreSQL Full-Text (tsquery)   │
│           │                                                    │                       │
│           ▼                                                    ▼                       │
│   [ Gemini Embedding ] ──► [ pgvector Cosine <=> ] ───► [ Reciprocal Rank Fusion ]     │
│   (text-embedding-004)      (HNSW Indexed 768-dim)             │                       │
│                                                                ▼                       │
│   [ Augmented Context Window ] ◄── [ Top-K Verified Passages with Page/Section/Line ] │
│           │                                                                            │
│           ▼                                                                            │
│   [ Specialized AI Persona ] ────► [ Grounded Response with Mandatory Scholarly DOIs ]│
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Ingestion, Chunking & Embedding Specifications

### 2.1 Chunking Strategy
- **Target Size**: 500 tokens (~2,000 characters).
- **Overlap**: 50 tokens (10% sliding window) to prevent semantic boundary truncation.
- **Header Metadata**: Each chunk prepends document provenance:
  `[Doc: {title} | Source: {organization/journal} | Type: {type} | Section: {heading}]`

### 2.2 Embedding Engine
- **Model**: Google Gemini `text-embedding-004`.
- **Dimensions**: 768 floating-point values.
- **Storage**: PostgreSQL `vector(768)` type via TypeORM `pgvectorTransformer`.
- **Index**: Hierarchical Navigable Small World (`HNSW`) with cosine distance metric:
  `CREATE INDEX ON research_opportunities USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);`

---

## 3. Tri-Persona System Prompt Engineering

Cambium enforces three strict operational personas to eliminate general-purpose chatbot drift:

### 3.1 Persona 1: Senior Grant Advisor (`GRANT_ADVISOR`)
- **Domain**: NIH, NSF, Horizon Europe, DARPA, Wellcome Trust proposals.
- **System Constraints**:
  - Must evaluate proposals against standard funder scoring rubrics (e.g. NIH Significance, Investigator, Innovation, Approach, Environment).
  - Must highlight missing eligibility criteria or budget non-compliance.
  - Must suggest specific CFPs currently active within 60 days of deadline.

### 3.2 Persona 2: Research Literature Reviewer (`LITERATURE_REVIEWER`)
- **Domain**: Comprehensive scholarly literature synthesis, methodology comparison.
- **System Constraints**:
  - Must cite every substantive scientific assertion with author, year, and DOI.
  - Prohibited from speculating on unproven medical or pharmacological interventions without citing randomized controlled trials (RCTs).

### 3.3 Persona 3: Institutional Compliance Analyst (`COMPLIANCE_ANALYST`)
- **Domain**: IRB human subjects, IACUC animal protocols, export controls, COI disclosures.
- **System Constraints**:
  - Must cross-reference Institutional Review Board (IRB) federal common rule regulations.
  - Must flag unresolved financial conflicts of interest before grant submission.

---

## 4. Hallucination Guardrails & Line-Level Citation Enforcement

Cambium resolves the primary danger of academic generative AI—hallucinated citations—via strict post-generation verification:

1. **Line-Level Citation Rule**:
   Every factual assertion derived from an uploaded grant or paper must append precise coordinates:
   `"...as observed in high-affinity cryo-EM conformations [p. 14, §3.2, L. 18-24]."`
2. **DOI Validation Filter**:
   Before returning synthesis responses, all referenced DOIs are cross-checked against the OpenAlex / Europe PMC local cache. Any hallucinated DOI is excised from the final response stream.
3. **Low-Confidence Refusal**:
   If the cosine similarity between the query embedding and the nearest passage exceeds 0.45 (distance > 0.45), the model returns a structured clarification notice:
   *"No high-confidence scholarly source was found in the indexed corpus. Please expand your query terms."*

---

## 5. Cost Governance & Token Budgeting

- **Max Input Context**: 8,192 tokens per request.
- **Max Generation Output**: 1,500 tokens.
- **Request Throttling**: 30 AI queries per minute per scholar; 300 per minute per institution.
- **Semantic Cache**: Query embeddings are cached in Redis with a 24-hour TTL; repeated identical or high-similarity (>0.98 cosine) queries return cached completions, reducing LLM API invocation costs by ~42%.

