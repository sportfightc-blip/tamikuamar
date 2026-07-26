import { LucideIcon } from "lucide-react";

export function CardTitle({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sea-950">
      <Icon size={17} className="text-sea-700" />
      {children}
    </h2>
  );
}
