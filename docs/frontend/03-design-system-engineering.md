# Design System & Component Engineering (`03`)

**Program**: Cambium Research Principal Frontend Engineering Program

---

## 1. Living Materials Design Tokens Preserved
- **Sources of Truth**: [`tokens/cambium.tokens.json`](../../tokens/cambium.tokens.json), [`client/app/globals.css`](../../client/app/globals.css), and [`client/lib/design-tokens.ts`](../../client/lib/design-tokens.ts).
- **Theme Modes**: Full parity across **Parchment Light** (`#FAF7F0` background, `#202920` ink, `#3E6248` Canopy primary) and **Bioluminescent Botanical Dark** (`#0E140F` background, `#EDEAE2` ink, `#4ADE80` Emerald accent).
- **Typography**: `Manrope` (`--font-brand`), `Plus Jakarta Sans` (`--font-sans`), `Newsreader` (`--font-serif`), `JetBrains Mono` (`--font-data`) preloaded cleanly via `next/font/google` in `app/layout.tsx`.

## 2. UI Primitive & Overlay Governance
- Radix UI primitives under `client/components/ui/` (`dialog`, `dropdown-menu`, `select`, `tabs`, `tooltip`, `checkbox`, `button`, `toast`) paired with `lucide-react` icons.
- **Checkout Modal Accessibility**: Added semantic `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, inline `role="alert"` validation/error banner, and `Escape` key dismissal to [`PaymentCheckoutModal.tsx`](../../client/components/billing/PaymentCheckoutModal.tsx).
- **Virtualization**: [`VirtualizedAuditLedger.tsx`](../../client/components/ui/VirtualizedAuditLedger.tsx) renders large SHA-256 ledger views efficiently via `@tanstack/react-virtual`.
