# Cambium Enterprise Automated Testing Verification (Jest & ts-jest)
**Milestone LU 2.18 — Concept: Used a Testing Framework in Application (>= 5 Unit Tests)**
**Document ID**: `DOC-TEST-JEST-PROOF-2026-V2`  
**Repository (Public)**: `https://github.com/shaikimthiyas/cambium-research`  
**Repository (Academic)**: `https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium`  
**Author**: Shaik Mohamed Imthiyas T  
**Date**: November 2026  
**Status**: `VERIFIED & PASSING (100% PASS RATE)`

---

## 1. Executive Summary & Grading Proof Matrix

This document provides formal evidence of compliance for **Milestone LU 2.18 (Automated Testing using Jest)**. It specifically addresses all criteria noted in the evaluation:
1. **Publicly Accessible Pull Request**: PR hosted on public GitHub repository `https://github.com/shaikimthiyas/cambium-research` (open to all evaluators without organization login) and mirrored to Kalvium.
2. **Deterministic Jest Setup**: Complete configuration using `jest.config.js`, `ts-jest`, and `package.json` test scripts.
3. **Exact Test File Paths**: Explicit paths for 5 distinct, production-grade test suites in `tests/unit/`.
4. **Detailed Explanation of 5 Test Cases**: Comprehensive analysis of what each test verifies, inputs, expected outputs, and domain significance.
5. **Actual Jest Execution Output**: Unedited terminal test output demonstrating all 82 tests passing across 9 suites in under 1 second.
6. **Continuous Integration (CI) Verification**: Automated GitHub Actions workflow (`.github/workflows/ci.yml`) enforcing Jest tests on every commit and PR.

---

## 2. Jest Framework Setup & Architecture

### 2.1 Configuration File (`jest.config.js`)
Located at project root: [`jest.config.js`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/jest.config.js)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/unit'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'ES2020',
          module: 'commonjs',
          moduleResolution: 'node10',
          ignoreDeprecations: '6.0',
          esModuleInterop: true,
          skipLibCheck: true,
          isolatedModules: true,
          types: ['jest', 'node'],
        },
      },
    ],
  },
  verbose: true,
};
```

### 2.2 Dependencies & Execution Command (`package.json`)
Located at project root: [`package.json`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/package.json)

- **Test Execution Script**:
  ```json
  "scripts": {
    "test:jest": "jest --runInBand"
  }
  ```
- **Testing Dependencies**:
  ```json
  "devDependencies": {
    "jest": "^30.5.2",
    "ts-jest": "^29.4.15",
    "@types/jest": "^30.0.0"
  }
  ```
- **Execution Architecture**:
  - `ts-jest` performs direct in-memory transpilation of TypeScript test files and application source code without requiring a prior `tsc` compilation step to a `dist/` directory.
  - `--runInBand` runs all test suites sequentially in the current process, eliminating thread contention and ensuring deterministic execution.

---

## 3. Inventory of the 5 Core Unit Test Suites

The table below lists the 5 core test suites, their exact file paths, number of assertions, and business domain coverage:

| Suite # | Exact Relative File Path | Total Tests | Focus Area & Domain Functionality |
| :--- | :--- | :---: | :--- |
| **Suite 01** | [`tests/unit/01-citation-engine.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tests/unit/01-citation-engine.spec.ts) | 9 tests | Academic Citation Generator (BibTeX, APA 7th, IEEE) & LaTeX Escaping |
| **Suite 02** | [`tests/unit/02-boolean-query-parser.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tests/unit/02-boolean-query-parser.spec.ts) | 10 tests | Boolean Search Lexer, AST Parser, SQL Injection Protection & PostgreSQL `tsquery` |
| **Suite 03** | [`tests/unit/03-token-contrast-validator.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tests/unit/03-token-contrast-validator.spec.ts) | 10 tests | Living Materials Design System WCAG 2.2 AA Contrast & APCA Lightness Contrast |
| **Suite 04** | [`tests/unit/04-formatters-and-deadlines.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tests/unit/04-formatters-and-deadlines.spec.ts) | 16 tests | Grant Currency Localization (USD/EUR), Deadline Urgency Tiers & Scholar Slug Generator |
| **Suite 05** | [`tests/unit/05-offline-sync-queue.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tests/unit/05-offline-sync-queue.spec.ts) | 10 tests | Resilient Offline Mutation Queue, Deduplication, Exponential Backoff & Purging |

*(Note: Additional suites `06`, `07`, `08`, `09` test SHA-256 hash chains, BM25 inverted index search, RAG semantic retrieval, and CRediT attribution ledgers, bringing the repository total to 82 tests).*

---

## 4. In-Depth Explanation of the 5 Test Cases

### 4.1 Test Case 1: Academic Citation Generator Engine
- **File Path**: `tests/unit/01-citation-engine.spec.ts`
- **Target Module**: `client/lib/citation.ts`
- **What it verifies**:
  1. **BibTeX Article Generation**: Asserts that `generateBibtex()` generates valid `@article{...}` syntax with author names joined by `and`, journal name, year, volume, issue, page range, and DOI.
  2. **Anonymous Author Fallback**: When an article metadata object has an empty authors array, the engine must fall back to `@misc{Anonymous<Year><Slug>, ...}` and specify `author = {Anonymous}`.
  3. **LaTeX Special Character Escaping**: Validates `escapeLatex()` escaping reserved LaTeX characters (`&` $\to$ `\&`, `%` $\to$ `\%`, `$` $\to$ `\$`, `#` $\to$ `\#`, `_` $\to$ `\_`), preventing compilation crashes in scholar PDF/TeX workflows.
  4. **APA 7th Edition Formatting**: Validates 3-author format with ampersand (`Author 1, Author 2, & Author 3 (2026). Title...`), single-author format, and two-author format.
  5. **IEEE Numbered Format**: Verifies IEEE bracketed numerical references (`[1] A. Author...`) and handles proposals without journal venues.

### 4.2 Test Case 2: Boolean AST Query Parser & SQL / Full-Text Compiler
- **File Path**: `tests/unit/02-boolean-query-parser.spec.ts`
- **Target Module**: `client/lib/query-parser.ts`
- **What it verifies**:
  1. **Lexer & Tokenizer**: Asserts that user search queries like `cancer AND CRISPR` or `"quantum computing" OR "gene editing"` are correctly tokenized into `TERM`, `AND`, `OR`, `NOT`, and parenthesis tokens.
  2. **Parentheses & Syntax Validation**: Catches unbalanced parentheses (e.g. `(cancer AND CRISPR`) and invalid syntax (e.g. trailing `AND`), returning descriptive error messages.
  3. **Parameterized SQL Compilation**: Compiles the AST into parameterized SQL with placeholder variables (`$1, $2, ...`) and a corresponding values array, preventing SQL injection vulnerabilities.
  4. **PostgreSQL Full-Text `tsquery` Compilation**: Compiles Boolean ASTs into native PostgreSQL `to_tsquery('english', '...')` strings using `&`, `|`, and `!` operators.

### 4.3 Test Case 3: Living Materials Design System Token & Contrast Validator
- **File Path**: `tests/unit/03-token-contrast-validator.spec.ts`
- **Target Module**: `client/lib/token-validator.ts`
- **What it verifies**:
  1. **Color Parsing & Luminance**: Parses 3-digit and 6-digit hex values into `{r, g, b}` and calculates relative luminance according to the W3C sRGB formula ($Y = 0.2126R + 0.7152G + 0.0722B$).
  2. **WCAG 2.2 Level AA Body Text Standard ($\ge 4.5:1$)**: Verifies that primary text `Forest Ink` (`#202920`) on `Parchment` (`#FAF7F0`) achieves $\ge 14.0:1$ (exceeding even AAA standards), and interactive `Canopy` green (`#3E6248`) on `Parchment` achieves $\ge 6.4:1$ (exceeding 4.5:1).
  3. **Large Text Standard ($\ge 3.0:1$)**: Verifies that secondary headings and large buttons pass the 3.0:1 threshold.
  4. **APCA (Advanced Perceptual Contrast Algorithm)**: Computes positive and negative Lightness Contrast ($L_c$) values to guarantee readability across light and dark mode surfaces.

### 4.4 Test Case 4: Enterprise Opportunity Formatters & Deadline Intelligence
- **File Path**: `tests/unit/04-formatters-and-deadlines.spec.ts`
- **Target Module**: `client/lib/formatters.ts`
- **What it verifies**:
  1. **Currency Localization**: Formats grant budgets in standard notation (`$750,000`, `€1,200,000`) and compact notation (`$2.5M`, `$1.2B`, `€500K`).
  2. **Resilient Fallback**: Gracefully returns `"Undisclosed"` for negative values, `NaN`, or missing budgets without throwing runtime errors.
  3. **Deadline Urgency Classifier**: Computes days remaining against a fixed reference date and assigns urgency tiers:
     - $\le 0$ days $\to$ `"expired"`
     - $1 - 3$ days $\to$ `"critical"`
     - $4 - 7$ days $\to$ `"urgent"`
     - $8 - 21$ days $\to$ `"approaching"`
     - $> 21$ days $\to$ `"healthy"`
  4. **Scholar Slug Sanitization**: Converts accented research titles into clean URL-safe slugs (e.g. `Living Materials & Quantum Genomics` $\to$ `living-materials-quantum-genomics`).
  5. **Reading Time Estimation**: Calculates estimated abstract reading time based on the academic benchmark of 200 words per minute.

### 4.5 Test Case 5: Offline Sync Queue & Resilient Mutation Manager
- **File Path**: `tests/unit/05-offline-sync-queue.spec.ts`
- **Target Module**: `client/lib/offline-queue.ts`
- **What it verifies**:
  1. **Optimistic Mutation Ingestion**: Asserts that bookmarks or application actions enqueued while offline receive a unique ID (`mut_<timestamp>_<hash>`), status `"pending"`, and `retryCount: 0`.
  2. **Mutation Deduplication**: When a user rapidly toggles or edits a note on the same target while offline, the queue updates the existing payload rather than creating duplicate API calls.
  3. **Strict FIFO Ordering**: Guarantees that mutations are processed chronologically in the order they were initiated.
  4. **Exponential Backoff Calculation**: Verifies that backoff delay follows $T = \text{baseBackoff} \times 2^{\text{retryCount}}$ ($1\text{s} \to 2\text{s} \to 4\text{s} \to 8\text{s}$).
  5. **Max Retries & Transition**: Transitions failed items to `"failed"` status after reaching `maxRetries` (3 attempts), preventing infinite retry loops.
  6. **Selective Purge**: `purgeSynced()` removes only successfully processed mutations while preserving pending and failed items for retry or user notification.

---

## 5. Actual Jest Terminal Execution Output

Running `npm run test:jest` produces the following unedited test execution log:

```text
> cambium-monorepo@2.0.0 test:jest
> jest --runInBand

PASS tests/unit/07-inverted-index-search.spec.ts
  Suite 07: DSA Inverted Index & BM25 Relevance Search Engine
    Tokenizer & Stemmer
      √ should strip punctuation and normalize case (4 ms)
      √ should filter out common English and scholarly stopwords (1 ms)
      √ should stem common suffixes appropriately (3 ms)
    Inverted Index Construction & BM25 Scoring
      √ should correctly build vocabulary and index document count (2 ms)
      √ should rank exact title matches highest with multi-field boost (1 ms)
      √ should find documents matching tags or keywords across fields
      √ should rank multiple keyword matches by relevance (BM25) (1 ms)
      √ should support prefix typing-as-you-search matching
      √ should support dynamic document addition and removal
      √ should return empty array for empty or whitespace query when options specify empty handling (1 ms)

PASS tests/unit/04-formatters-and-deadlines.spec.ts
  Suite 04: Enterprise Formatters & Opportunity Intelligence Utilities
    Grant Amount Formatting
      √ should format standard amounts with USD currency symbol and thousands separators (13 ms)
      √ should support European Euro formatting
      √ should handle compact abbreviation for Millions, Billions, and Thousands (1 ms)
      √ should return "Undisclosed" for negative amounts, NaN, or unspecified budgets
    Deadline Urgency Calculator
      √ should classify <= 0 days as "expired"
      √ should classify 1-3 days as "critical" (1 ms)
      √ should classify 4-7 days as "urgent"
      √ should classify 8-21 days as "approaching"
      √ should classify > 21 days as "healthy"
      √ should throw an error for unparseable date strings (13 ms)
    Scholar Slug & URL Sanitization
      √ should strip accented diacritical marks and create clean lowercase slugs
      √ should collapse multiple hyphens and trim edges
      √ should return an empty string for non-string or falsy input (1 ms)
    Academic Reading Time Estimator
      √ should return 1 minute for short abstracts under 200 words
      √ should estimate reading time based on 200 words per minute
      √ should return 0 for empty or whitespace-only text (1 ms)

PASS tests/unit/02-boolean-query-parser.spec.ts
  Suite 02: Boolean AST Query Parser & SQL / Full-Text Compiler
    Lexer & Tokenizer
      √ should tokenize simple search terms and boolean operators (2 ms)
      √ should support quoted exact phrases
      √ should tokenize parentheses correctly (1 ms)
    Syntax Validator
      √ should pass valid boolean queries (2 ms)
      √ should detect unbalanced parentheses
      √ should reject trailing or consecutive boolean operators
    AST Parser & SQL Compiler
      √ should parse simple binary expression and compile to parameterized SQL (1 ms)
      √ should compile complex nested query with NOT to parameterized SQL
      √ should compile to PostgreSQL tsquery string format
      √ should return empty clauses for empty queries (1 ms)

PASS tests/unit/05-offline-sync-queue.spec.ts
  Suite 05: Offline Sync Queue & Resilient Mutation Manager
    Queue Ingestion & Deduplication
      √ should enqueue a new bookmark mutation with pending status and retryCount 0 (6 ms)
      √ should deduplicate pending mutations for the same action and targetId by updating payload
      √ should allow multiple mutations for different actions or targets
    FIFO Ordering & Inspection
      √ should return pending mutations ordered chronologically (19 ms)
    Exponential Backoff Delay Calculations
      √ should compute baseBackoff * 2^retryCount exponential delay
    Result Handling, Retries & Purging
      √ should mark mutation as synced when processing succeeds (1 ms)
      √ should retry up to maxRetries on failure, transitioning to failed thereafter
      √ should throw an error when handling result for a non-existent mutation ID (6 ms)
      √ should purge only synced mutations and retain pending or failed items
      √ should clear all items when clear() is invoked (1 ms)

PASS tests/unit/01-citation-engine.spec.ts
  Suite 01: Academic Citation Generator Engine (BibTeX, APA, IEEE)
    BibTeX Generation
      √ should generate a valid BibTeX article entry with complete metadata (1 ms)
      √ should fallback to Anonymous citation key when authors array is empty
      √ should properly escape LaTeX special characters (&, %, $, #, _)
    APA 7th Edition Generation
      √ should format APA 7th style for 3 authors with ampersand and italics journal
      √ should format single author APA style correctly
      √ should format 2 authors with ampersand
    IEEE Generation
      √ should format IEEE numbered style citation correctly
      √ should handle grant proposal IEEE style without venue
    Universal generateCitation dispatcher
      √ should dispatch to the requested style properly (1 ms)

PASS tests/unit/03-token-contrast-validator.spec.ts
  Suite 03: Living Materials Design System Token & Contrast Validator
    Hex Parsing & Luminance Engine
      √ should parse 6-digit and 3-digit hex colors into RGB components (2 ms)
      √ should throw an error for malformed hex strings (9 ms)
      √ should calculate accurate relative luminance according to W3C formula
    WCAG 2.2 Level AA Compliance Verifications
      √ should verify Forest Ink on Parchment passes AAA with >= 14:1 contrast ratio (1 ms)
      √ should verify Canopy action green on Parchment exceeds the 4.5:1 AA body text threshold
      √ should verify Deep Moss on Parchment exceeds 10:1 contrast ratio
      √ should verify Living Algae Accessible passes AA on both Parchment and Mineral Sand (1 ms)
      √ should distinguish large text threshold (3.0:1) vs body text threshold (4.5:1)
    APCA Lightness Contrast (Lc) Calculations
      √ should calculate positive Lc for dark ink on light parchment
      √ should calculate negative Lc for light text on dark background

PASS tests/unit/08-client-rag-engine.spec.ts
  Suite 08: Client-Side Scholarly RAG Engine & Semantic Retrieval
    √ should retrieve relevant scholarly chunks and return grounded citations for grant queries (2 ms)
    √ should switch into Methodology Auditor persona with formal experimental checklists
    √ should switch into Statistical Rigor persona with mathematical complexity bounds (1 ms)
    √ should switch into Reproducibility Engine persona with compute infrastructure parameters
    √ should provide fallback suggestions when query matches no known semantic concepts (1 ms)

PASS tests/unit/09-evidence-based-contributions.spec.ts
  Suite 09: Evidence-Based Research Contributions & Attribution Ledger
    Pillar 1 & 2: Contributions vs Active Days Calculation
      √ should collapse multiple research milestone events on the same date into exactly 1 active day (1 ms)
    Pillar 3: Distinct Scientific Works vs Milestone Events
      √ should aggregate preprint release and journal publication of the same paper into 1 distinct output (1 ms)
    Pillar 4: Scholarly Citation & Impact Isolation
      √ should strictly isolate citation metrics from temporal contribution velocity
    Confidential Peer Review Redaction (COPE Ethics Compliance)
      √ should mask confidential manuscript titles and evidence links when viewed by third parties (1 ms)
    CRediT Taxonomy Role Mapping
      √ should treat CRediT roles as descriptive attribution without inflating event counts
    GitHub Disconnected Integrity
      √ should report an honest disconnected state rather than synthetic repository commits

PASS tests/unit/06-cryptographic-audit-ledger.spec.ts
  Suite 06: Cryptographic Audit Ledger & Enterprise Security Verification
    Recursive SHA-256 Hash Chain Integrity
      √ should correctly build a valid 4-block cryptographic hash chain from genesis (2 ms)
      √ should immediately detect tampering if an historical payload is modified (1 ms)
      √ should detect tampering if an intermediate hash pointer is altered
    GDPR Article 20 JSON-LD Schema Conformance
      √ should validate standard Schema.org Person JSON-LD structure for data portability (2 ms)
    OWASP & NIST SP 800-53 Security Controls
      √ should verify that genesis hash contains exactly 64 zeroes for standard SHA-256 width
      √ should verify cryptographic collision resistance of high-entropy hashes

Test Suites: 9 passed, 9 total
Tests:       82 passed, 82 total
Snapshots:   0 total
Time:        0.931 s, estimated 3 s
Ran all test suites.
```

---

## 6. GitHub Pull Request & Public Accessibility Verification

To guarantee that evaluators and automated tools can inspect the merged Pull Request without login friction, the PR is published on both:

1. **Public Portfolio Pull Request (100% Public — No login required)**:
   - **URL**: `https://github.com/shaikimthiyas/cambium-research/pull/3`
   - **Branch**: `feat/automated-testing-jest` merged into `main`
   - **Status**: Merged
2. **Academic Organization Pull Request**:
   - **URL**: `https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium/pull/86`
   - **Branch**: `feat/automated-testing-jest` merged into `main`
   - **Status**: Merged

### CodiumAI AI Review Request
Per the assignment instructions, an AI review was requested on the Pull Request using the exact command syntax:
```markdown
@CodiumAI-Agent /review
```
*(with the required space before the slash `/`).*
