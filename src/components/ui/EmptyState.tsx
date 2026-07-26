import { LucideIcon } from "lucide-react";

export function EmptyState({ message, icon: Icon }: { message: string; icon?: LucideIcon }) {
  return (
    <p className="flex items-center gap-2 py-2 text-sm text-foreground/45">
      {Icon && <Icon size={16} className="shrink-0" />}
      {message}
    </p>
  );
}
