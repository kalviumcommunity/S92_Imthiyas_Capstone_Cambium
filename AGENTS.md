# AI Agent Operating Instructions & Repository Rules (AGENTS.md)
## Cambium — AI-Powered Research Opportunity Discovery & Intelligence Platform
**The Enterprise Research Operating System**

---

### Metadata
- **Document ID**: `AGENTS-CAMBIUM-2026-V2`
- **Product Name**: Cambium Research Platform
- **Lead Architect & Author**: Shaik Mohamed Imthiyas T
- **Status**: `ENFORCED / ACTIVE OPERATING RULES`
- **Current Version**: `2.0.0`
- **Target Audience**: All AI Coding Agents (Antigravity, Claude Code, GitHub Copilot, Cursor, Codex), Subagents, and Automated CI Workers.
- **Repository**: `S92_Imthiyas_Capstone_Cambium`

---

## 1. Project Purpose & Repository Map

Cambium is an **AI-powered Research Opportunity Discovery and Intelligence Platform**—the Enterprise Operating System for Modern Scholarship.

Every AI agent operating in this repository **MUST** understand the directory boundaries:

```
S92_Imthiyas_Capstone_Cambium/
├── client/                     # Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
│   ├── app/                    # Route handlers & layouts (public, auth, protected)
│   │   ├── (auth)/             # Authentication views (/sign-in, /sign-up)
│   │   ├── (protected)/        # 23 enterprise routes (/dashboard, /workspace, /graph, etc.)
│   │   ├── globals.css         # Master CSS variables, drift keyframes, and base typography
│   │   └── page.tsx            # High-conversion Living Materials landing page
│   ├── components/             # Reusable UI component inventory (GlobalSidebar, CambiumLogo, etc.)
│   └── lib/                    # Client stores (Zustand), API hooks (TanStack Query), utils
├── server/                     # NestJS 10 Enterprise API + TypeORM + PostgreSQL 16
│   └── src/                    # Modular domain architecture (auth, opportunities, users, etc.)
├── tokens/                     # W3C DTCG Living Materials Design Tokens
│   └── cambium.tokens.json     # Single Source of Truth for colors, spacing, and typography
├── docs/                       # Authoritative Project Specifications & Governance
│   ├── architecture/           # C4 system diagrams, ADRs, and technical strategy
│   ├── decisions/              # Michael Nygard Architecture Decision Records index
│   ├── engineering/            # Repository audit, branch review, standards, code style
│   ├── operations/             # Release process, deployment runbooks, disaster recovery
│   ├── product/                # PRD specifications, requirements overview, user personas
│   ├── security/               # STRIDE threat model, RBAC matrix, audit ledgers
│   ├── testing/                # Test pyramid strategy, coverage policies, smoke harnesses
│   ├── templates/              # PRD.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, SECURITY.md
│   └── README.md               # Master documentation index catalog
├── tests/                      # Monorepo test suites
│   ├── unit/                   # 9 Jest suites (82 tests): tokens, AST parser, RAG, citations
│   └── e2e/                    # 6 Playwright suites: auth, discovery, graph, Axe WCAG AA
├── scripts/                    # Operational tooling and CLI verifications
│   ├── development/            # Development-only tools (logo calibration)
│   ├── cron/                   # Automated cron backup jobs
│   └── systemd/                # Linux systemd service definitions
├── backups/                    # Database dumps and metadata manifests (gitkeep only)
├── bruno/                      # Declarative Bruno API collection (38 requests)
├── nginx/                      # Edge reverse proxy Dockerfile and configuration
├── SECURITY.md                 # Root security policy and vulnerability disclosure notice
└── AGENTS.md                   # THIS FILE — Enforced AI Agent Rules & Verification Protocols
```

---

## 2. Authoritative Specifications & Precedence Hierarchy

When modifying code or resolving ambiguities, AI agents **MUST** follow this strict hierarchy:

$$\mathbf{PRD.md} \succ \mathbf{ARCHITECTURE.md} \succ \mathbf{DESIGN\_SYSTEM.md} \succ \mathbf{SECURITY.md} \succ \mathbf{Existing\ Code}$$

1. **`docs/templates/PRD.md`** defines **WHAT** and **WHY** (Scope, Functional Requirements `FR-*`, Non-Functional Requirements `NFR-*`).
2. **`docs/templates/ARCHITECTURE.md`** defines **HOW** the system is built (C4 diagrams, database schemas, Caching, ADRs).
3. **`docs/templates/DESIGN_SYSTEM.md`** defines **VISUAL & ACCESSIBILITY CONSTRAINTS** (Living Materials tokens, WCAG 2.2 AA standards, APCA readability).
4. **`docs/templates/SECURITY.md`** defines **SAFETY & PERMISSION BOUNDARIES** (RBAC matrix, input validation, SHA-256 audit logs).
5. **Conflict Resolution**: If code contradicts these documents, **the documents govern**. Never silently invent new requirements or change architectural patterns without explicit human alignment.

---

## 3. Mandatory Inspection & Planning Protocol

Before writing or editing code, agents **MUST** execute these three sequential steps:

### Step 1: Read Authoritative Context First
- Inspect relevant type definitions, API interfaces, and component implementations.
- Verify whether the affected section has active design tokens or backend entity constraints.

### Step 2: Formulate Concrete Plan
- Identify exact files to modify.
- Verify that changes preserve zero-regression guarantees on neighboring components.

### Step 3: Surgical Edit Execution
- Use precise replacement tools (`replace_file_content` / `multi_replace_file_content`).
- Preserve all existing comments, docstrings, and unrelated code.

---

## 4. Coding Conventions & Architecture Boundaries

### 4.1 Frontend Standards (`client/`)
- **Framework**: Next.js 15 App Router with React 19 Server and Client Components (`"use client"` only when interactive state is required).
- **Styling**: Strictly utilize tokens from `tokens/cambium.tokens.json` or defined classes in `client/app/globals.css`.
  - **PROHIBITED**: Never use raw, unapproved hex values (e.g. generic `#ff0000`, `#0000ff`). Use semantic tokens (`#3E6248` Canopy, `#FAF7F0` Parchment, `#202920` Forest Ink, `#4ADE80` Emerald Glow).
- **State Management**:
  - Global server state: `@tanstack/react-query`.
  - Global UI state: Zustand stores in `client/lib/store/`.
  - URL state: Native Next.js `useSearchParams` and `usePathname`.
- **Icons**: Standardize on `lucide-react` with explicit `size={18}` or `size={20}`.

### 4.2 Backend Standards (`server/`)
- **Framework**: NestJS 10 modular architecture with dependency injection.
- **Data Access**: TypeORM with PostgreSQL 16.
  - **PROHIBITED**: Raw SQL string concatenation. Always use query parameters (`:id`).
- **Validation**: All controller request bodies **MUST** use DTOs decorated with `class-validator` and `class-transformer`.
- **Error Handling**: Use standard NestJS HTTP exceptions (`NotFoundException`, `UnauthorizedException`, `BadRequestException`). Never leak database stack traces to the client.

---

## 5. Prohibited Shortcuts & Critical Constraints

AI agents are strictly forbidden from taking the following shortcuts:

| Prohibited Shortcut | Why It Is Forbidden | Enforced Alternative |
| :--- | :--- | :--- |
| **Disabling or skipping tests** | Hides regressions and breaks release gates. | Fix the root cause or update test fixtures to match approved PRD changes. |
| **Hardcoding mock data in production endpoints** | Creates illusory success while breaking actual API integration. | Connect to real backend controllers and database repositories. |
| **Bypassing RBAC or security guards** | Violates institutional ethics and compliance. | Implement the required role guard or request human authorization. |
| **Modifying lockfiles unnecessarily** | Causes build non-determinism. | Only touch `package.json` when adding explicitly requested dependencies. |
| **Removing existing tests or lint rules** | Degrades repository code quality over time. | Write compliant TypeScript that satisfies strict linting rules. |

---

## 6. Verification, Testing & Build Requirements

Before marking any task as complete, agents **MUST** execute and report on the following verification checks:

### 6.1 TypeScript & Type Safety
```bash
npm --prefix client run build
cd server && npm run build
```
- **Requirement**: Zero TypeScript errors (`tsc` exit code 0).

### 6.2 Automated Unit & Integration Testing
```bash
npm run test:jest            # 82 Jest unit tests across tokens, AST, RAG, citations
npm --prefix server run test # 117 Vitest unit tests across NestJS API modules
npm run test:e2e             # Playwright E2E browser smoke harness
```
- **Requirement**: 100% test pass rate (199 passing unit tests).

### 6.3 Linting & Formatting
```bash
npm --prefix client run lint
npm --prefix server run lint
```
- **Requirement**: Zero unhandled ESLint warnings or errors.

### 6.3 Visual & Browser Verification
- For landing page, dashboard, or UI changes: Run the browser agent or inspect DOM at `http://localhost:3000`.
- Verify contrast ratios against WCAG 2.2 AA (4.5:1 for body copy).
- Confirm zero visual regression in both **Parchment Light** and **Bioluminescent Botanical Dark** themes.

---

## 7. Mandatory Completion Report Format

Every task completion report delivered by an AI agent must conclude with this concise verification summary:

```markdown
### 📋 Agent Completion Report
- **Task ID & Description**: [e.g. TASK-OPP-02: Implement semantic match filter]
- **Files Modified**:
  - [`client/app/...`](file:///path/to/file)
  - [`server/src/...`](file:///path/to/file)
- **Specification Compliance**:
  - PRD Requirements Verified: [e.g. FR-OPP-02]
  - Design Tokens Enforced: [e.g. W3C Living Materials AA Pass]
  - Security Controls Verified: [e.g. RBAC Guard checked]
- **Automated Verification Results**:
  - TypeScript Compilation: `PASSED (0 errors)`
  - Next.js Dev Build: `COMPILED (1118 modules in 1.6s)`
  - Browser Visual Check: `VERIFIED at http://localhost:3000`
```


---

## 8. Content Quality & Anti-AI-Slop Rules

All user-facing copy, interface labels, microcopy, and system notices **MUST** adhere to `docs/content/content-quality-standard.md`.

AI coding agents are strictly prohibited from introducing:
- **Unsupported Statistics or Fake User Counts** (e.g. claiming millions of active researchers without telemetry data).
- **Fabricated Testimonials or Case Studies** (e.g. fictitious Stanford/MIT quotes).
- **Decorative Technical Badges** (e.g. "Cryptographic Anchor", "Neural Drift", "Quantum Secured").
- **Repetitive Linguistic Tropes** (e.g. symmetrical "— not just X, but Y" constructions, excessive em dashes).
- **Interface Meta-Commentary** in empty states or error dialogs (explaining animation physics or AI reasoning).
- **Generic Marketing Buzzwords** (e.g. "seamless", "revolutionary", "supercharge", "unleash").

Every piece of user-facing content must describe genuine application capabilities and serve a tangible user need.
