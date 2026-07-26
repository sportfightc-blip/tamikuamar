import { cn } from "@/lib/cn";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-sand-200 bg-white/90 p-4 shadow-[0_1px_2px_rgba(15,52,84,0.04),0_4px_16px_rgba(15,52,84,0.05)]",
        className,
      )}
      {...props}
    />
  );
}
