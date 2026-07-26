"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Waves } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "@/lib/nav";
import { useSettings } from "@/lib/hooks/useSettings";

export function Sidebar({ onOpenSettings }: { onOpenSettings: () => void }) {
  const pathname = usePathname();
  const { settings } = useSettings();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sand-200 bg-white/70 px-4 py-6 sm:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <Waves className="text-sea-700" size={26} />
        <div>
          <p className="text-sm font-semibold leading-tight text-sea-950">
            {settings.pousadaName}
          </p>
          <p className="text-xs text-foreground/50">Painel de Operação</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sea-800 text-white shadow-sm"
                  : "text-foreground/65 hover:bg-sand-100",
              )}
            >
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onOpenSettings}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/60 hover:bg-sand-100"
      >
        <Settings size={19} />
        Configurações
      </button>
    </aside>
  );
}
