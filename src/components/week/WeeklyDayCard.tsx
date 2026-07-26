import { Coffee, Sparkles, LogIn, LogOut } from "lucide-react";
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
        <span className="flex items-center gap-1.5">
          <Coffee size={14} /> {summary.breakfastPeople} pessoas
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} /> {summary.cleaningCount} limpezas
        </span>
        <span className="flex items-center gap-1.5">
          <LogIn size={14} /> {summary.checkinsCount} entrada(s)
        </span>
        <span className="flex items-center gap-1.5">
          <LogOut size={14} /> {summary.checkoutsCount} saída(s)
        </span>
      </div>
    </Card>
  );
}
