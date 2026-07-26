import { cn } from "@/lib/cn";
import { ReactNode } from "react";

type Tone = "ok" | "alert" | "warn" | "sea" | "neutral";

const tones: Record<Tone, string> = {
  ok: "bg-ok-100 text-ok-600",
  alert: "bg-alert-100 text-alert-600",
  warn: "bg-warn-100 text-warn-600",
  sea: "bg-sea-100 text-sea-800",
  neutral: "bg-sand-100 text-foreground/60",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
