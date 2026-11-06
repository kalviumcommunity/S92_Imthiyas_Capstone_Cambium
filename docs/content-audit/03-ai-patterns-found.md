# Cambium Content Audit — Document 03: AI Writing Patterns Found & Resolved

This document details the specific linguistic fingerprints, structural patterns, and rhetorical tropes identified in the codebase, along with the editorial methodology used to resolve them.

---

### Pattern 1: Artificial Contrast ("Not Just X, But Y")
* **Why it is an AI trope**: Large Language Models frequently default to this rhetorical device when asked to write product marketing, producing repetitive sentence symmetry.
* **Occurrences in Cambium**:
  - `EcosystemMapSection.tsx:19`: *"Cambium understands your work — not just your search queries."*
  - `FeaturesSection2.tsx:298`: *"Navigate the research landscape through semantic relationships — not just keywords."*
  - `TestimonialsSection.tsx:7`: *"Cambium gives my research a place to live — not just a list of papers."*
* **Resolution**: Replaced with direct, functional statements describing the concrete product capability.

---

### Pattern 2: Decorative Technical Fittings & Pseudo-Science Badges
* **Why it is harmful**: When an interface displays badges like *"Cryptographic Anchor"* or *"Neural Drift"* on features that are simple OAuth integrations or UI animations, it creates an impression of superficial hype rather than engineering substance.
* **Occurrences in Cambium**:
  - `page.tsx:526`: `ORCID Anchor · Cryptographic` → Replaced with `ORCID 2.0 Integration`.
  - `page.tsx:631`: `Live Neural Drift` → Replaced with `Cross-Domain Citation Links`.
  - `portfolio/page.tsx:497`: `Verified cryptographic research momentum ledger` → Replaced with `Verified Research Activity Log`.
  - `profile/page.tsx:417`: `Cryptographic Data Sovereignty` → Replaced with `Data Privacy and Export`.
  - `403/page.tsx`: `MIT CSAIL Enclave #884` → Replaced with `Confidential Laboratory Workspace`.

---

### Pattern 3: Interface Meta-Commentary in Empty & Error States
* **Why it is harmful**: Users encounter empty states to learn what to do next. Explaining CSS physics or animation shaders inside production empty states breaks immersion and sounds generated.
* **Occurrences in Cambium**:
  - `notifications/page.tsx:476`: *"You are experiencing the Cambium Reactive 3D Null State. Move your cursor across the card to engage perspective physics and specular light."*
* **Resolution**: Replaced with clean, helpful copy answering:
  1. What is missing? (Zero active notifications)
  2. Why? (All caught up)
  3. What happens next? (Updates will arrive when authors cite or review your work).

---

### Pattern 4: Buzzword Inflation in Navigation & Search Commands
* **Why it is harmful**: Users searching for features in a command palette (`Cmd+K`) want fast, predictable, noun-verb descriptions, not promotional titles.
* **Occurrences in Cambium**:
  - `command-palette.tsx:61`: `Discover Research Engine` → `Discover Literature`
  - `command-palette.tsx:196`: `Agentic RAG Paper Synthesis Studio` → `Split-Pane Paper Reader`
  - `command-palette.tsx:205`: `Enterprise Audit Ledger & RBAC Center` → `Audit Log & Permissions`
  - `command-palette.tsx:214`: `FAIR Data Ingestion & Repository Bridge` → `Data Management & Repository Sync`
  - `command-palette.tsx:187`: `Semantic Constellation Graph Explorer` → `Citation Knowledge Graph`

