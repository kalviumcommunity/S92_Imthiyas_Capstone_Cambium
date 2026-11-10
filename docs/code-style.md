# Engineering Code Style & Architectural Standards (code-style.md)
## Cambium — AI-Powered Research Opportunity Discovery & Intelligence Platform
**The Enterprise Research Operating System**

---

### Metadata
- **Document ID**: `STYLE-CAMBIUM-2026-V2`
- **Product Name**: Cambium Research Platform
- **Lead Architect & Author**: Shaik Mohamed Imthiyas T
- **Status**: `ENFORCED CODE QUALITY STANDARD`
- **Current Version**: `2.0.0`
- **Target Audience**: Core Engineers, Contributors, AI Coding Agents, and CI Quality Gates.
- **Traceability**: Aligns with [`AGENTS.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/AGENTS.md) and [`docs/content/content-quality-standard.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/content/content-quality-standard.md).

---

## 1. Core Engineering Principles

1. **Deterministic Type Safety**: Strict TypeScript throughout. No unconstrained `any` types; all request payloads, database schemas, and store models are explicitly typed.
2. **Design Token Sovereignty**: Visual styling is strictly governed by the Living Materials design token system. Raw unapproved hex codes are prohibited.
3. **Defense-in-Depth Validation**: Data is validated at the client boundary, sanitized at the API controller DTO boundary, and constrained by relational foreign keys at the database level.
4. **Human-Centered Editorial Quality**: All user-facing text, error states, and tooltips follow our Anti-AI-Slop standard—clear, understated, credible, and free of generic hype.

---

## 2. Frontend Standards (`client/`)

### 2.1 Next.js 15 & React 19 Conventions
- **Server Components by Default**: Pages and layout wrappers in `client/app/` should execute on the server whenever possible.
- **Restricted `"use client"`**: Only add `"use client"` at the top of leaf components that strictly require:
  - Client state (`useState`, `useReducer`, Zustand store hooks)
  - DOM listeners or browser lifecycle (`useEffect`, `useRef`, `window.addEventListener`)
  - Event handlers (`onClick`, `onChange`, `onSubmit`)
- **File & Directory Structure**:
  ```
  client/
  ├── app/                        # Next.js App Router (pages, layouts, routes)
  │   ├── (auth)/                 # Public auth pages (/sign-in, /sign-up, /reset-password)
  │   ├── (protected)/            # Authenticated application views (/dashboard, /discover, /profile, etc.)
  │   └── globals.css             # Living Materials CSS variables and base typography
  ├── components/                 # Reusable UI inventory
  │   ├── ai/                     # AI Autocomplete, Copilot Studio, and assistants
  │   ├── auth/                   # Modals (Institutional SSO, Org switcher)
  │   └── ui/                     # Generic primitives (CommandPalette, ShortcutsModal)
  └── lib/                        # Stores, utilities, and API wrappers
      ├── ai/                     # AI Autocomplete hook and completion algorithms
      ├── scholarly-api.ts        # Federated scholarly API client (OpenAlex, arXiv, Crossref, DOAJ)
      └── store/                  # Zustand stores (useAuthStore, useSettingsStore)
  ```

### 2.2 Living Materials Design Tokens
Colors must consume semantic tokens from `tokens/cambium.tokens.json` or defined classes in `client/app/globals.css`.

| Token Role | Hex Code | Semantic Variable | Usage Scope |
| :--- | :--- | :--- | :--- |
| **Canopy** | `#3E6248` | `--color-canopy` | Primary brand accent, main CTA buttons, active tabs |
| **Parchment** | `#FAF7F0` | `--color-parchment` | Primary light background, reading canvas foundation |
| **Forest Ink** | `#202920` | `--color-forest-ink`| Primary high-contrast body and heading typography |
| **Limestone** | `#E4DCCB` | `--color-limestone` | Subtle surface borders, dividers, card boundaries |
| **Mineral Sand** | `#F2EBDD` | `--color-mineral-sand`| Card surfaces, secondary badges, input backgrounds |
| **Sage Mist** | `#DCE6D7` | `--color-sage-mist` | Hover highlights, active item selections |
| **Emerald Glow**| `#4ADE80` | `--color-emerald` | Dark mode active indicators, status badges, live feeds |

**Prohibited Styling Practices:**
- ❌ **Never** introduce raw, arbitrary hex values (e.g., `#ff0000`, `#0000ff`, `#3b82f6`).
- ❌ **Never** leave default browser box borders on inputs inside search pills or containers (use `.scholarly-search-pill`).
- ❌ **Never** use non-standard font stacks outside the defined Inter / Spectral serif pairings.

### 2.3 State Management Split
- **Server State**: Managed via `@tanstack/react-query` for asynchronous caching, polling, and invalidation.
- **Client UI State**: Managed via Zustand stores in `client/lib/store/` (e.g. `useAuthStore.ts`).
  - Keep stores lean and focused.
  - Synchronize persistent sessions to `localStorage` safely with server-side hydration guards.
- **URL State**: Native Next.js `useSearchParams()` and `usePathname()` for search queries, tabs, and filters.

### 2.4 Icon Standards
Standardize strictly on `lucide-react`:
- Primary navigation and inline action icons: `size={18}`
- Section header and modal title icons: `size={20}`
- Micro badges and status dots: `size={12}` or `size={14}`

---

## 3. Backend Standards (`server/`)

### 3.1 NestJS 10 Modular Architecture
Every domain feature resides in its own isolated module under `server/src/modules/`:
```
server/src/modules/<domain>/
├── <domain>.module.ts          # Module definition & dependency wiring
├── <domain>.controller.ts      # HTTP route endpoints & guard decorators
├── <domain>.service.ts         # Business logic and repository queries
├── dto/                        # Request and response Data Transfer Objects
│   ├── create-<domain>.dto.ts
│   └── update-<domain>.dto.ts
└── entities/                   # TypeORM database entity definitions
    └── <domain>.entity.ts
```

### 3.2 Data Access & TypeORM Best Practices
- **Strict Parameter Binding**: Always use parameterized queries in query builders to completely eliminate SQL injection:
  ```typescript
  // ✅ ENFORCED: Parameterized binding
  const user = await this.userRepo
    .createQueryBuilder("user")
    .where("user.id = :id", { id })
    .getOne();

  // ❌ PROHIBITED: String concatenation
  // const user = await this.userRepo.query(`SELECT * FROM users WHERE id = '${id}'`);
  ```
- **Transactions**: For multi-table writes (e.g. project creation + member assignment + outbox event), wrap operations in `DataSource.transaction()` or `QueryRunner`.

### 3.3 Controller DTOs & Validation
Every controller request body must be typed with a dedicated DTO decorated with `class-validator`:
```typescript
import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength } from 'class-validator';

export class CreateOpportunityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  fundingAmount?: string;
}
```

### 3.4 Exception Handling
Throw standard NestJS HTTP exceptions with informative, sanitized error messages:
- `NotFoundException('Opportunity with specified ID not found')`
- `UnauthorizedException('Invalid or expired authentication credentials')`
- `ForbiddenException('Insufficient permissions for compliance audit export')`
- `BadRequestException('Invalid date format or deadline constraint')`
- **Never** leak database stack traces or raw PostgreSQL error codes directly to the client response.

---

## 4. Content Quality & Anti-AI-Slop Standards

All copy, empty states, system alerts, and documentation must adhere to [`docs/content/content-quality-standard.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/content/content-quality-standard.md):

| Prohibited Anti-Pattern | Enforced Production Standard |
| :--- | :--- |
| **Unsupported Claims**<br>*(e.g., "Used by millions of researchers worldwide")* | **Verifiable Telemetry**<br>*(State actual catalog indices: "250M+ open publications indexed via OpenAlex & Crossref")* |
| **Decorative Buzzword Badges**<br>*(e.g., "Neural Quantum Mesh")* | **Functional Technical Labels**<br>*(e.g., "PostgreSQL 16 · pgvector · BullMQ")* |
| **Repetitive Linguistic Tropes**<br>*(e.g., "Not just a search engine, but a revolution")* | **Direct, Clear Descriptions**<br>*(e.g., "Aggregates grants, preprints, and open CFP deadlines into a single feed.")* |
| **Marketing Hyperbole**<br>*(e.g., "Supercharge your research to the next level")* | **Professional Scholarly Tone**<br>*(e.g., "Synthesize cross-disciplinary papers with citation grounding.")* |

---

## 5. Quality Verification Commands

Before opening a pull request or pushing code to release branches, execute these local quality gates:

```bash
# 1. Type check and build client
npm --prefix client run build

# 2. Type check and compile server
npm --prefix server run build

# 3. Execute unit test suite (Vitest)
npm --prefix server test

# 4. Run linting across client and server
npm --prefix client run lint
npm --prefix server run lint
```

