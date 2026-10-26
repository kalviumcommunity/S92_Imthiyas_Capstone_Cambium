# Cambium Automated Unit Testing Guide (Jest Framework)
**Enterprise Research Opportunity Discovery & Intelligence Platform**
**Milestone LU 2.18 — Concept: Used a Testing Framework in Application (>= 5 Unit Tests)**

---

## 1. Executive Summary & Overview

Cambium employs **Jest 30** paired with **`ts-jest`** as its enterprise-grade automated unit testing foundation. This suite provides isolated, deterministic verification for core algorithmic, cryptographic, AST parsing, and accessibility compliance utilities without relying on external databases or network services.

### Key Metrics
- **Test Framework**: Jest `^30.5.2` with `ts-jest` `^29.4.15`
- **Total Test Suites**: 5 distinct test suites
- **Total Unit Tests**: 35+ granular unit test assertions
- **Execution Mode**: In-band deterministic TypeScript transpilation
- **Execution Time**: ~2.5 seconds across the full suite

---

## 2. Test Suites Inventory

| Suite | File Path | Focus Area | Key Assertions / Coverage |
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

### Coverage Report Generation
```bash
npx jest --coverage
```

---

## 4. 3-Minute Video Presentation Script (Kalvium LU 2.18 Submission)

Use this structured script when recording your 3-minute screen + webcam demonstration for LU 2.18.

### Pre-Recording Checklist
- [x] Camera turned ON (face clearly visible in bottom/top corner).
- [x] Entire screen shared (not just a single browser tab).
- [x] Terminal open at project root `d:\01_PROJECTS\ACTIVE\S92_Imthiyas_Capstone_Cambium`.
- [x] GitHub Pull Request page open in browser.
- [x] Audio levels clear and background noise eliminated.

---

### Step-by-Step Video Walkthrough Script

#### Minute 0:00 – 0:45: Introduction & Testing Philosophy
> *"Hello everyone! My name is Shaik Mohamed Imthiyas, and this is my presentation for Milestone 2.18: Automated Testing using Jest for my Capstone project, Cambium — the AI-powered Research Opportunity Discovery and Intelligence Platform.*
> 
> *In enterprise scholarship software, accuracy and resilience are paramount. If an opportunity deadline is miscalculated, a citation format has malformed LaTeX syntax, or an offline bookmark mutation fails silently, scholars lose critical grants. To guarantee zero regressions, I implemented Jest with ts-jest, covering 5 dedicated unit test suites spanning citation generation, Boolean query AST compilation, Living Materials design token contrast, deadline formatters, and offline mutation sync queues."*

#### Minute 0:45 – 1:45: Deep-Dive into Code & Test Architecture
> *(Show VS Code / IDE screen displaying `tests/unit/`)*
> 
> *"Let's inspect the test architecture:*
> 1. *First, in `tests/unit/01-citation-engine.spec.ts`, we verify academic citations. We test BibTeX generation, APA 7th edition, IEEE standards, and LaTeX character escaping for mathematical symbols and ampersands.*
> 2. *Second, in `02-boolean-query-parser.spec.ts`, we test our Boolean query lexer and AST parser. It validates user queries like `(genomics OR proteomics) AND NOT bacteria`, prevents SQL injection by compiling to parameterized `$1...$N` statements, and translates them into PostgreSQL `tsquery` expressions.*
> 3. *Third, in `03-token-contrast-validator.spec.ts`, we mathematically test our Living Materials design tokens against WCAG 2.2 Level AA and APCA perceptual readability standards, ensuring our Forest Ink on Parchment exceeds the 4.5:1 ratio.*
> 4. *In `04-formatters-and-deadlines.spec.ts`, we test grant currency formatting and deadline urgency tiers: expired, critical, urgent, and approaching.*
> 5. *Finally, in `05-offline-sync-queue.spec.ts`, we test our offline mutation manager, verifying optimistic updates, deduplication, and exponential backoff retry logic."*

#### Minute 1:45 – 2:30: Live Terminal Execution
> *(Switch to terminal and run `npm run test:jest`)*
> 
> *"Now let's execute the automated test suite directly in the terminal using `npm run test:jest`.*
> 
> *(Wait for the tests to run and point at green output)*
> 
> *As you can see, all 5 test suites pass with 100% green checkmarks across all test cases in roughly 2 seconds. The tests run in-band and demonstrate complete type-safety through ts-jest."*

#### Minute 2:30 – 3:15: GitHub Pull Request & CodiumAI Review Demonstration
> *(Switch to browser showing the GitHub Pull Request)*
> 
> *"Next, per the assignment requirements, I committed these tests on the dedicated feature branch `feature/jest-unit-testing` and opened Pull Request #41 against the `main` branch.*
> 
> *In the PR comments, I requested an AI automated code review using the exact command: `@CodiumAI-Agent /review` (with the required space before the slash).*
> 
> *CodiumAI analyzed the PR diff, validated the unit test coverage, and provided constructive feedback. All required CI/CD workflows, TypeScript compilation, and linting checks are passing green.*
> 
> *I will now merge this Pull Request into `main` and submit the PR and video links. Thank you!"*

---

## 5. CodiumAI Review Instruction Reference

When commenting on your Pull Request on GitHub:
```markdown
@CodiumAI-Agent /review
```
*(Notice the space between `@CodiumAI-Agent` and `/review` as emphasized in the lesson instructions).*
