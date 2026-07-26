import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Schedule, DailyOperation, WeeklyOperation } from "@/lib/types";
import { formatFullDatePt } from "@/lib/dates";

function isDaily(snapshot: DailyOperation | WeeklyOperation): snapshot is DailyOperation {
  return "breakfast" in snapshot;
}

export function HistoryCard({ schedule, onClick }: { schedule: Schedule; onClick: () => void }) {
  const snapshot = schedule.snapshot;

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer transition-shadow hover:shadow-md active:scale-[0.99]"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-sea-950">{formatFullDatePt(schedule.date)}</h3>
        <Badge tone={schedule.type === "daily" ? "sea" : "warn"}>
          {schedule.type === "daily" ? "Diário" : "Semanal"}
        </Badge>
      </div>
      {isDaily(snapshot) ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/60">
          <span>🍳 {snapshot.breakfast.totalPeople} pessoas</span>
          <span>🧹 {snapshot.cleaning.length} limpezas</span>
          <span>🔵 {snapshot.checkins.length} entradas</span>
          <span>🔴 {snapshot.checkouts.length} saídas</span>
        </div>
      ) : (
        <p className="text-sm text-foreground/60">Cronograma de 7 dias</p>
      )}
    </Card>
  );
}
