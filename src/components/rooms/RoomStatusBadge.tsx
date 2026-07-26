import { Badge } from "@/components/ui/Badge";
import { StatusDot } from "@/components/ui/StatusDot";
import { RoomStatus } from "@/lib/operations";

type Tone = "ok" | "alert" | "warn" | "sea" | "neutral";

const STATUS_META: Record<RoomStatus, { label: string; tone: Tone }> = {
  livre: { label: "Livre", tone: "neutral" },
  ocupado: { label: "Ocupado", tone: "ok" },
  "entrada-hoje": { label: "Entrada hoje", tone: "sea" },
  "saida-hoje": { label: "Saída hoje", tone: "alert" },
  "entrada-amanha": { label: "Entrada amanhã", tone: "warn" },
  "saida-amanha": { label: "Saída amanhã", tone: "warn" },
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge tone={meta.tone}>
      <StatusDot tone={meta.tone} />
      {meta.label}
    </Badge>
  );
}
