"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/cn";
import { CleaningItem } from "@/lib/types";

export function TaskItem({
  item,
  completed,
  completedAt,
  onToggle,
}: {
  item: CleaningItem;
  completed: boolean;
  completedAt: string | null;
  onToggle: () => void;
}) {
  const label = item.type === "faxina" ? "Faxina concluída" : "Arrumação concluída";

  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
        completed
          ? "border-ok-100 bg-ok-100/60"
          : "border-sand-200 bg-white hover:bg-sand-50",
      )}
    >
      {completed ? (
        <CheckCircle2 className="shrink-0 text-ok-600" size={22} />
      ) : (
        <Circle className="shrink-0 text-foreground/25" size={22} />
      )}
      <div className="flex-1">
        <p
          className={cn(
            "text-sm font-medium",
            completed ? "text-ok-600 line-through" : "text-foreground/85",
          )}
        >
          {label}
        </p>
        {completed && completedAt && (
          <p className="text-xs text-foreground/45">
            Concluído às{" "}
            {new Date(completedAt).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </button>
  );
}
