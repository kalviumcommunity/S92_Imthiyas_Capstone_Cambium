# Cambium Automated Unit Testing Guide (Jest Framework)
**Enterprise Research Opportunity Discovery & Intelligence Platform**
**Milestone LU 2.18 — Concept: Used a Testing Framework in Application (>= 5 Unit Tests)**

---

## 1. Executive Summary & Overview

Cambium employs **Jest 30** paired with **`ts-jest`** as its enterprise-grade automated unit testing foundation. This suite provides isolated, deterministic verification for core algorithmic, cryptographic, AST parsing, and accessibility compliance utilities without relying on external databases or network services.

### Key Metrics
- **Test Framework**: Jest `^30.5.2` with `ts-jest` `^29.4.15`
- **Total Test Suites**: 9 suites (including the 5 core domain suites required for LU 2.18)
- **Total Unit Tests**: 82 granular unit test assertions
- **Execution Mode**: In-band deterministic TypeScript transpilation (`jest --runInBand`)
- **Execution Time**: ~0.93 seconds across the full suite (100% pass rate)
- **Formal Evidence Document**: [`docs/testing/JEST_AUTOMATED_TESTING_PROOF.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/testing/JEST_AUTOMATED_TESTING_PROOF.md)

---

## 2. Test Suites Inventory (5 Core Suites for Milestone 2.18)

| Suite | Exact File Path | Focus Area | Key Assertions / Coverage |
| :--- | :--- | :--- | :--- |
| **Suite 01** | [`tests/unit/01-citation-engine.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tests/unit/01-citation-engine.spec.ts) | Academic Citation Generator | BibTeX export, APA 7th edition, IEEE numbered style, LaTeX special character escaping (`&`, `%`, `$`, `#`, `_`), and fallback keys. |
| **Suite 02** | [`tests/unit/02-boolean-query-parser.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tests/unit/02-boolean-query-parser.spec.ts) | Boolean AST & Query Compiler | Lexer tokenization, parentheses balancing validation, parameterized SQL `$1...$N` query generation, and PostgreSQL `to_tsquery` compilation. |
| **Suite 03** | [`tests/unit/03-token-contrast-validator.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tests/unit/03-token-contrast-validator.spec.ts) | Living Materials Design System | W3C DTCG color parsing, relative luminance calculation, WCAG 2.2 Level AA ($\ge 4.5:1$ body, $\ge 3.0:1$ large), and APCA Lightness Contrast ($L_c$). |
| **Suite 04** | [`tests/unit/04-formatters-and-deadlines.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tests/unit/04-formatters-and-deadlines.spec.ts) | Opportunity Formatters | Grant currency localization (USD, EUR), compact notation ($2.5M, €500K), deadline urgency (`critical`, `urgent`, `approaching`, `healthy`, `expired`), slug generation, and reading time estimation. |
| **Suite 05** | [`tests/unit/05-offline-sync-queue.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tests/unit/05-offline-sync-queue.spec.ts) | Offline Sync & Mutation Manager | Optimistic mutation queueing, payload deduplication, FIFO ordering, exponential retry backoff ($1\text{s} \times 2^n$), max retry transitions, and synced purge. |

---

## 3. How to Execute Unit Tests

### Standard Monorepo Command
Run all Jest test suites with detailed verbose output:
```bash
npm run test:jest
```

### Targeted Suite Execution
To run a specific test suite in isolation:
```bash
# Run only citation engine tests
npx jest tests/unit/01-citation-engine.spec.ts

# Run only design system contrast validation
npx jest tests/unit/03-token-contrast-validator.spec.ts
```

---

## 4. 3-Minute Video Presentation Script (Kalvium LU 2.18 Submission)

Use this structured script when recording your 3-minute screen + webcam demonstration for LU 2.18.

### Pre-Recording Checklist
- [x] Camera turned ON (face clearly visible).
- [x] Entire screen shared (not just a single browser tab).
- [x] Terminal open at project root `d:\01_PROJECTS\ACTIVE\S92_Imthiyas_Capstone_Cambium`.
- [x] GitHub Pull Request page open in browser (both public and academic links ready).
- [x] Audio levels optimal and background noise eliminated.
- [x] Name recording appropriately: `Shaik Mohamed Imthiyas T_S92_Jest Unit Testing Video`
- [x] Google Drive share permission set to: **"Anyone with the link can edit"**.

---

### Step-by-Step Video Walkthrough Script

#### Part 1: Introduction & Pull Request Public Verification (0:00 – 0:45)
> *"Hello everyone! My name is Shaik Mohamed Imthiyas, and this is my video submission for Milestone 2.18: Automated Testing using Jest for my Capstone project, Cambium — the AI-powered Research Opportunity Discovery and Intelligence Platform.*
> 
> *(Show browser with GitHub PR)*
> 
> *First, here is our GitHub Pull Request created on branch `feat/automated-testing-jest` and merged into `main`. It is publicly accessible on GitHub at `shaikimthiyas/cambium-research/pull/3` without requiring any organization login, and also mirrored in the Kalvium organization repository. In the PR comments, I invoked `@CodiumAI-Agent /review` with the required space before the slash, receiving automated code review feedback before merging."*

#### Part 2: Jest Framework Setup & Configuration (0:45 – 1:30)
> *(Show VS Code / IDE with `jest.config.js` and `package.json`)*
> 
> *"Next, let's examine our Jest setup:*
> 1. *In `jest.config.js`, we use `preset: 'ts-jest'` with `testEnvironment: 'node'`. `ts-jest` performs direct in-memory transpilation of our TypeScript test files and modules, allowing full type-checking without needing an extra compile step.*
> 2. *Our test root is configured to `tests/unit/` matching all `.spec.ts` files, with module aliasing mapping `@/*` to `./client/*`.*
> 3. *In `package.json`, under scripts, we configured `"test:jest": "jest --runInBand"`, which guarantees sequential, deterministic execution across all suites."*

#### Part 3: Deep-Dive into the 5 Test Files & What Each Case Verifies (1:30 – 2:30)
> *(Show file explorer showing `tests/unit/` and open each file)*
> 
> *"Now let's examine our 5 core unit test suites:*
> 
> 1. *First, in `tests/unit/01-citation-engine.spec.ts`: We test academic citation generation. It verifies BibTeX article creation with author metadata, an 'Anonymous' fallback key when authors are missing, LaTeX special character escaping for reserved symbols like ampersands and dollar signs, APA 7th edition formatting, and IEEE numbered citations.*
> 2. *Second, in `tests/unit/02-boolean-query-parser.spec.ts`: We test our Boolean search AST parser. It verifies lexer tokenization of search terms and quoted phrases, detects syntax errors like unbalanced parentheses, compiles queries into parameterized SQL statements with `$1...$N` to prevent SQL injection, and generates PostgreSQL `tsquery` strings for full-text search.*
> 3. *Third, in `tests/unit/03-token-contrast-validator.spec.ts`: We mathematically test our Living Materials design tokens against W3C WCAG 2.2 Level AA accessibility standards. It verifies that Forest Ink on Parchment achieves a 14 to 1 contrast ratio, Canopy green exceeds the 4.5 to 1 body text threshold, and calculates APCA Lightness Contrast values.*
> 4. *Fourth, in `tests/unit/04-formatters-and-deadlines.spec.ts`: We verify grant currency localization for USD and Euros, compact notation like $2.5M, robust fallback to 'Undisclosed' for missing budgets, and our 5-tier deadline urgency classifier spanning expired, critical, urgent, approaching, and healthy.*
> 5. *Fifth, in `tests/unit/05-offline-sync-queue.spec.ts`: We test our offline mutation manager. It verifies optimistic mutation queuing, deduplication of rapid updates to the same target, FIFO chronological ordering, exponential backoff delay calculations, and automatic purging of synced mutations."*

#### Part 4: Live Terminal Execution & Passing Proof (2:30 – 3:15)
> *(Switch to full-screen terminal and run `npm run test:jest`)*
> 
> *"Now, let's run the automated test suite live in the terminal:*
> `npm run test:jest`
> 
> *(Watch the test suites execute)*
> 
> *As you can see on screen, all 9 test suites pass with 100% green checkmarks. All 82 tests passed in under 1 second. Specifically, our 5 target suites for Milestone 2.18 — Citation Engine, Boolean Parser, Token Validator, Formatters, and Offline Queue — are all passing completely.*
> 
> *Furthermore, our GitHub Actions CI pipeline in `.github/workflows/ci.yml` runs this exact `npm run test:jest` command on every push and pull request, guaranteeing continuous quality enforcement.*
> 
> *Thank you!"*

---

## 5. Submission Copy-Paste Template for Kalvium Portal

```markdown
### Milestone 2.18: Automated Testing using Jest — Proof of Submission

#### 1. Public Pull Request Links
- **Public Pull Request URL (Accessible to all evaluators without login)**:
  https://github.com/shaikimthiyas/cambium-research/pull/3
- **Academic Organization Pull Request URL**:
  https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium/pull/86
- **Branch**: `feat/automated-testing-jest` (Merged into `main`)

#### 2. Jest Framework Setup & Configuration
- **Configuration File**: `jest.config.js` (Preset: `ts-jest`, Environment: `node`, Roots: `<rootDir>/tests/unit`)
- **Transpiler**: `ts-jest` `^29.4.15` for zero-overhead in-memory TypeScript execution
- **Execution Script**: `"test:jest": "jest --runInBand"` in `package.json`

#### 3. Test File Paths & Explanation of 5 Verified Test Cases
1. `tests/unit/01-citation-engine.spec.ts` (9 tests):
   - Verifies BibTeX export with complete metadata, Anonymous fallback keys, LaTeX special character escaping (`&`, `%`, `$`, `#`, `_`), APA 7th edition, and IEEE numbered references.
2. `tests/unit/02-boolean-query-parser.spec.ts` (10 tests):
   - Verifies Boolean lexer tokenization, quoted phrases, unbalanced parenthesis detection, parameterized SQL `$1...$N` AST compilation to prevent SQL injection, and PostgreSQL `tsquery` generation.
3. `tests/unit/03-token-contrast-validator.spec.ts` (10 tests):
   - Verifies W3C relative luminance, WCAG 2.2 Level AA compliance (Forest Ink on Parchment >= 14:1, Canopy Green on Parchment >= 6.4:1 vs 4.5:1 threshold), and APCA Lightness Contrast.
4. `tests/unit/04-formatters-and-deadlines.spec.ts` (16 tests):
   - Verifies USD/EUR grant currency formatting, compact abbreviation ($2.5M, €500K), deadline urgency classifier (expired, critical, urgent, approaching, healthy), and URL slug generation.
5. `tests/unit/05-offline-sync-queue.spec.ts` (10 tests):
   - Verifies optimistic mutation enqueuing, payload deduplication by target ID, FIFO chronological ordering, exponential backoff delay ($1000\text{ms} \times 2^{\text{retryCount}}$), and selective purging of synced mutations.

#### 4. Actual Jest Test Execution Output
- **Command**: `npm run test:jest`
- **Result**: `Test Suites: 9 passed, 9 total | Tests: 82 passed, 82 total | Time: 0.931s`
- **Status**: 100% Passing (0 failures, 0 regressions)

#### 5. CodiumAI AI Review Request
- Requested in PR comments using exact syntax: `@CodiumAI-Agent /review`
- Pull Request merged into `main` prior to submission.

#### 6. Walkthrough Video Link
- **Recording Link**: [INSERT YOUR GOOGLE MEET RECORDING LINK HERE]
- **Sharing Setting**: "Anyone with the link can edit"
- **Filename**: `Shaik Mohamed Imthiyas T_S92_Jest Unit Testing Video`
```
