import { Badge } from "@/components/ui/Badge";
import { RoomStatus } from "@/lib/operations";

const STATUS_META: Record<RoomStatus, { label: string; icon: string; tone: "ok" | "alert" | "warn" | "sea" | "neutral" }> = {
  livre: { label: "Livre", icon: "⚪", tone: "neutral" },
  ocupado: { label: "Ocupado", icon: "🟢", tone: "ok" },
  "entrada-hoje": { label: "Entrada hoje", icon: "🔵", tone: "sea" },
  "saida-hoje": { label: "Saída hoje", icon: "🔴", tone: "alert" },
  "entrada-amanha": { label: "Entrada amanhã", icon: "🟡", tone: "warn" },
  "saida-amanha": { label: "Saída amanhã", icon: "🟠", tone: "warn" },
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge tone={meta.tone}>
      <span>{meta.icon}</span>
      {meta.label}
    </Badge>
  );
}
