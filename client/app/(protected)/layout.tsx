import React from "react";
import GlobalSidebar from "@/components/GlobalSidebar";
import { CommandPalette } from "@/components/ui/command-palette";
import { ShortcutsModal } from "@/components/ui/shortcuts-modal";
import { ToastProvider } from "@/components/ui/toast";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#FAF7F0] text-[#202920] font-sans">
        {/* Persistent Global Navigation Shell */}
        <GlobalSidebar />

        {/* Screen Content Container with Rapid Spatial Context Shift */}
        <div className="flex-1 min-w-0 h-screen overflow-hidden flex flex-col animate-in fade-in zoom-in-[0.99] duration-150 ease-out">
          {children}
        </div>

        {/* Global Overlays & Modals */}
        <CommandPalette />
        <ShortcutsModal />
      </div>
    </ToastProvider>
  );
}
