"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import { Settings } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { SettingsDrawer } from "@/components/settings/SettingsDrawer";
import { useSettings } from "@/lib/hooks/useSettings";
import { Logo } from "@/components/ui/Logo";

export function AppShell({ children }: { children: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />

      <div className="relative flex min-h-dvh flex-1 flex-col bg-forest-900">
        <Image
          src="/logo-mark.png"
          alt=""
          aria-hidden
          width={340}
          height={340}
          className="pointer-events-none fixed bottom-[-30px] right-[-20px] z-0 h-auto w-[220px] opacity-95 sm:bottom-[-40px] sm:right-[-30px] sm:w-[340px]"
        />

        <header className="relative z-10 flex items-center justify-between border-b border-sand-200 bg-white/70 px-4 py-3 sm:hidden">
          <div className="flex items-center gap-2">
            <Logo size={24} />
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

        <main className="relative z-10 flex-1 pb-24 sm:pb-8">
          <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">{children}</div>
        </main>
      </div>

      <MobileBottomNav />
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
