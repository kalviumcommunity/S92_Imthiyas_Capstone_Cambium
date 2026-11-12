import React from "react";
import GlobalSidebar from "@/components/GlobalSidebar";
import MobileNavigation from "@/components/MobileNavigation";
import OfflineBanner from "@/components/OfflineBanner";
import { CommandPalette } from "@/components/ui/command-palette";
import { ShortcutsModal } from "@/components/ui/shortcuts-modal";
import { ToastProvider } from "@/components/ui/toast";
import { GlobalRagAssistant } from "@/components/ai/GlobalRagAssistant";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] font-sans transition-colors duration-200">
        {/* Mobile Navigation Shell (Top bar + Drawer + Bottom dock, md:hidden) */}
        <MobileNavigation />

        {/* Persistent Desktop Global Navigation Shell (hidden on mobile, md:flex) */}
        <GlobalSidebar />

        {/* Screen Content Container with Rapid Spatial Context Shift */}
        <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col pb-14 md:pb-0 animate-in fade-in zoom-in-[0.99] duration-150 ease-out">
          <OfflineBanner />
          {children}
        </div>

        {/* Global Overlays, Floating AI & Modals */}
        <CommandPalette />
        <ShortcutsModal />
        <GlobalRagAssistant />
      </div>
    </ToastProvider>
  );
}
