import { Card } from "@/components/ui/Card";
import { WeeklyDaySummary } from "@/lib/types";
import { formatWeekdayShortPt } from "@/lib/dates";

export function WeeklyDayCard({
  summary,
  onClick,
}: {
  summary: WeeklyDaySummary;
  onClick: () => void;
}) {
  const { weekday, day, month } = formatWeekdayShortPt(summary.date);

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer transition-shadow hover:shadow-md active:scale-[0.99]"
    >
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-semibold tracking-wide text-sea-700">{weekday}</span>
        <span className="text-sm font-semibold text-sea-950">
          {day} {month}
        </span>
      </div>
      <div className="flex flex-col gap-1 text-sm text-foreground/65">
        <span>🍳 {summary.breakfastPeople} pessoas</span>
        <span>🧹 {summary.cleaningCount} limpezas</span>
        <span>🔵 {summary.checkinsCount} entrada(s)</span>
        <span>🔴 {summary.checkoutsCount} saída(s)</span>
      </div>
    </Card>
  );
}
