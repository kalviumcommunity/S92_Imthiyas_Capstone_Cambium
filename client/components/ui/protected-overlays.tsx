"use client";

import dynamic from "next/dynamic";

const CommandPalette = dynamic(
  () => import("@/components/ui/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);

const ShortcutsModal = dynamic(
  () => import("@/components/ui/shortcuts-modal").then((m) => m.ShortcutsModal),
  { ssr: false },
);

const GlobalRagAssistant = dynamic(
  () => import("@/components/ai/GlobalRagAssistant").then((m) => m.GlobalRagAssistant),
  { ssr: false },
);

export function ProtectedOverlays() {
  return (
    <>
      <CommandPalette />
      <ShortcutsModal />
      <GlobalRagAssistant />
    </>
  );
}
