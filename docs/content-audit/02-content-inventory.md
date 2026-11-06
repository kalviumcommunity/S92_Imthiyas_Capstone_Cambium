# Cambium Content Audit — Document 02: Content Inventory

This document maps all primary text elements, section headlines, microcopy patterns, and component strings audited across the repository.

## 1. Landing Page Surfaces (`client/app/page.tsx` & `client/components/landing/*`)
- **Hero Headline**: *"Your research deserves a home. Build your academic identity. Discover what's next."*
- **Scholarly Verification Strip**: 4-column statistical proof bar.
  - *Audit*: Found fabricated claim *"4.8M Verified Researchers · ORCID Anchor · Cryptographic"*. Needs replacement with authentic cross-disciplinary capability: *"100+ Research Disciplines · Global Taxonomy"*.
  - *Audit*: Found absolute *"100% Evidence-Linked"*. Needs replacement with *"Inspectable Citations · Verifiable DOIs & Open Datasets"*.
- **Knowledge Graph Header**:
  - *Audit*: Found *"Active Nodes: 20 · Cross-domain connections: 28 · Live Neural Drift"*. Replaced with *"Active Research Nodes: 20 · Cross-Discipline Connections: 28"*.
- **Feature Spotlights (Zig-Zag Sections)**:
  - *Audit*: Found repetitive *" — not just X, but Y"* constructions. Replaced with direct, active descriptions of search and collaboration tools.
- **Testimonials Section**:
  - *Audit*: Found fictional quotes from *"Dr. Elena Park, Stanford"* and *"Imthiyas, MIT"*. Replaced with authentic **"Designed for Scholar Workflows"** targeting PhD Researchers, Principal Investigators, and Cross-Disciplinary Collaborators.
- **Bottom Call to Action**:
  - *Audit*: Found *"Verified cryptographic ledger anchor"*. Replaced with actionable button: *"Explore Research Workspaces"*.

## 2. Authentication & Onboarding
- **Sign In (`client/app/(auth)/sign-in/page.tsx`)**: Cleaned button states to *"Sign in"* and *"Signing in…"*.
- **Sign Up (`client/app/(auth)/sign-up/page.tsx`)**: Replaced generic marketing slogans with clear account benefits.
- **Onboarding Welcome (`client/app/welcome/page.tsx`)**: Removed buzzword *"neural synthesis"* from topic tags.

## 3. Diagnostic & Error Pages
- **HTTP 403 Forbidden (`client/app/403/page.tsx`)**:
  - *Audit*: Found *"Restricted Institutional Enclave // MIT CSAIL Enclave #884 // cryptographic access request"*.
  - *Replacement*: Professional *"Access Restricted // You do not have permission to view this workspace. Request access from the workspace administrator below."*
- **HTTP 404 Not Found (`client/app/404/page.tsx` & `client/app/not-found.tsx`)**:
  - *Audit*: Found *"CAMBIUM INDEX // ARTIFACT_404 // UNMAPPED_COORDINATES // Research artifact has departed this index..."*.
  - *Replacement*: Crisp *"Page Not Found // The document, opportunity, or researcher profile you are looking for does not exist or has been moved."* with direct links to Workspace and Dashboard.
- **HTTP 429 Rate Limited (`client/app/429/page.tsx`)**:
  - *Audit*: Found *"Compute Governor // Hourly Reasoning Quota Depleted // Activate Lab Grant Burst (NIH R01) // Frontier Deductive Synthesis (Claude 3.7)"*.
  - *Replacement*: Clean *"Rate Limit Reached // You have reached the request limit for this hour. Please wait for the cooldown timer below before retrying."*

## 4. Protected Workspace & Application Routes
- **Research Inbox (`client/app/(protected)/notifications/page.tsx`)**:
  - *Audit*: Found null-state meta-commentary: *"You are experiencing the Cambium Reactive 3D Null State. Move your cursor to engage perspective physics and specular light."*.
  - *Replacement*: Contextual scholar message: *"You're all caught up. When researchers cite your work, leave peer reviews, or invite you to grants, updates will appear here."*.
- **Settings (`client/app/(protected)/settings/page.tsx`)**:
  - *Audit*: Found *"Configure how Cambium's neural assistants reason over your private corpus."*.
  - *Replacement*: *"Manage how the AI assistant indexes and searches your workspace documents."*.
- **Portfolio (`client/app/(protected)/portfolio/page.tsx`)**:
  - *Audit*: Found *"Verified cryptographic research momentum ledger"*.
  - *Replacement*: *"Verified Research Activity Log"*.
- **Profile (`client/app/(protected)/profile/page.tsx`)**:
  - *Audit*: Found *"Cryptographic Data Sovereignty"*.
  - *Replacement*: *"Data Privacy and Export"*.
- **Billing (`client/app/(protected)/billing/page.tsx` & `pricing/page.tsx`)**:
  - *Audit*: Found *"10,000 Neural AI Reasoning Tokens / month"*.
  - *Replacement*: *"10,000 AI Assistant Credits / month"*.
- **Command Palette (`client/components/ui/command-palette.tsx`)**:
  - *Audit*: Cleaned inflated buzzwords across 15 search commands.

