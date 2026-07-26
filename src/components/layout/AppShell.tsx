"use client";

import { ReactNode, useEffect, useState } from "react";
import { Settings, Waves } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { SettingsDrawer } from "@/components/settings/SettingsDrawer";
import { useSettings } from "@/lib/hooks/useSettings";
import { seedDemoData } from "@/lib/db/seed";

export function AppShell({ children }: { children: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    seedDemoData();
  }, []);

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />

      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-sand-200 bg-white/70 px-4 py-3 sm:hidden">
          <div className="flex items-center gap-2">
            <Waves className="text-sea-700" size={22} />
            <span className="text-sm font-semibold text-sea-950">{settings.pousadaName}</span>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="rounded-full p-2 text-sea-900/60 hover:bg-sand-100"
            aria-label="Configurações"
          >
            <Settings size={20} />
          </button>
        </header>

        <main className="flex-1 pb-24 sm:pb-8">
          <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">{children}</div>
        </main>
      </div>

      <MobileBottomNav />
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
